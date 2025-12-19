import { NextResponse } from 'next/server';
import { StudentService } from '@/services/studentService';

export async function GET() {
  const logs: string[] = [];
  const log = (msg: string) => logs.push(msg);

  try {
    log('🚀 Starting Migration Verification...');

    // 1. Create
    const newStudent = await StudentService.create({
      id: '', // Service handles ID generation
      name: 'Test Student',
      student_id: '99999',
      major: 'Computer Science',
      semester: 1,
      email: 'test@example.com'
    });
    log(`✅ Created: ${newStudent.name} (${newStudent.id})`);

    // 2. Read All
    const allStudents = await StudentService.getAll();
    const found = allStudents.find(s => s.id === newStudent.id);
    if (!found) throw new Error('Created student not found in getAll()');
    log(`✅ Read All: Found ${allStudents.length} students`);

    // 3. Update
    const updated = await StudentService.update(newStudent.id, { semester: 2 });
    if (updated.semester !== 2) throw new Error('Update failed');
    log(`✅ Updated: Semester is now ${updated.semester}`);

    // 4. Delete
    await StudentService.delete(newStudent.id);
    
    // Verify deletion
    try {
      await StudentService.getById(newStudent.id);
      throw new Error('Student still exists after delete');
    } catch (e: any) {
      if (e.message === 'Student not found') {
        log(`✅ Deleted: Student no longer pertains`);
      } else {
        throw e;
      }
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'All CRUD operations passed verification!',
      logs 
    });

  } catch (error: any) {
    console.error('Verification failed:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Verification failed', 
      error: error.message,
      logs 
    }, { status: 500 });
  }
}
