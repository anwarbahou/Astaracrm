-- enable RLS on the users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for update on users for admins to avoid conflicts
DROP POLICY IF EXISTS "Admins can update user profiles" ON public.users;

-- Create a new policy that allows admins to update any user profile
CREATE POLICY "Admins can update user profiles"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin')); 