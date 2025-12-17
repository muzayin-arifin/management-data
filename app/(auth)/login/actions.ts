'use server'

import { AuthService } from '@/services/authService'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    console.warn('[LoginAction] Missing email or password');
    return { error: 'Email and password are required' }
  }

  console.log(`[LoginAction] Submitting login for: ${email}`);
  const result = await AuthService.login(email, password)

  if (result.success) {
    redirect('/dashboard')
  } else {
    return { error: result.error }
  }
}
