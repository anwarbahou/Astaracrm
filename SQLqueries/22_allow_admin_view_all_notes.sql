-- Drop existing RLS policies for notes
DROP POLICY IF EXISTS "Users can view notes they own" ON notes;
DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
DROP POLICY IF EXISTS "Users can update notes they own" ON notes;
DROP POLICY IF EXISTS "Users can delete notes they own" ON notes;
DROP POLICY IF EXISTS "Admins can insert any notes" ON notes;
DROP POLICY IF EXISTS "Admins can update any notes" ON notes;
DROP POLICY IF EXISTS "Admins can delete any notes" ON notes;

-- Create new RLS policies
CREATE POLICY "Users can view their own notes or admins can view all" ON notes
    FOR SELECT USING (
        owner_id = auth.uid() 
        OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Regular user policies
CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update notes they own" ON notes
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete notes they own" ON notes
    FOR DELETE USING (owner_id = auth.uid());

-- Admin policies for all operations
CREATE POLICY "Admins can insert any notes" ON notes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can update any notes" ON notes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete any notes" ON notes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    ); 