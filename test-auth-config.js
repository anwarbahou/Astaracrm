// Test script to check Supabase configuration
console.log('=== Testing Supabase Configuration ===');

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  console.log('Browser environment detected');
  
  // Check for environment variables
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', import.meta.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
  
  // Check localStorage and sessionStorage
  console.log('localStorage available:', typeof localStorage !== 'undefined');
  console.log('sessionStorage available:', typeof sessionStorage !== 'undefined');
  
  // Check for existing auth tokens
  const authToken = localStorage.getItem('supabase.auth.token');
  const authUser = localStorage.getItem('supabase.auth.user');
  console.log('Existing auth token:', authToken ? 'PRESENT' : 'NOT PRESENT');
  console.log('Existing auth user:', authUser ? 'PRESENT' : 'NOT PRESENT');
  
  // Check for persist flag
  const persist = sessionStorage.getItem('persist');
  console.log('Persist flag:', persist);
  
} else {
  console.log('Node.js environment detected');
  
  // Check environment variables
  console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
}

console.log('=== Configuration Test Complete ==='); 