
import { JsonDb } from '@/lib/db/jsonDb';
import { Student, StudentProps } from '@/lib/oop/Student';

export class StudentService {
  private static db = new JsonDb('students.json');

  static async getAll() {
    // Read directly from JSON file
    const students = this.db.read<StudentProps>();
    // Sort by creation time if available, or just reverse to show newest first
    return students.reverse(); 
  }

  static async getById(id: string) {
    const student = this.db.findOne<StudentProps>((s) => s.id === id);
    
    if (!student) throw new Error("Student not found");
    
    return student;
  }

  static async create(studentProps: StudentProps) {
    // OOP Validation
    const student = new Student(studentProps);
    const validation = student.validate();
    if (!validation.success) {
      throw new Error("Validation Error: " + validation.error?.message);
    }

    const newStudent: StudentProps & { created_at: string } = {
      ...student.toJSON(),
      id: `std-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    this.db.insert(newStudent);
    return newStudent;
  }

  static async update(id: string, updates: Partial<StudentProps>) {
    const updatedStudent = this.db.update<StudentProps>(
      (s) => s.id === id,
      updates
    );
    
    if (!updatedStudent) {
      throw new Error("Student not found");
    }
    
    return updatedStudent;
  }

  static async delete(id: string) {
    const isDeleted = this.db.delete<StudentProps>((s) => s.id === id);
    
    if (!isDeleted) {
      throw new Error("Student not found or already deleted");
    }
    
    return true;
  }
}
