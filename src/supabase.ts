import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nmiowsgxdmywibccivmq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5taW93c2d4ZG15d2liY2Npdm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NjI0NzQsImV4cCI6MjA2NjIzODQ3NH0.kRVytMzGTgAfk_DlH5ACYe1WE705IohoYfqDixf1uto'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)