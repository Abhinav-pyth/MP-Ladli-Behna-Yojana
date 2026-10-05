# Madhya Pradesh Ladli Behna Yojana - Portal

A professional bilingual (Hindi/English) government portal for the MP Ladli Behna Yojana scheme with a real-time admin dashboard to view all user queries.

## Features

- 🌐 Instant bilingual toggle (Hindi ↔ English)
- 📋 Interactive eligibility checker
- 📝 Grievance/contact form with real-time validation
- 🔒 Hidden admin panel to view ALL users' queries (from cloud database)
- 📱 Fully responsive design
- 🚀 Optimized for Vercel deployment
- 💾 Supabase backend for multi-user query storage

---

## 🔐 Admin Panel Access

To view all stored queries:
1. Press `Ctrl + Shift + A` (or `Cmd + Shift + A` on Mac)
2. Or navigate to `/#admin` in the URL
3. Or click the 🔐 icon in the header
4. Enter the admin password: **`admin2026`**

---

## 🗄️ Setting Up Supabase (To See ALL Users' Queries)

By default, queries are stored in the browser's localStorage (only YOUR device). To see queries from ALL users across the internet, set up Supabase:

### Step 1: Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project" and create a project
4. Set a database password (save it somewhere safe)
5. Wait for the project to be ready (~2 minutes)

### Step 2: Create the Database Table
1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the contents of `setup.sql` from this project
4. Paste it into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### Step 3: Get Your API Keys
1. Go to **Project Settings** (gear icon) > **API**
2. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (a long string starting with `eyJ...`)

### Step 4: Configure Environment Variables
1. In your project root, create a file named `.env.local`
2. Add your keys:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
3. Restart your dev server (`npm run dev`)

### Step 5: Verify
- Open the admin panel
- You should see a green banner: "✅ Supabase Connected"
- Submit a test query from the contact form
- It should appear in the admin panel
- **Other users' submissions will also appear here!**

---

## 🚀 Deploy to Vercel

### Option 1: Via Vercel Dashboard (Recommended)
1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. In "Environment Variables", add:
   - `VITE_SUPABASE_URL` = your URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Click "Deploy"

### Option 2: Via Vercel CLI
```bash
npm i -g vercel
vercel --prod
```
Then add environment variables in the Vercel dashboard.

### Option 3: Direct Deploy
```bash
vercel
vercel --prod
```

---

## 🔒 Security Notes

- The admin panel is protected by a client-side password (`admin2026`)
- For production, consider:
  - Using Supabase Auth for real authentication
  - Restricting SELECT/DELETE policies to authenticated users
  - Moving the password check to a server-side function
- The `anon` key is safe to expose in frontend code (it's designed for this)
- Never expose the `service_role` key in frontend code

---

## 📁 Project Structure

```
├── src/
│   ├── App.tsx              # Main application component
│   ├── lib/
│   │   └── supabase.ts      # Supabase client configuration
│   ├── index.css            # Global styles
│   └── main.tsx             # Entry point
├── setup.sql                # Database schema for Supabase
├── vercel.json              # Vercel deployment config
├── .env.example             # Environment variable template
└── README.md                # This file
```

---

## 🛠️ Local Development

```bash
npm install
npm run dev
```

## 📦 Build

```bash
npm run build
```

---

## 📊 Admin Panel Features

Once Supabase is configured, the admin panel shows:
- **All queries** from all users across the internet
- **Total count** of queries
- **Today's count** of queries
- **Individual query details**: Name, Mobile, District, Query text, Timestamp
- **Delete** individual queries or all at once
- **Export** all data as JSON file

---

## ⚠️ Disclaimer

This is a simulated template built for structural guidance. This is not the official website of the Government of Madhya Pradesh.
