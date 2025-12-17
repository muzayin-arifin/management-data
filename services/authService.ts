
import { JsonDb } from '@/lib/db/jsonDb';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

const usersDb = new JsonDb('users.json');

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
}

export class AuthService {
  static async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`[AuthService] Attempting login for: ${email}`);
      
      // Find user in JSON database
      const user = usersDb.findOne<User>(u => u.email === email || u.email === email.toLowerCase());

      if (!user) {
        console.warn('[AuthService] User not found');
        return { success: false, error: 'User not found' };
      }

      console.log(`[AuthService] User found: ${user.email}, Role: ${user.role}`);

      // Verify password (plain text comparison for simplicity)
      if (password !== user.password) {
        console.warn('[AuthService] Invalid password');
        return { success: false, error: 'Invalid password' };
      }

      // Generate JWT Token
      const token = await signToken({ 
        sub: user.id, 
        email: user.email, 
        role: user.role 
      });

      // Set Cookie
      const cookieStore = await cookies();
      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7200, // 2 hours
        path: '/'
      });
      
      console.log('[AuthService] Login successful');
      return { success: true };
    } catch (err: any) {
      console.error('[AuthService] Exception:', err);
      return { success: false, error: err.message };
    }
  }

  static async register(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if user exists
      const existing = usersDb.findOne<User>(u => u.email === email);
      
      if (existing) {
        return { success: false, error: 'User already exists' };
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        password, // Plain text for demo
        name,
        role: 'student'
      };

      usersDb.insert(newUser);
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  static async logout() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
  }

  static async getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;
    
    return { token };
  }
}
