'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@supabase/supabase-js'
import { Loader2, CheckCircle2, AlertCircle, Copy } from 'lucide-react'

// Manual client creation to avoid hook issues if env varies, though using lib is fine.
// Using defaults from env.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>('')
  
  const schemaSQL = `
-- COPY AND RUN THIS IN SUPABASE SQL EDITOR
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'student',
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  major TEXT NOT NULL,
  semester INTEGER NOT NULL,
  email TEXT,
  age INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

INSERT INTO users (email, password, role, name)
VALUES 
  ('admin@example.com', '12345', 'admin', 'Admin System')
ON CONFLICT (email) DO NOTHING;
`;

  const handleSeed = async () => {
    setLoading(true)
    setStatus('Attempting to seed tables...')
    try {
        // Try insert a student
        const { error } = await supabase.from('students').insert([
            { student_id: '1001', name: 'Alice Johnson', major: 'CS', semester: 3, age: 20 },
            { student_id: '1002', name: 'Bob Smith', major: 'IS', semester: 5, age: 21 }
        ]).select()

        if (error) {
            // Check if error is "relation does not exist" which means tables missing
            if (error.message.includes('relation') || error.code === '42P01') {
                throw new Error("Tables do not exist. Please run the SQL Schema first!")
            }
            // Ignore Duplicate error
            if (error.code === '23505') {
                 setStatus('Success: Data already exists (duplicates skipped).')
                 return;
            }
            throw error
        }
        setStatus('Success: Database seeded successfully!')
    } catch (e: any) {
        setStatus(`Error: ${e.message}`)
    } finally {
        setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(schemaSQL)
    alert("SQL copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8">System Setup & Repair</h1>
        
        <div className="grid gap-8 max-w-4xl w-full">
            <Card className="bg-slate-900 border-slate-800 text-slate-100">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="text-orange-500" />
                        Step 1: Create Tables
                    </CardTitle>
                    <CardDescription>
                        Since we cannot create tables automatically from the client securely, you must run this SQL in your Supabase Dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative rounded-md bg-slate-950 p-4 border border-slate-800 font-mono text-xs overflow-auto h-64">
                        <pre>{schemaSQL}</pre>
                        <Button size="icon" variant="ghost" className="absolute top-2 right-2 hover:bg-slate-800" onClick={copyToClipboard}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="text-sm text-slate-400">
                        1. Go to <a href="https://supabase.com/dashboard" target="_blank" className="text-blue-400 underline">Supabase Dashboard</a><br/>
                        2. Select your project &rarr; SQL Editor<br/>
                        3. Paste the code above and click RUN.
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 text-slate-100">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" />
                        Step 2: Seed & Verify Data
                    </CardTitle>
                    <CardDescription>
                        Once tables are created, click below to populate initial data and test the connection.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSeed} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Run Seed & Verify'}
                    </Button>
                    {status && (
                        <div className={`mt-4 p-4 rounded-md ${status.startsWith('Success') ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
                            {status}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
