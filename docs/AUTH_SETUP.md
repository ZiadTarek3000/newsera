# Authentication setup (Google OAuth)

Newsera uses [Auth.js (NextAuth v5)](https://authjs.dev) with a Google provider
and an email/password (credentials) provider. This guide fixes the
**`Error 400: redirect_uri_mismatch`** and gets Google Sign-In working in both
development and production.

## Why `redirect_uri_mismatch` happens

When a user clicks **Continue with Google**, the app sends Google a
`redirect_uri` — the URL Google should return the user to after consent. Google
rejects the request unless that **exact** URL is listed in your OAuth client's
**Authorized redirect URIs**.

The app always uses this callback path:

```
<origin>/api/auth/callback/google
```

So the error means the origin you're running on is **not registered** in Google
Cloud Console. Fix = register the exact URIs below (no trailing slash, scheme
and host must match exactly).

## 1. Google Cloud Console configuration

1. Go to **Google Cloud Console → APIs & Services → Credentials**.
2. Open (or create) an **OAuth 2.0 Client ID** of type **Web application**.
3. Under **Authorized JavaScript origins**, add — exactly:

   | Environment | Origin |
   | ----------- | ------ |
   | Production  | `https://newsera-vert.vercel.app` |
   | Development | `http://localhost:3000` |

4. Under **Authorized redirect URIs**, add — exactly:

   | Environment | Redirect URI |
   | ----------- | ------------ |
   | Production  | `https://newsera-vert.vercel.app/api/auth/callback/google` |
   | Development | `http://localhost:3000/api/auth/callback/google` |

   The production redirect URI is **already registered**. To sign in with Google
   on your own machine you must add the **development** URI above to the *same*
   OAuth client — both can (and should) coexist on one client.

5. **Save.** Google can take a few minutes to propagate changes.

> Notes
> - `http` for localhost, `https` for production. No trailing slash.
> - **Dev is pinned to port 3000** (`next dev -p 3000` in `package.json`), so the
>   local callback is always `http://localhost:3000/api/auth/callback/google`. If
>   `:3000` is occupied, `next dev` now fails loudly instead of drifting to
>   `:3001` and silently breaking OAuth — free the port (stop the other process)
>   rather than running on a different one.
> - Use `localhost`, not `127.0.0.1` — they are different origins to Google.
> - If you use Vercel preview deployments and want Google on them too, either add
>   each preview URL's callback, or test OAuth on a stable domain.
> - The OAuth consent screen must be configured; while in **Testing** mode, add
>   your Google account under **Test users** or you'll get `access_denied`.

## 2. Environment variables

Copy `.env.example` to `.env` and set:

```bash
AUTH_SECRET="<npx auth secret>"
AUTH_GOOGLE_ID="<client id>.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="<client secret>"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"   # prod: your https origin
```

- The Google provider is only enabled when **both** `AUTH_GOOGLE_ID` and
  `AUTH_GOOGLE_SECRET` are set (`hasGoogle` in `lib/env.ts`).
- `trustHost: true` is set in `lib/auth/auth.ts`, so the callback origin is taken
  from the incoming request — correct for both localhost and your deployed host
  without extra config.
- Only set `AUTH_URL` if production auto-detection picks the wrong host (custom
  domain behind a proxy). It must equal your external origin, e.g.
  `AUTH_URL="https://yourdomain.com"`.

### Production (Vercel — `newsera-vert.vercel.app`)

Set the same variables in **Vercel → Project → Settings → Environment Variables**
(Production scope). `trustHost` derives the callback origin from the request, so
no `AUTH_URL` is needed unless host detection is wrong.

```
AUTH_SECRET=...                 # any strong random string (npx auth secret)
AUTH_GOOGLE_ID=...              # same client id as the registered OAuth client
AUTH_GOOGLE_SECRET=...
NEXT_PUBLIC_SITE_URL=https://newsera-vert.vercel.app
```

The production callback `https://newsera-vert.vercel.app/api/auth/callback/google`
is already registered, so once these env vars exist in Vercel, Google Sign-In
works on the deployed site with no further changes. Redeploy after adding/editing
env vars so the new values are baked in.

## 3. Verify

1. Restart the dev server after changing `.env`.
2. Visit `/login` or `/register` and click **Continue with Google**.
3. You should land on Google's consent screen and be returned to `/dashboard`.
4. If you see `redirect_uri_mismatch`, the URI in the browser's address bar
   (the `redirect_uri=` query param on the Google error page) is what must be
   added verbatim to **Authorized redirect URIs**.

## Credentials (email/password) flow

- **Register** (`/register`) creates the user and sends a verification email
  (Brevo). The account must be verified before password sign-in succeeds.
- **Login** (`/login`) signs in via the credentials provider.
- Google accounts are verified by Google and skip the email-verification step.
- `allowDangerousEmailAccountLinking` lets a Google sign-in link to an existing
  account that uses the same email address.
