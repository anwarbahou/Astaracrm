
-- Tasks table for task management
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    related_entity_type TEXT,
    related_entity_id UUID,
    tags TEXT[],
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view tasks they own or are assigned to" ON tasks
    FOR SELECT USING (owner = auth.uid() OR assigned_to = auth.uid());

CREATE POLICY "Users can insert their own tasks" ON tasks
    FOR INSERT WITH CHECK (owner = auth.uid());

CREATE POLICY "Users can update tasks they own" ON tasks
    FOR UPDATE USING (owner = auth.uid());

CREATE POLICY "Users can delete tasks they own" ON tasks
    FOR DELETE USING (owner = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_tasks_owner ON tasks(owner);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
