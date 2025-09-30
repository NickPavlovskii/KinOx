import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnujgnrozleywjmqcafu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudWpnbnJvemxleXdqbXFjYWZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwOTY1ODUsImV4cCI6MjA3NDY3MjU4NX0.2ycWbS60vivPhoscbWckWhoI7NPg0-0plXIHbN6VGiY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
