# Migration Checklist

## Security first

1. Rotate any secret values that were ever committed to GitHub.
   - GitHub tokens
   - OpenAI API keys
   - Database URLs or passwords
   - RevenueCat, Stripe, Firebase, Supabase, or other service keys
2. Keep real values only in local `.env` files and hosting dashboards.
3. Commit `.env.example` files, but never real `.env` files.

## Local project

The repository has two apps:

- `mobile/` - Expo React Native app
- `backend/` - Hono API server running with Bun

Local backend settings:

```txt
backend/.env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8081
OPENAI_API_KEY=your_new_key_here
```

Local mobile settings:

```txt
mobile/.env
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
```

## Railway backend deployment

Create a Railway service from the GitHub repo and use:

- Root directory: `backend`
- Build/install command: Railway default, or `bun install`
- Start command: `bun run start`

Set Railway environment variables:

```txt
NODE_ENV=production
OPENAI_API_KEY=your_new_key_here
CORS_ORIGIN=https://your-frontend-domain.example
```

Railway will provide `PORT` automatically, so do not hard-code it.

After deployment, test:

```txt
https://vibecode-backend-production-bd55.up.railway.app/health
```

Expected response:

```json
{ "status": "ok" }
```

## Mobile app after Railway deploy

Update `mobile/.env`:

```txt
EXPO_PUBLIC_BACKEND_URL=https://vibecode-backend-production-bd55.up.railway.app
```

Then restart Expo so it reads the new value.

## Vibecode handoff

Keep Vibecode running until Railway is confirmed working. Once the mobile app points to Railway and all important features work, Vibecode should no longer be hosting the backend path used by the app.
