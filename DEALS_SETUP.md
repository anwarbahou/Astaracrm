# Deals Backend Integration Setup

This document explains how to set up the deals functionality with backend integration.

## Overview

The deals feature now supports both backend (Supabase) and mock data fallback. When the backend is unavailable or the deals table doesn't exist, it will automatically use mock data.

## Database Setup

### 1. Create the Deals Table

Run your existing SQL migration file to create the necessary database structure:

```sql
-- Execute the contents of SQLqueries/04_deals_table.sql in your Supabase SQL Editor
```

This will create:
- `deal_stage` enum (prospect, qualified, proposal, negotiation, won, lost)
- `deal_priority` enum (low, medium, high)  
- `deals` table with all necessary columns including:
  - `contact_id` for linking to contacts
  - `actual_close_date` in addition to expected close date
  - `description` field for detailed deal information
- Indexes for performance
- Row Level Security (RLS) policies for owner-based access
- Triggers for automatic timestamp updates

### 2. Table Structure

The `deals` table includes:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Deal name |
| client_id | UUID | Foreign key to clients table |
| contact_id | UUID | Foreign key to contacts table |
| value | DECIMAL(15,2) | Deal value |
| currency | TEXT | Currency (default: MAD) |
| stage | deal_stage | Current deal stage |
| probability | INTEGER | Win probability (0-100) |
| expected_close_date | DATE | Expected close date |
| actual_close_date | DATE | Actual close date |
| source | TEXT | Deal source |
| owner_id | UUID | Foreign key to users table (defaults to auth.uid()) |
| tags | TEXT[] | Array of tags |
| priority | deal_priority | Deal priority |
| notes | TEXT | Deal notes |
| description | TEXT | Detailed deal description |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### 3. Security Policies

The table has Row Level Security enabled with policies that:
- Allow users to view deals they own, or all deals for admin/manager roles
- Allow all active users to create deals
- Allow users to update/delete deals they own, or all deals for admin/manager roles

## Frontend Integration

### Components Updated

1. **useDeals Hook** (`src/hooks/useDeals.ts`)
   - Handles all CRUD operations
   - Transforms data between frontend and backend formats
   - Provides loading states and error handling

2. **Deals Page** (`src/pages/Deals.tsx`)
   - Integrated with useDeals hook
   - Fallback to mock data when backend unavailable
   - Seamless switching between backend and mock data

3. **Deal Types** (`src/types/deal.ts`)
   - Added 'Proposal' stage to DealStage type

### Usage

The deals functionality will automatically:
- Try to connect to the backend first
- Fall back to mock data if backend is unavailable
- Show appropriate loading states
- Handle errors gracefully

### Error Handling

If the backend connection fails or the deals table doesn't exist:
- The app continues to work with mock data
- Users can still create, edit, and delete deals locally
- No functionality is lost during development or setup

## Environment Variables

Ensure your environment variables are properly set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing

1. **With Backend**: After running the migration, the app will use real data
2. **Without Backend**: The app will automatically use mock data for development

## Next Steps

1. Run the SQL migration in your Supabase dashboard
2. Restart your development server
3. The deals page will now be connected to the backend
4. Create, edit, and delete operations will persist to the database

## Features

- ✅ Create new deals with the "New Deal" button
- ✅ Edit existing deals with full form validation
- ✅ Delete deals with confirmation
- ✅ Move deals between pipeline stages (drag & drop)
- ✅ Filter and search deals
- ✅ Role-based access control
- ✅ Real-time data synchronization
- ✅ Automatic fallback to mock data 