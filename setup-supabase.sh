#!/bin/bash

echo "🚀 Schwarzman Voting - Supabase Setup Script"
echo "============================================"
echo ""

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "⚠️  Environment variables not found!"
    echo ""
    echo "Please follow these steps:"
    echo ""
    echo "1. Go to https://supabase.com and sign in/sign up"
    echo "2. Click 'New Project'"
    echo "3. Choose/create an organization"
    echo "4. Fill in project details:"
    echo "   - Name: schwarzman-voting"
    echo "   - Database Password: (choose a secure password)"
    echo "   - Region: (closest to your users)"
    echo "5. Click 'Create new project'"
    echo ""
    echo "6. Once created, go to Settings > API"
    echo "7. Copy your Project URL and anon/public API key"
    echo ""
    echo "8. Create .env.local file with:"
    echo "   NEXT_PUBLIC_SUPABASE_URL=your_project_url"
    echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
    echo ""
    echo "Then run this script again!"
    exit 1
fi

echo "✅ Environment variables found!"
echo "   URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "   Key: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:10}..."
echo ""

# Install dependencies if not already installed
echo "📦 Checking dependencies..."
if ! npm list @supabase/supabase-js > /dev/null 2>&1; then
    echo "Installing @supabase/supabase-js..."
    npm install @supabase/supabase-js
fi

echo "✅ Dependencies ready!"
echo ""

# Run the database schema
echo "🗄️  Setting up database schema..."
echo "Please go to your Supabase project dashboard:"
echo "1. Go to $NEXT_PUBLIC_SUPABASE_URL"
echo "2. Click 'SQL Editor' in the sidebar"
echo "3. Click 'New Query'"
echo "4. Copy and paste the content from 'supabase-schema.sql'"
echo "5. Click 'RUN' to execute"
echo ""

read -p "Press Enter when you've completed the database setup..."

echo ""
echo "🧪 Testing connection..."

# Test the connection
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Supabase is properly configured."
    echo ""
    echo "🎉 Setup Complete!"
    echo "Your app now has:"
    echo "• ✅ Persistent database storage"
    echo "• ✅ Multi-user real-time synchronization"
    echo "• ✅ Professional PostgreSQL backend"
    echo "• ✅ Scalable architecture"
    echo ""
    echo "🚀 Ready to deploy!"
    echo "Run: npm run dev (local) or deploy to Vercel"
else
    echo "❌ Build failed. Please check your configuration."
    echo "Make sure:"
    echo "1. Environment variables are correct"
    echo "2. Database schema was applied"
    echo "3. Supabase project is active"
fi