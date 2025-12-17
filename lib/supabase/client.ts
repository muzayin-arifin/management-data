// Supabase client deprecated - using JSON file database instead
// This file is kept for backward compatibility but not used

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://dummy.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'public-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)
