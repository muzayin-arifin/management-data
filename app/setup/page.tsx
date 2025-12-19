'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2, Rocket, FileJson } from 'lucide-react'

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
        setStatus(`✅ Success! Added: ${data.data.students_added}, Total: ${data.data.total_students}`)
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
      <h1 className="text-3xl font-bold mb-8">System Setup</h1>
      
      <div className="grid gap-8 max-w-4xl w-full">
        <Card className="bg-slate-900 border-slate-800 text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="text-yellow-500" />
              JSON Database Storage
            </CardTitle>
            <CardDescription>
              This application now uses a local JSON file for data storage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-slate-950 p-4 border border-slate-800 font-mono text-xs">
              <p className="text-slate-400"># Storage Location:</p>
              <p className="text-green-400 mt-2">data/students.json</p>
            </div>
            <div className="text-sm text-slate-400">
              No database configuration required. Data is stored locally in your project folder.
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
              Click below to populate initial sample students.
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
      </div>
    </div>
  )
}
