'use client'

import { useActionState } from 'react'
import { registerAction } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, User, Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const initialState = {
  error: '',
}

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(registerAction, initialState)

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-slate-950">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse delay-1000" />
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <Card className="relative w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95 slide-in-from-bottom-5">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 shadow-lg shadow-pink-500/20">
             <User className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Create Account
          </CardTitle>
          <CardDescription className="text-slate-400 text-base">
            Join us and start managing your academic journey
          </CardDescription>
        </CardHeader>
        
        <form action={action}>
          <CardContent className="space-y-5">
            {state?.error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400 animate-in fade-in slide-in-from-top-1">
                {state.error}
              </div>
            )}
            


            <div className="space-y-2">
              <Label htmlFor="fullname" className="text-slate-300 font-medium ml-1">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-500 transition-colors group-hover:text-pink-400 group-focus-within:text-pink-500" />
                <Input
                  id="fullname"
                  name="fullname"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-pink-500 focus-visible:border-pink-500/50 transition-all h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-medium ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500 transition-colors group-hover:text-pink-400 group-focus-within:text-pink-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-pink-500 focus-visible:border-pink-500/50 transition-all h-11"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 font-medium ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 transition-colors group-hover:text-pink-400 group-focus-within:text-pink-500" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-pink-500 focus-visible:border-pink-500/50 transition-all h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300 font-medium ml-1">Confirm</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 transition-colors group-hover:text-pink-400 group-focus-within:text-pink-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-pink-500 focus-visible:border-pink-500/50 transition-all h-11"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-6 pt-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white shadow-lg shadow-pink-500/25 h-11 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            
            <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900 px-2 text-slate-500">Or return to</span>
                </div>
            </div>
            
            <div className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-pink-400 hover:text-pink-300 hover:underline hover:underline-offset-4 transition-all">
                Sign in here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      
    </div>
  )
}
