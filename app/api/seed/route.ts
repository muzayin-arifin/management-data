import { NextResponse } from 'next/server';
import { JsonDb } from '@/lib/db/jsonDb';
import bcrypt from 'bcrypt';

// Seed data for users (passwords will be hashed)
const seedUsers = [
  {
    id: 'user-admin-001',
    email: 'admin@example.com',
    password: '12345', // Will be hashed
    name: 'Admin System',
    role: 'admin'
  },
  {
    id: 'user-muzayin-001',
    email: 'muzayin@example.com',
    password: '12345', // Will be hashed
    name: 'Muzayin',
    role: 'admin'
  }
];

// Seed data for students
const seedStudents = [
  {
    id: 'std-seed-001',
    student_id: '1001',
    name: 'Alice Johnson',
    major: 'Computer Science',
    semester: 3,
    ipk: 3.85,
    email: 'alice@example.com',
    age: 20,
    created_at: new Date().toISOString()
  },
  {
    id: 'std-seed-002',
    student_id: '1002',
    name: 'Budi Santoso',
    major: 'Sistem Informasi',
    semester: 5,
    ipk: 3.45,
    email: 'budi@example.com',
    age: 21,
    created_at: new Date().toISOString()
  },
  {
    id: 'std-seed-003',
    student_id: '1003',
    name: 'Citra Lestari',
    major: 'Teknik Informatika',
    semester: 1,
    ipk: 3.90,
    email: 'citra@example.com',
    age: 18,
    created_at: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const studentDb = new JsonDb('students.json');
    const userDb = new JsonDb('users.json');
    
    // 1. Seed Students
    const currentStudents = studentDb.read<any>();
    let studentsAdded = 0;

    for (const student of seedStudents) {
      if (!currentStudents.find((s: any) => s.id === student.id)) {
        studentDb.insert(student);
        studentsAdded++;
      }
    }

    // 2. Seed Users
    const currentUsers = userDb.read<any>();
    let usersAdded = 0;
    let usersUpdated = 0;

    for (const user of seedUsers) {
      const existingUserIndex = currentUsers.findIndex((u: any) => 
        u.email === user.email
      );

      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const userToSave = { ...user, password: hashedPassword };

      if (existingUserIndex === -1) {
        // Insert new
        userDb.insert(userToSave);
        usersAdded++;
      } else {
        // Update existing passwords even for existing users to ensure BCrypt migration
        userDb.update((u: any) => u.email === user.email, { password: hashedPassword });
        usersUpdated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with hashed passwords!',
      data: {
        students_added: studentsAdded,
        total_students: studentDb.read().length,
        users_added: usersAdded,
        users_updated: usersUpdated,
        total_users: userDb.read().length
      }
    });
  } catch (error: any) {
    console.error('[Seed API] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
