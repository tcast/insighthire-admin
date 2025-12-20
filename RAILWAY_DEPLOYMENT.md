# Railway Deployment Instructions

## Step 1: Create New Railway Service

1. Go to https://railway.app/
2. Select your InsightHire project
3. Click "New" button
4. Select "GitHub Repo"
5. Choose `tcast/insighthire-admin`
6. Railway will auto-detect it's a Next.js app

## Step 2: Configure Environment Variables

Add these variables to the service:

```bash
# Application
NODE_ENV=production
PORT=3000

# Public URLs (IMPORTANT: Build-time variables)
NEXT_PUBLIC_APP_URL=https://admin.insighthire.com
NEXT_PUBLIC_API_URL=https://api.insighthire.com
NEXT_PUBLIC_TRPC_URL=https://api.insighthire.com/trpc
```

## Step 3: Configure Custom Domain

1. In Railway service settings, go to "Settings" tab
2. Click "Generate Domain" (get Railway URL first for testing)
3. Click "Custom Domain"
4. Enter: `admin.insighthire.com`
5. Railway will provide DNS instructions

## Step 4: Update DNS

Add CNAME record to your DNS provider (wherever insighthire.com is hosted):

```
Type: CNAME
Name: admin
Value: <your-railway-url>.up.railway.app
TTL: 300
```

Or if Railway provides A records, use those.

## Step 5: Wait for Deployment

Railway will:
1. Build the Next.js app (~2-3 min)
2. Deploy to their edge network
3. Provision SSL certificate for admin.insighthire.com
4. Start serving traffic

## Step 6: Verify Deployment

Test these URLs:

```bash
# Railway URL (works immediately)
curl https://<your-service>.up.railway.app

# Custom domain (works after DNS propagates)
curl https://admin.insighthire.com

# Login page
open https://admin.insighthire.com/login

# After login, test dashboards
open https://admin.insighthire.com/organizations
open https://admin.insighthire.com/background-jobs
```

## Step 7: Update CORS on API

The API needs to allow requests from admin.insighthire.com.

Go to Railway → insighthire-api → Variables:

```bash
# Update CORS_ORIGINS to include admin domain:
CORS_ORIGINS=https://insighthire.com,https://www.insighthire.com,https://admin.insighthire.com
```

This allows admin app to call the API.

## Troubleshooting

### Build fails:
- Check build logs in Railway
- Verify Dockerfile is correct
- Ensure package.json has all dependencies

### App starts but crashes:
- Check deploy logs
- Verify env vars are set correctly
- Make sure NEXT_PUBLIC_* vars don't have localhost values

### Can't connect to API:
- Check CORS_ORIGINS includes admin.insighthire.com
- Verify NEXT_PUBLIC_API_URL is correct
- Check API is running

### DNS not resolving:
- Wait 5-10 minutes for propagation
- Check DNS with: `nslookup admin.insighthire.com`
- Verify CNAME points to correct Railway URL

## Expected Result

After successful deployment:

✅ https://admin.insighthire.com → Admin login page
✅ Login with admin credentials
✅ Access all platform admin features
✅ Completely separate from www.insighthire.com
✅ Independent deployment and scaling

---

**Next Step:** Follow these instructions in Railway dashboard to deploy!
