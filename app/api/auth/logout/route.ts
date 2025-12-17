
import { NextResponse } from 'next/server';
import { AuthService } from '@/services/authService';

export async function POST() {
  await AuthService.logout();
  return NextResponse.json({ success: true });
}
