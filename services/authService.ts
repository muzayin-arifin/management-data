
import { JsonDb } from '@/lib/db/jsonDb';
import { signToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import bcrypt from 'bcrypt';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
}

export class AuthService {
  private static db = new JsonDb('users.json');

  static async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`[AuthService] Attempting login for: ${email}`);
      
      // Find user by Email
      const user = this.db.findOne<User>((u) => 
        u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        console.warn('[AuthService] User not found');
        return { success: false, error: 'User not found' };
      }

      console.log(`[AuthService] User found: ${user.email}, Role: ${user.role}`);

      // Verify password (BCrypt)
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
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
      const existing = this.db.findOne<User>((u) => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existing) {
        return { success: false, error: 'User already exists' };
      }

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        password: hashedPassword,
        name,
        role: 'student'
      };

      this.db.insert(newUser);
      
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
    
    // We can't verify here easily without circular dep or extra logic, 
    // but typically we verify token to get payload.
    // For now returning token exists check or implemented verifyToken usage elsewhere.
    return { token };
  }
}
