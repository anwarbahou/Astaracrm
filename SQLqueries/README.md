
# CRM Database Schema

This folder contains SQL files to set up the complete database schema for the CRM application.

## Tables Overview

1. **users** - User authentication and profile management
2. **clients** - Company/organization records
3. **contacts** - Individual contact persons
4. **deals** - Sales opportunities and pipeline management
5. **deal_activities** - Activities related to specific deals
6. **deal_files** - File attachments for deals
7. **emails** - Email management and storage
8. **activity_logs** - System-wide activity tracking
9. **email_templates** - Reusable email templates
10. **tasks** - Task management
11. **notes** - General note-taking

## Setup Instructions

1. Run the SQL files in numerical order (01 through 12)
2. Each file includes:
   - Table creation with proper constraints
   - Row Level Security (RLS) policies
   - Performance indexes
   - Update triggers for timestamp management

## Security Features

- All tables use Row Level Security (RLS)
- Users can only access data they own (based on auth.uid())
- Proper foreign key relationships maintain data integrity
- Enum constraints ensure data consistency

## Key Features

- **Multi-tenancy**: Each user's data is isolated using RLS
- **Audit trail**: All tables include created_at/updated_at timestamps
- **Relationships**: Foreign keys maintain referential integrity
- **Performance**: Strategic indexes for common queries
- **Flexibility**: JSONB fields for dynamic data storage

## Usage Notes

- Replace snake_case with the actual column names used in your frontend
- Adjust enum values to match your business requirements
- Add additional indexes based on your query patterns
- Consider partitioning for large datasets
