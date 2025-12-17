'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// Initial state for the form
const initialState = {
  error: '',
}

import { IntroOverlay } from '@/components/ui/intro-overlay'

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, initialState)

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 p-4">
      <IntroOverlay />
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-slate-950">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse delay-1000" />
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <Card className="relative w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95 slide-in-from-bottom-5 duration-700">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 animate-in zoom-in duration-500 delay-300 fill-mode-backwards">
             <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white animate-in slide-in-from-bottom-2 fade-in duration-500 delay-500 fill-mode-backwards">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-400 text-base animate-in slide-in-from-bottom-2 fade-in duration-500 delay-700 fill-mode-backwards">
            Sign in to access your student dashboard
          </CardDescription>
        </CardHeader>
        
        <form action={action}>
          <CardContent className="space-y-5">
            {state?.error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400 animate-in fade-in slide-in-from-top-1">
                {state.error}
              </div>
            )}
            
            <div className="space-y-2 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-700 fill-mode-backwards">
              <Label htmlFor="email" className="text-slate-300 font-medium ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-400 group-focus-within:text-indigo-500" />
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="name@example.com"
                  required
                  className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50 transition-all h-11"
                />
              </div>
            </div>
            
            <div className="space-y-2 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-1000 fill-mode-backwards">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300 font-medium ml-1">Password</Label>
                <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-400 group-focus-within:text-indigo-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50 transition-all h-11"
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-6 pt-2 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-[1200ms] fill-mode-backwards">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 h-11 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            
            <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
                </div>
            </div>
            
            <div className="text-center text-sm text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline hover:underline-offset-4 transition-all">
                Create an account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      
    </div>
  )
}
