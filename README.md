# AR Construction Website

Next.js site for AR Construction with a Supabase-backed contractor tracking portal.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://arconstruction.ca](http://arconstruction.ca) with your browser.

The contractor portal is available at [http://arconstruction.ca/track](http://arconstruction.ca/track).

## Environment

Create `.env.local` for local development and configure the same variables in production:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SECRET_KEY=
```

`SUPABASE_SECRET_KEY` is used only by the server-side contractor signup API. Do not expose it to the browser.

## Supabase

The tracking portal uses:

- Supabase Auth for admin and contractor login.
- `track_profiles` for user roles.
- `work_tasks` for task assignment, completion proof, admin rejection notes, and status.
- private `task-proof-photos` storage bucket for proof images.

Schema files are in `supabase/`:

- `track-schema.sql` for new projects.
- `track-rejections-migration.sql` for adding rejection/follow-up support to an existing project.

## Deployment

For Vercel or another Next.js host:

1. Set the environment variables above.
2. Add the production domains:
   - `arconstruction.ca`
   - `www.arconstruction.ca`
   - `track.arcontruction.ca`
   - `track.arconstruction.ca`
3. Point the tracking subdomain DNS to the same deployment. [src/proxy.ts](src/proxy.ts) rewrites tracking-subdomain requests to `/track`.
4. Run `npm run build` before release.
