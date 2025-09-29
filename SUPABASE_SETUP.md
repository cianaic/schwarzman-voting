# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/sign up
2. Click "New Project"
3. Choose your organization
4. Enter project name: `schwarzman-voting`
5. Enter a secure database password
6. Select a region (closest to your users)
7. Click "Create new project"

## 2. Set up the Database Schema

1. Go to your project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire content of `supabase-schema.sql`
5. Click "RUN" to execute the schema

This will create:
- `sessions` table for managing Q&A sessions
- `questions` table for storing questions and votes
- Proper indexes for performance
- Row Level Security policies

## 3. Get Your Project Credentials

1. Go to "Settings" > "API"
2. Copy the following values:
   - **Project URL** (e.g., `https://abcdefghijk.supabase.co`)
   - **Project API Key** (anon/public key)

## 4. Configure Environment Variables

### For Local Development:
Create a `.env.local` file in the project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Go to "Settings" > "Environment Variables"
3. Add the same two variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Set them for "Production", "Preview", and "Development"

## 5. Test the Connection

1. Run `npm run dev` locally
2. Try creating a session - it should now persist in Supabase
3. Check the Supabase dashboard under "Table Editor" to see your data

## Features

With Supabase backend, you get:
- ✅ **Persistent storage** - Data survives deployments and server restarts
- ✅ **Multi-user real-time sync** - All users see the same data
- ✅ **Scalable database** - PostgreSQL with proper indexes
- ✅ **Built-in security** - Row Level Security policies
- ✅ **Admin dashboard** - View and manage data through Supabase UI

## Troubleshooting

- If you see connection errors, check your environment variables
- Make sure the Supabase URL and API key are correct
- Verify the database schema was created properly in the SQL Editor