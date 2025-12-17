
import { getDb, Collections } from '@/lib/db/mongodb';
import { Student, StudentProps } from '@/lib/oop/Student';
import { ObjectId } from 'mongodb';

export class StudentService {
  static async getAll() {
    const db = await getDb();
    const students = await db.collection(Collections.STUDENTS)
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    
    // Transform _id to id for frontend compatibility
    return students.map(s => ({
      ...s,
      id: s._id.toString(),
      _id: undefined
    }));
  }

  static async getById(id: string) {
    const db = await getDb();
    
    // Try to find by custom id first, then by MongoDB _id
    let student = await db.collection(Collections.STUDENTS).findOne({ id });
    
    if (!student && ObjectId.isValid(id)) {
      student = await db.collection(Collections.STUDENTS).findOne({ _id: new ObjectId(id) });
    }
    
    if (!student) throw new Error("Student not found");
    
    return {
      ...student,
      id: student.id || student._id.toString(),
      _id: undefined
    };
  }

  static async create(studentProps: StudentProps) {
    const db = await getDb();
    
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

    await db.collection(Collections.STUDENTS).insertOne(newStudent);
    return newStudent;
  }

  static async update(id: string, updates: Partial<StudentProps>) {
    const db = await getDb();
    
    // Try to update by custom id first
    let result = await db.collection(Collections.STUDENTS).findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    
    // If not found by custom id, try by MongoDB _id
    if (!result && ObjectId.isValid(id)) {
      result = await db.collection(Collections.STUDENTS).findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updates },
        { returnDocument: 'after' }
      );
    }
    
    if (!result) {
      throw new Error("Student not found");
    }
    
    return {
      ...result,
      id: result.id || result._id.toString(),
      _id: undefined
    };
  }

  static async delete(id: string) {
    const db = await getDb();
    
    // Try to delete by custom id first
    let result = await db.collection(Collections.STUDENTS).deleteOne({ id });
    
    // If not deleted, try by MongoDB _id
    if (result.deletedCount === 0 && ObjectId.isValid(id)) {
      result = await db.collection(Collections.STUDENTS).deleteOne({ _id: new ObjectId(id) });
    }
    
    if (result.deletedCount === 0) {
      throw new Error("Student not found or already deleted");
    }
    
    return true;
  }
}
