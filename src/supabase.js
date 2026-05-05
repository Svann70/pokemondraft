import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase config!
// 1. Go to supabase.com -> New Project
// 2. Go to Project Settings -> API
// 3. Copy URL and anon public key here:
const supabaseUrl = 'https://fwsedruoaivgdgiwwaqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3c2VkcnVvYWl2Z2RnaXd3YXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTI5NDUsImV4cCI6MjA5MzU2ODk0NX0.gfR3GdQbGLDvacmMz2bIUUHtOOZZejj5tmeZosQBJjY';

export let supabase = null;
export let isSupabaseEnabled = false;

if (supabaseUrl && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    isSupabaseEnabled = true;
    console.log("⚡ Supabase initialized successfully!");
  } catch (error) {
    console.error("Supabase initialization error:", error);
  }
} else {
  console.warn("⚠️ Supabase is NOT configured. Using LocalStorage fallback. Please update src/supabase.js with your config.");
}
