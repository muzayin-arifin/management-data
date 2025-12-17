
import { NextResponse } from 'next/server';
import { StudentService } from '@/services/studentService';

export async function GET() {
  try {
    const students = await StudentService.getAll();
    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const students = await StudentService.create(body);
    return NextResponse.json(students, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
