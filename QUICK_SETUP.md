# 🚀 Quick Supabase Setup (5 minutes)

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign in/up
2. **Click "New Project"**
3. **Fill in details:**
   - **Name:** `schwarzman-voting`
   - **Database Password:** Choose a secure password
   - **Region:** Select closest to you
4. **Click "Create new project"**
5. **Wait 2-3 minutes** for project to initialize

## Step 2: Get Your Credentials

1. **Go to Settings → API** (in left sidebar)
2. **Copy these values:**
   - **Project URL** (e.g., `https://abcdefg.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## Step 3: Set Environment Variables

**Create `.env.local` in your project root:**
```bash
NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

## Step 4: Create Database Tables

1. **Go to SQL Editor** (in Supabase left sidebar)
2. **Click "New Query"**
3. **Copy and paste** the entire content from `supabase-schema.sql`
4. **Click "RUN"** ✅

## Step 5: Test & Deploy

```bash
# Test locally
npm run dev

# Deploy to Vercel (add env vars to Vercel dashboard)
vercel --prod
```

---

## 🎉 That's it!

Your app now has:
- ✅ **Persistent database** (survives restarts)
- ✅ **Multi-user sync** (real-time updates)
- ✅ **Professional backend** (PostgreSQL)
- ✅ **Admin dashboard** (Supabase UI)

## Troubleshooting

- **Build errors?** Check environment variables are correct
- **Connection issues?** Verify Supabase project is active
- **Database errors?** Make sure schema was applied in SQL Editor

## Next Steps

- Visit your live app and create sessions
- Check the Supabase dashboard to see data in real-time
- Share with your team for multi-user testing!

---

*Need help? The full detailed guide is in `SUPABASE_SETUP.md`*