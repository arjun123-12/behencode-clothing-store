# Deployment Guide for Behencode Clothing Store

## Vercel Deployment (Recommended for Full Stack)

This project is configured for **single Vercel deployment** with both frontend and backend.

### Prerequisites
1. **GitHub Repository** - Code pushed to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas** - Free tier database at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
4. **Email Service** (Optional) - Gmail App Password or Ethereal Email for testing

---

## Step 1: Set Up MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with strong password
4. Whitelist your IP or use 0.0.0.0/0 for Vercel
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. **Vercel will auto-detect** `vercel.json` configuration
5. Click **Environment Variables** and add:

   ```
   MONGO_URI = mongodb+srv://<username>:<password>@<cluster>.mongodb.net/behencode?retryWrites=true&w=majority
   JWT_SECRET = super_secret_behencode_key_2026_framer_motion_threejs
   PORT = (leave blank - Vercel sets automatically)
   SMTP_HOST = smtp.ethereal.email (optional)
   SMTP_USER = (optional)
   SMTP_PASS = (optional)
   ADMIN_USERNAME = admin
   ADMIN_EMAIL = admin@behencode.co
   ADMIN_PASSWORD = BehencodeAdmin123!
   ```

6. Click **Deploy**

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Set environment variables when prompted
```

---

## Step 3: Add Environment Variables to Frontend

After deployment, your app is live at `https://behencode-clothing-store.vercel.app`

In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add frontend variables:

   ```
   NEXT_PUBLIC_API_URL = https://behencode-clothing-store.vercel.app/api
   NEXTAUTH_URL = https://behencode-clothing-store.vercel.app
   NEXTAUTH_SECRET = your-super-secret-nextauth-key-2026
   ```

3. Redeploy: Click **Deployments** → latest → **Redeploy**

---

## Step 4: Verify Deployment

### Check API Status
```bash
curl https://behencode-clothing-store.vercel.app/api
```
Expected response:
```json
{ "message": "Welcome to Behencode Repository-Service-Controller API Server v2.0" }
```

### Check Frontend
Visit: `https://behencode-clothing-store.vercel.app`

---

## Troubleshooting

### Issue: "Cannot GET /api"
**Solution:** Make sure `vercel.json` has both `backend` and `frontend` configured.

### Issue: "MongoDB connection failed"
**Solution:** 
- Check `MONGO_URI` is correct
- Whitelist Vercel IPs in MongoDB Atlas (use 0.0.0.0/0 for development)
- Ensure database name matches in connection string

### Issue: "NextAuth session not working"
**Solution:**
- Set `NEXTAUTH_SECRET` to a strong random string
- Set `NEXTAUTH_URL` to your Vercel domain
- Ensure environment variables are set in Vercel dashboard
- Redeploy after adding variables

### Issue: "API routes not found"
**Solution:**
- Verify `api/index.js` exists
- Check `vercel.json` has `routePrefix: "/api"`
- Clear Vercel cache: Go to **Settings** → **Git** → **Redeploy** from failed commit

---

## Default Admin Credentials

After deployment, a default admin user is automatically created:

```
Email: admin@behencode.co
Password: BehencodeAdmin123!
```

⚠️ **Change these credentials immediately in production!**

---

## Local Development

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with local MongoDB URI
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with local API URL: http://localhost:5000/api
npm install
npm run dev
```

---

## Production Checklist

- [ ] MongoDB cluster has strong password
- [ ] MongoDB IP whitelist configured (or 0.0.0.0/0)
- [ ] All environment variables set in Vercel dashboard
- [ ] JWT_SECRET is a strong random string (NOT the default)
- [ ] NEXTAUTH_SECRET is set and unique
- [ ] Admin credentials changed from defaults
- [ ] CORS settings reviewed in `backend/src/app.js`
- [ ] Email service configured for production (if using)
- [ ] SSL/TLS enabled (Vercel handles automatically)
- [ ] Vercel domains configured in DNS (if using custom domain)

---

## Need Help?

- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment/vercel)
- [Express on Vercel](https://vercel.com/guides/deploying-express)
