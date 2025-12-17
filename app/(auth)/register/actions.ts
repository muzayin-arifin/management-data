'use server'

import { AuthService } from '@/services/authService'
import { redirect } from 'next/navigation'

export async function registerAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  const fullname = formData.get('fullname') as string

  if (!email || !password || !confirmPassword || !fullname) {
    return { error: 'All fields are required' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  const result = await AuthService.register(email, password, fullname)



  if (result.success) {
    redirect('/login')
  } else {
    return { error: result.error }
  }
}
