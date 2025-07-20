-- =====================================================
-- Fix Task Delete Policy Migration
-- =====================================================
-- This migration updates the RLS policy for task deletion to only allow
-- users to delete tasks they own (created by them)

-- Drop the existing delete policy
DROP POLICY IF EXISTS "Users can delete tasks they own" ON tasks;
DROP POLICY IF EXISTS "Users can delete tasks they own or are assigned to" ON tasks;

-- Create the new delete policy that only allows users to delete tasks they own
CREATE POLICY "Users can delete tasks they own" ON tasks
    FOR DELETE USING (owner = auth.uid());

-- =====================================================
-- Migration Complete
-- =====================================================
-- The task deletion policy is now updated to only allow users to delete:
-- ✅ Tasks they own (created by them)
-- ❌ Tasks they are assigned to (cannot delete)
-- This ensures only task creators can delete their tasks 