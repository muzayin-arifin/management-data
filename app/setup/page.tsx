'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2, Database, Rocket } from 'lucide-react'

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>('')

  const handleSeed = async () => {
    setLoading(true)
    setStatus('Seeding database...')
    try {
      const response = await fetch('/api/seed')
      const data = await response.json()
      
      if (data.success) {
        setStatus(`✅ Success! Users: ${data.data.users}, Students: ${data.data.students}`)
      } else {
        throw new Error(data.error || 'Failed to seed database')
      }
    } catch (e: any) {
      setStatus(`❌ Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">System Setup & Repair</h1>
      
      <div className="grid gap-8 max-w-4xl w-full">
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="text-blue-500" />
              MongoDB Configuration
            </CardTitle>
            <CardDescription>
              Make sure you have set up your MongoDB connection string in your environment variables.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-slate-950 p-4 border border-slate-800 font-mono text-xs">
              <p className="text-slate-400"># Add to .env.local or Vercel Environment Variables:</p>
              <p className="text-green-400 mt-2">MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/</p>
              <p className="text-green-400">MONGODB_DB_NAME=manajemen_data</p>
            </div>
            <div className="text-sm text-slate-400">
              1. Create a free MongoDB Atlas cluster at{' '}
              <a href="https://www.mongodb.com/cloud/atlas" target="_blank" className="text-blue-400 underline">
                mongodb.com/cloud/atlas
              </a>
              <br />
              2. Get your connection string from Atlas Dashboard
              <br />
              3. Add the environment variables above
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="text-green-500" />
              Seed Database
            </CardTitle>
            <CardDescription>
              Click below to populate initial data (admin users and sample students).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSeed} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
              {loading ? 'Seeding...' : 'Run Seed Database'}
            </Button>
            {status && (
              <div className={`mt-4 p-4 rounded-md ${status.includes('Success') || status.includes('✅') ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
                {status}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" />
              Default Login Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-slate-950 p-4 border border-slate-800 font-mono text-sm space-y-2">
              <p><span className="text-slate-400">Email:</span> <span className="text-cyan-400">admin@example.com</span></p>
              <p><span className="text-slate-400">Password:</span> <span className="text-cyan-400">12345</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
