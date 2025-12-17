
import { JsonDb } from '@/lib/db/jsonDb';
import { Student, StudentProps } from '@/lib/oop/Student';

const studentsDb = new JsonDb('students.json');

export class StudentService {
  static async getAll() {
    const students = studentsDb.read<any>();
    // Sort by created_at descending
    return students.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  static async getById(id: string) {
    const student = studentsDb.findOne<any>(s => s.id === id);
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

    const newStudent = {
      ...student.toJSON(),
      id: `std-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    studentsDb.insert(newStudent);
    return newStudent;
  }

  static async update(id: string, updates: Partial<StudentProps>) {
    const updatedStudent = studentsDb.update<any>(
      s => s.id === id,
      updates
    );
    
    if (!updatedStudent) {
      throw new Error("Student not found");
    }
    
    return updatedStudent;
  }

  static async delete(id: string) {
    const deleted = studentsDb.delete<any>(s => s.id === id);
    
    if (!deleted) {
      throw new Error("Student not found or already deleted");
    }
    
    return true;
  }
}
