
-- Tasks table for task management
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority task_priority DEFAULT 'medium',
    status task_status DEFAULT 'pending',
    assigned_to_id UUID REFERENCES users(id) ON DELETE SET NULL,
    related_entity_type TEXT,
    related_entity_id UUID,
    tags TEXT[],
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID DEFAULT auth.uid() REFERENCES users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view tasks they own or are assigned to" ON tasks
    FOR SELECT USING (owner_id = auth.uid() OR assigned_to_id = auth.uid());

CREATE POLICY "Users can insert their own tasks" ON tasks
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update tasks they own" ON tasks
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete tasks they own" ON tasks
    FOR DELETE USING (owner_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_tasks_owner ON tasks(owner_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority ON tasks(priority);
