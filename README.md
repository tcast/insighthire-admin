# InsightHire Platform Admin

Platform administration dashboard for InsightHire - separated from customer-facing app for security and operational isolation.

## Features

- 🏢 **Organizations Management** - Manage customer organizations and settings
- ⚙️ **Background Jobs** - Monitor and retry failed processing jobs with advanced filtering
- 📊 **API Monitoring** - Real-time API health and service status
- 📋 **Audit Logs** - Track all platform admin actions
- 📧 **Leads Management** - View and manage sales leads
- 🔧 **Job Queue Monitoring** - Monitor transcription and scoring queues

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **tRPC** - Type-safe API calls to insighthire-api
- **React Query** - Data fetching and caching

## Authentication

Separate from customer WorkOS auth - uses email/password authentication:
- Stores `admin_token` in localStorage
- Validates `isPlatformAdmin` flag
- Platform-specific org ID check

## Development

```bash
npm install
npm run dev
```

Visit: http://localhost:3010

## Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://admin.insighthire.com

# API Connection
NEXT_PUBLIC_API_URL=https://api.insighthire.com
NEXT_PUBLIC_TRPC_URL=https://api.insighthire.com/trpc
```

## Deployment

Deployed to Railway at: https://admin.insighthire.com

## Security

- Separate deployment from customer app
- Admin-only routes (no customer access)
- All actions logged to audit trail
- Role-based access (Phase 2)

## Future Enhancements (Phase 2)

- Multi-user admin support
- Role-based permissions (Super Admin, Admin, Support, Viewer)
- 2FA authentication
- IP whitelisting
- Enhanced audit logging
