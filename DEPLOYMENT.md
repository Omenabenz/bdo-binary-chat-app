#  Deployment Guide

## Git Repository Setup

### 1. Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: BDO Binary Chat App"
```

### 2. Connect to GitHub
```bash
# Create new repository on GitHub first, then:
git remote add origin https://github.com/yourusername/bdo-binary-chat.git
git branch -M main
git push -u origin main
```

### 3. Environment Variables Setup

For production deployment, configure these environment variables:

```
VITE_SUPABASE_URL=https://nmiowsgxdmywibccivmq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5taW93c2d4ZG15d2liY2Npdm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NjI0NzQsImV4cCI6MjA2NjIzODQ3NH0.kRVytMzGTgAfk_DlH5ACYe1WE705IohoYfqDixf1uto
```

## Deployment Platforms

### Vercel
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting service
```

## Production Checklist

- [x] Environment variables configured
- [x] Database tables created in Supabase
- [x] Real-time subscriptions working
- [x] File uploads configured
- [x] All features tested
- [x] Mobile responsive design
- [x] Error handling implemented
- [x] Security measures in place

## Support

For deployment issues, check:
1. Environment variables are correctly set
2. Supabase permissions are configured
3. Build process completes without errors
4. All dependencies are installed
 