
import { Student, StudentProps } from "./Student";
import { linearSearch, binarySearch } from "@/utils/search";
import { insertionSort, mergeSort, shellSort } from "@/utils/sort";

export class StudentManager {
  private students: Student[];

  constructor(initialData: StudentProps[] = []) {
    this.students = initialData.map(s => new Student(s));
  }

  // CRUD Operations
  public addStudent(student: Student) {
    const validation = student.validate();
    if (!validation.success) {
      throw new Error("Invalid student data: " + validation.error?.message);
    }
    // Check duplicates
    if (this.students.some(s => s.student_id === student.student_id)) {
      throw new Error("Student ID already exists");
    }
    this.students.push(student);
  }

  public updateStudent(id: string, updatedData: Partial<StudentProps>) {
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Student not found");

    const current = this.students[index].toJSON();
    const newProps = { ...current, ...updatedData };
    
    const updatedStudent = new Student(newProps);
    const validation = updatedStudent.validate();
    if (!validation.success) {
      throw new Error("Validation failed: " + validation.error?.message);
    }

    this.students[index] = updatedStudent;
  }

  public deleteStudent(id: string) {
    this.students = this.students.filter(s => s.id !== id);
  }

  public getStudents(): Student[] {
    return this.students;
  }

  // Algorithm Wrappers
  public search(query: string, type: 'linear' | 'binary' = 'linear'): Student[] { 
    if (type === 'binary') {
        // Binary search requires sorted data by ID
        // We will sort temporary data for the search
        const sorted = this.sortByAlgorithm('student_id', 'merge', 'asc');
        const result = binarySearch(sorted, query);
        return result ? [result] : [];
    }
    // Default to linear
    return linearSearch(this.students, query, 'name'); 
  }

  public sortByAlgorithm(field: 'name' | 'student_id', algorithm: 'insertion' | 'merge' | 'shell', direction: 'asc' | 'desc' = 'asc') {
    if (algorithm === 'insertion') {
      return insertionSort([...this.students], field, direction);
    } else if (algorithm === 'shell') {
      return shellSort([...this.students], field, direction);
    } else {
      return mergeSort([...this.students], field, direction);
    }
  }

  // Utility
  public exportToJSON(): string {
    return JSON.stringify(this.students.map(s => s.toJSON()), null, 2);
  }

  public loadFromJSON(json: string) {
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data)) throw new Error("Invalid JSON format");
      
      this.students = []; 
      data.forEach((item: any) => {
        if (!item.id || !item.name) return; 
        this.addStudent(new Student(item)); 
      });
    } catch (e) {
      throw e;
    }
  }
}
