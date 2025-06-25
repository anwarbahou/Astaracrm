-- Allow all users to view all tasks
DROP POLICY IF EXISTS "Users can view tasks they own or are assigned to" ON tasks;
CREATE POLICY "All users can view all tasks" ON tasks
    FOR SELECT USING (true); 