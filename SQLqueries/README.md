
# CRM Database Schema

This directory contains the complete Supabase database schema for the WOLFHUNT CRM application.

## Setup Instructions

1. Run the SQL files in order (00-12) to set up the complete database schema
2. Ensure Supabase Auth is configured for email/password authentication
3. The seed data file (12_seed_data.sql) provides sample data for development

## Schema Overview

### Core Tables
- **users**: User accounts and profiles with role-based access
- **clients**: Company/organization records
- **contacts**: Individual contact records linked to clients
- **deals**: Sales opportunities and pipeline management
- **tasks**: Task management and assignment
- **notes**: Note-taking system with linking capabilities
- **emails**: Email communication tracking
- **calendar_events**: Scheduling and calendar management
- **activity_logs**: System activity tracking
- **workflows**: Automation rules and triggers
- **file_attachments**: File storage references

### Security Features
- Row Level Security (RLS) enabled on all tables
- User-based access control with owner_id references
- Admin override policies for management access
- Proper foreign key constraints and data integrity

### Key Features
- UUID primary keys for all tables
- Automatic timestamps (created_at, updated_at)
- Comprehensive indexing for performance
- JSONB fields for flexible data storage
- Enum types for consistent data validation
- Full text search capabilities on relevant fields

## Authentication Setup

Configure Supabase Auth with:
- Email/password authentication
- Email confirmation enabled
- Role-based access control
- JWT token expiration settings

## Performance Considerations

- All foreign keys are indexed
- Common query patterns are optimized with composite indexes
- JSONB fields use GIN indexes where appropriate
- Row-level security policies are optimized for performance
