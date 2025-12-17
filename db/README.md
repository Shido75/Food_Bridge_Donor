# FoodBridge Database Schema

This directory contains all database migration files and schemas for the FoodBridge food donation platform.

## Directory Structure

```
db/
├── migrations/          # Database migration files (run in order)
│   ├── 001_create_tables.sql
│   ├── 002_enable_rls.sql
│   └── 003_create_triggers.sql
├── seeds/              # Seed data for initial setup
│   └── initial_seed.sql
└── README.md          # This file
```

## Database Tables

### Core Tables

1. **profiles** - User profiles with role-based access
2. **donor_organizations** - Donor organization details
3. **ngo_organizations** - NGO organization details
4. **delivery_partners** - Delivery partner information
5. **food_donations** - Food donation listings and tracking
6. **ngo_requests** - NGO food requests
7. **deliveries** - Delivery tracking and management
8. **notifications** - User notifications
9. **ratings** - Ratings and reviews
10. **analytics** - Platform metrics and analytics

## Running Migrations

### Option 1: Using v0 (Recommended for Development)

The migrations are automatically available in v0. Simply run them in order:

1. Navigate to the Scripts section in v0
2. Run migrations in order: 001, 002, 003
3. Run the seed file

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file content
4. Run them in order (001 → 002 → 003)
5. Run the seed file

### Option 3: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Or run individual files
psql $DATABASE_URL < db/migrations/001_create_tables.sql
psql $DATABASE_URL < db/migrations/002_enable_rls.sql
psql $DATABASE_URL < db/migrations/003_create_triggers.sql
psql $DATABASE_URL < db/seeds/initial_seed.sql
```

## Schema Features

### PostGIS Support
The schema uses PostGIS for geospatial queries:
- Location-based donation searches
- Distance calculations for deliveries
- Geographic indexing for performance

### Row Level Security (RLS)
All tables have RLS policies configured:
- Users can only access their own data
- Role-based permissions (admin, donor, NGO, delivery partner)
- Public read access for available donations

### Triggers
Automatic data management:
- Auto-update timestamps on record changes
- Auto-create profiles on user signup
- Update delivery statistics on completion

## Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# PostgreSQL (automatically provided by Supabase)
POSTGRES_URL=your_postgres_connection_string
```

## Data Model Relationships

```
auth.users (Supabase Auth)
    ↓
profiles (1:1)
    ↓
    ├── donor_organizations (1:1)
    ├── ngo_organizations (1:1)
    └── delivery_partners (1:1)
    ↓
food_donations (1:N)
    ↓
deliveries (1:1)
    ↓
ratings (N:N)
```

## Important Notes

- All migrations must be run in order
- PostGIS extension is required for location features
- RLS is enabled by default - ensure policies match your requirements
- Indexes are created for common query patterns
- All timestamps are in UTC (TIMESTAMPTZ)

## Rollback

If you need to rollback the database:

```sql
-- Drop all tables (be careful!)
DROP TABLE IF EXISTS public.analytics CASCADE;
DROP TABLE IF EXISTS public.ratings CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.deliveries CASCADE;
DROP TABLE IF EXISTS public.ngo_requests CASCADE;
DROP TABLE IF EXISTS public.food_donations CASCADE;
DROP TABLE IF EXISTS public.delivery_partners CASCADE;
DROP TABLE IF EXISTS public.ngo_organizations CASCADE;
DROP TABLE IF EXISTS public.donor_organizations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
```

## Support

For issues or questions:
1. Check the main project README
2. Review Supabase documentation
3. Open an issue on GitHub
