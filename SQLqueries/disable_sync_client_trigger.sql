-- Simple fix: Just disable the problematic trigger entirely
-- This will resolve the "column 'owner' of relation 'clients' does not exist" error
-- Run this if you don't need automatic client syncing from deals

-- Drop the problematic trigger and function
DROP TRIGGER IF EXISTS sync_client_from_deal_trigger ON deals;
DROP FUNCTION IF EXISTS sync_client_from_deal(); 