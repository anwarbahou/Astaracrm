-- Fix for the sync_client_from_deal trigger error
-- This addresses the "column 'owner' of relation 'clients' does not exist" error

-- First, drop the problematic trigger and function
DROP TRIGGER IF EXISTS sync_client_from_deal_trigger ON deals;
DROP FUNCTION IF EXISTS sync_client_from_deal();

-- Create a corrected version that uses owner_id instead of owner
CREATE OR REPLACE FUNCTION sync_client_from_deal()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if we have a client_id to work with
    IF NEW.client_id IS NOT NULL THEN
        -- Extract client info from the deal and upsert into clients table
        INSERT INTO public.clients (
            id,
            name,
            phone,
            email,
            owner_id,  -- Use owner_id instead of owner
            tags,
            total_deal_value,
            status,
            created_at,
            updated_at
        )
        SELECT
            NEW.client_id,
            NEW.client_name,
            NEW.client_phone,
            NEW.client_email,
            NEW.owner_id,  -- Use owner_id instead of owner
            NEW.tags,
            NEW.value,
            'active',  -- Use lowercase 'active' to match enum
            NEW.created_at,
            NEW.updated_at
        ON CONFLICT (id) DO UPDATE SET
            -- Only update if the new value is not null
            name = COALESCE(EXCLUDED.name, clients.name),
            phone = COALESCE(EXCLUDED.phone, clients.phone),
            email = COALESCE(EXCLUDED.email, clients.email),
            owner_id = COALESCE(EXCLUDED.owner_id, clients.owner_id),  -- Use owner_id
            tags = COALESCE(EXCLUDED.tags, clients.tags),
            total_deal_value = COALESCE(
                (SELECT SUM(value) FROM deals WHERE client_id = NEW.client_id),
                clients.total_deal_value
            ),
            updated_at = EXCLUDED.updated_at;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER sync_client_from_deal_trigger
    AFTER INSERT OR UPDATE ON deals
    FOR EACH ROW
    EXECUTE FUNCTION sync_client_from_deal();

-- Alternative: If you don't need this automatic client sync functionality,
-- you can just comment out the above function and trigger creation
-- and run only the DROP statements. 