# Quick Reference: Authentication System

## 🚀 Quick Start Commands

```bash
# Generate Prisma client (already done)
npm run db:generate

# Push schema to database (after setting DATABASE_URL)
npm run db:push

# Open database viewer
npm run db:studio

# Run development server
npm run dev
```

## 🔑 Required Environment Variables

Create `.env.local` file:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="from Google Cloud Console"
GOOGLE_CLIENT_SECRET="from Google Cloud Console"
NEXT_PUBLIC_WEBSOCKET_URL="ws://localhost:1234"
```

## 📋 Setup Checklist

- [ ] Create Vercel Postgres database
- [ ] Set up Google OAuth credentials
- [ ] Create `.env.local` with all variables
- [ ] Run `npm run db:push`
- [ ] Test login with Google OAuth
- [ ] Test email/password registration
- [ ] Test document creation and sharing

## 🔗 Important Links

- **Google Cloud Console**: https://console.cloud.google.com/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Setup Guide**: See SETUP_GUIDE.md for detailed instructions

## 🎯 Key Features

### Authentication
- Google OAuth sign-in
- Email/password authentication
- Secure session management

### Document Permissions
- **OWNER**: Full control, can delete, share
- **EDITOR**: Can edit document
- **VIEWER**: Read-only access

### Sharing
1. Open document
2. Click "Share" button
3. Enter collaborator email
4. Select role (Viewer/Editor)
5. Click "Share"

## 🐛 Common Issues

**"Cannot find module '@prisma/client'"**
→ Run `npm run db:generate`

**"Invalid credentials" on Google sign-in**
→ Check redirect URIs in Google Cloud Console

**Database connection error**
→ Verify `DATABASE_URL` is correct

**Collaborative cursors show "Anonymous User"**
→ Make sure you're logged in

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | NextAuth configuration |
| `src/components/auth/login-button.tsx` | Login UI |
| `src/components/share-dialog.tsx` | Share document UI |
| `prisma/schema.prisma` | Database schema |
| `.env.local` | Environment variables |

## 🧪 Testing Flow

1. **Sign Up**: Click "Log In" → "Sign Up" tab → Create account
2. **Create Document**: Click "Create New Document"
3. **Share**: Click "Share" → Add email → Select role
4. **Collaborate**: Open same document in another browser
5. **Verify**: Check that real names appear on cursors
