
import { z } from 'zod';

export interface StudentProps {
  id: string;
  name: string;
  student_id: string; // NIM
  major: string;
  semester: number;
  email: string;
}

export const studentSchema = z.object({
  name: z.string().regex(/^[A-Za-z ]+$/, 'Name must contain only letters and spaces').min(2),
  student_id: z.string().regex(/^[0-9]+$/, 'Student ID must be numeric').min(5),
  major: z.string().min(2),
  semester: z.number().int().min(1).max(14),
  email: z.string().email().regex(/^[\w.-]+@[\w.-]+\.\w+$/, 'Invalid email format'),
});

export class Student {
  private _id: string;
  private _name: string;
  private _student_id: string;
  private _major: string;
  private _semester: number;
  private _email: string;

  constructor(props: StudentProps) {
    this._id = props.id;
    this._name = props.name;
    this._student_id = props.student_id;
    this._major = props.major;
    this._semester = props.semester;
    this._email = props.email;
  }

  // Getters
  get id() { return this._id; }
  get name() { return this._name; }
  set name(val: string) { this._name = val; } // basic setter example
  get student_id() { return this._student_id; }
  get major() { return this._major; }
  get semester() { return this._semester; }
  get email() { return this._email; }

  // Validation
  public validate(): { success: boolean; error?: z.ZodError } {
    const result = studentSchema.safeParse({
      name: this._name,
      student_id: this._student_id,
      major: this._major,
      semester: this._semester,
      email: this._email,
    });
    return { success: result.success, error: result.success ? undefined : result.error };
  }

  // Serialization
  public toJSON(): StudentProps {
    return {
      id: this._id,
      name: this._name,
      student_id: this._student_id,
      major: this._major,
      semester: this._semester,
      email: this._email,
    };
  }
}
