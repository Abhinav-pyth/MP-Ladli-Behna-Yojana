# Madhya Pradesh Ladli Behna Yojana - Portal

A professional bilingual (Hindi/English) government portal for the MP Ladli Behna Yojana scheme.

## Features

- 🌐 Instant bilingual toggle (Hindi ↔ English)
- 📋 Interactive eligibility checker
- 📝 Grievance/contact form with real-time validation
- 🔒 Hidden admin panel to view all submitted queries
- 📱 Fully responsive design
- 🚀 Optimized for Vercel deployment

## Admin Panel Access

To view all stored queries/grievances:
1. Press `Ctrl + Shift + A` (or `Cmd + Shift + A` on Mac)
2. Or navigate to `/#admin` in the URL
3. Enter the admin password: `admin2026`

All queries are stored in the browser's localStorage and are only visible to you on your device.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

### Option 1: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: Via Git
1. Push this repo to GitHub/GitLab
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Deploy!

### Option 3: Direct Deploy
```bash
vercel --prod
```

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- localStorage for data persistence

## Disclaimer

This is a simulated template built for structural guidance. This is not the official website of the Government of Madhya Pradesh.
