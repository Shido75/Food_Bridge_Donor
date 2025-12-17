# FoodBridge - Food Donation Platform

A comprehensive food donation platform connecting donors (restaurants, hostels, hotels), NGOs, and delivery partners to reduce food waste in Pune, Maharashtra.

## Features

### Multi-Role System
- **Donors**: Restaurants, hostels, hotels can list surplus food
- **NGOs**: Request and claim available food donations
- **Delivery Partners**: Accept and deliver food from donors to NGOs
- **Admin**: Manage platform, verify users, view analytics

### Core Functionality
- Real-time food donation listings
- NGO request management
- Delivery tracking with status updates
- Map-based location services
- Push notifications
- Rating and review system
- Comprehensive analytics dashboard
- Food safety compliance tracking

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Maps**: OpenStreetMap with Leaflet (no API key required)
- **Type Safety**: TypeScript

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account and project
- Git installed on your machine

## Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd foodbridge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Option A: Using Vercel + v0 (Recommended)
If you're using v0, Supabase integration is already connected. Your environment variables are automatically configured.

#### Option B: Manual Setup
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned
4. Go to Project Settings > API
5. Copy your project URL and anon key

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### 5. Run Database Migrations

The database schema is defined in SQL scripts in the `db/migrations/` folder. You can run them in the following ways:

#### Option A: Using v0 (Recommended)
If you're in v0, simply ask v0 to run the SQL scripts and it will execute them directly.

#### Option B: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the scripts in order:
   - `db/migrations/001_create_tables.sql`
   - `db/migrations/002_enable_rls.sql`
   - `db/migrations/003_create_triggers.sql`
   - `db/seeds/initial_seed.sql`

#### Option C: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
cd db/migrations
psql $DATABASE_URL < 001_create_tables.sql
psql $DATABASE_URL < 002_enable_rls.sql
psql $DATABASE_URL < 003_create_triggers.sql
cd ../seeds
psql $DATABASE_URL < initial_seed.sql
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
foodbridge/
├── app/                      # Next.js app directory
│   ├── auth/                # Authentication pages
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   └── callback/       # Auth callback handler
│   ├── dashboard/          # Role-based dashboards
│   │   ├── donor/          # Donor dashboard
│   │   ├── ngo/            # NGO dashboard
│   │   ├── delivery_partner/ # Delivery partner dashboard
│   │   └── admin/          # Admin dashboard
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── map/               # Map components (OpenStreetMap/Leaflet)
│   └── ...                # Custom components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase clients
│   │   ├── client.ts     # Browser client
│   │   └── server.ts     # Server client
│   ├── utils/            # Utility functions
│   │   └── map.ts        # Map utilities
│   └── types/            # TypeScript types
│       └── database.ts   # Database types
├── db/                   # Database files
│   ├── migrations/       # SQL migration files
│   │   ├── 001_create_tables.sql
│   │   ├── 002_enable_rls.sql
│   │   └── 003_create_triggers.sql
│   ├── seeds/           # Seed data
│   │   └── initial_seed.sql
│   └── README.md        # Database documentation
├── proxy.ts              # Supabase middleware
├── middleware.ts         # Next.js middleware
└── README.md            # This file
```

## Database Schema

### Main Tables

1. **profiles** - User profiles for all roles
2. **donor_organizations** - Donor organization details
3. **ngo_organizations** - NGO organization details
4. **delivery_partners** - Delivery partner details
5. **food_donations** - Food donation listings
6. **ngo_requests** - NGO food requests
7. **deliveries** - Delivery tracking
8. **notifications** - User notifications
9. **ratings** - User ratings and reviews
10. **analytics** - Platform analytics

### Row Level Security (RLS)

All tables have RLS enabled with policies that ensure:
- Users can only view/edit their own data
- NGOs can view available donations
- Delivery partners can view assigned deliveries
- Admins have full access
- Public can view verified organizations

## User Roles & Flows

### Donor Flow
1. Sign up and complete organization profile
2. Create food donation listings
3. Wait for NGO to claim donation
4. System assigns delivery partner
5. Track delivery status
6. Rate NGO and delivery partner

### NGO Flow
1. Sign up and complete NGO profile
2. Browse available donations
3. Claim donations that match needs
4. Track delivery status
5. Receive food
6. Rate donor and delivery partner

### Delivery Partner Flow
1. Sign up and complete profile
2. Mark availability status
3. Receive delivery assignments
4. Accept delivery
5. Pick up from donor
6. Deliver to NGO
7. Get rated by both parties

### Admin Flow
1. Access admin dashboard
2. Verify organizations
3. Monitor platform activity
4. View analytics and metrics
5. Manage users

## Authentication

The platform uses Supabase Auth with email/password authentication:

- Users sign up with email, password, name, phone, and role
- Email verification is required (check spam folder)
- Protected routes redirect to login if not authenticated
- Role-based dashboard routing after login

## Security Features

- Row Level Security (RLS) on all tables
- Secure session management
- HTTP-only cookies
- Server-side authentication checks
- Protected API routes
- PostGIS for secure geospatial queries

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Development redirect URL | Yes (dev) |

## Map Integration

FoodBridge uses OpenStreetMap with Leaflet for all mapping features:
- No API key required
- Open-source and free
- Location picking for donations and deliveries
- Real-time delivery tracking
- Distance calculations

### Map Components

- `<MapView />` - Display interactive maps with markers
- `<LocationPicker />` - Pick locations with current location support
- `<DeliveryMap />` - Track deliveries with pickup/delivery markers

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy

Vercel will automatically:
- Build your Next.js app
- Set up continuous deployment
- Provide a production URL

### Environment Variables in Production

Make sure to add all required environment variables in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Remove `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` in production (the app will use `window.location.origin`).

## Troubleshooting

### Email Confirmation Issues
- Check spam/junk folder for confirmation email
- Ensure `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set correctly
- Confirm email templates are enabled in Supabase dashboard

### RLS Policy Errors
- Ensure user email is confirmed before accessing protected data
- Check if user profile was created after signup
- Verify RLS policies are applied correctly

### Database Connection Issues
- Verify Supabase project is active
- Check environment variables are correct
- Ensure you're using the correct anon key

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Support

For support:
- Check the documentation above
- Review Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Review Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)

## License

MIT License - feel free to use this project for your own purposes.

---

Built with ❤️ to reduce food waste and fight hunger in Pune.
