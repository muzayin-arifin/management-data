import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export class JsonDb {
  private filePath: string;

  constructor(filename: string) {
    this.filePath = path.join(DB_DIR, filename);
    
    // Initialize file if it doesn't exist
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  read<T>(): T[] {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${this.filePath}:`, error);
      return [];
    }
  }

  write<T>(data: T[]): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing to ${this.filePath}:`, error);
      throw error;
    }
  }

  findOne<T>(predicate: (item: T) => boolean): T | undefined {
    const data = this.read<T>();
    return data.find(predicate);
  }

  findMany<T>(predicate: (item: T) => boolean): T[] {
    const data = this.read<T>();
    return data.filter(predicate);
  }

  insert<T>(item: T): T {
    const data = this.read<T>();
    data.push(item);
    this.write(data);
    return item;
  }

  update<T>(predicate: (item: T) => boolean, updates: Partial<T>): T | null {
    const data = this.read<T>();
    const index = data.findIndex(predicate);
    
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates };
    this.write(data);
    return data[index];
  }

  delete<T>(predicate: (item: T) => boolean): boolean {
    const data = this.read<T>();
    const filteredData = data.filter(item => !predicate(item));
    
    if (filteredData.length === data.length) return false;
    
    this.write(filteredData);
    return true;
  }
}
