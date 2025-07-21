-- Add negotiation fields to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS owner_suggested_percentage INTEGER,
ADD COLUMN IF NOT EXISTS subowner_suggested_percentage INTEGER,
ADD COLUMN IF NOT EXISTS owner_agreed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subowner_agreed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_finalized BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN clients.owner_suggested_percentage IS 'Owner suggested percentage for earnings distribution';
COMMENT ON COLUMN clients.subowner_suggested_percentage IS 'Subowner suggested percentage for earnings distribution';
COMMENT ON COLUMN clients.owner_agreed IS 'Whether the owner has agreed to the current pricing';
COMMENT ON COLUMN clients.subowner_agreed IS 'Whether the subowner has agreed to the current pricing';
COMMENT ON COLUMN clients.is_finalized IS 'Whether the pricing has been finalized by both parties'; 