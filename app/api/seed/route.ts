import { NextResponse } from 'next/server';
import { getDb, Collections } from '@/lib/db/mongodb';

// Seed data for users
const seedUsers = [
  {
    id: 'user-admin-001',
    email: 'admin@example.com',
    password: '12345',
    name: 'Admin System',
    role: 'admin'
  },
  {
    id: 'user-muzayin-001',
    email: 'muzayin@example.com',
    password: '12345',
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
    email: 'citra@example.com',
    age: 18,
    created_at: new Date().toISOString()
  }
];

export async function GET() {
  try {
    const db = await getDb();
    
    // Seed Users
    const usersCollection = db.collection(Collections.USERS);
    for (const user of seedUsers) {
      // Upsert - insert if not exists
      await usersCollection.updateOne(
        { email: user.email },
        { $setOnInsert: user },
        { upsert: true }
      );
    }
    
    // Seed Students
    const studentsCollection = db.collection(Collections.STUDENTS);
    for (const student of seedStudents) {
      // Upsert - insert if not exists
      await studentsCollection.updateOne(
        { student_id: student.student_id },
        { $setOnInsert: student },
        { upsert: true }
      );
    }

    // Get counts
    const userCount = await usersCollection.countDocuments();
    const studentCount = await studentsCollection.countDocuments();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        users: userCount,
        students: studentCount
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
