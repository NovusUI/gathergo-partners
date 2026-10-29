# GatherGo public website

The homepage introduces GatherGo and its partnerships. Shared links open public
event (`/event/:id`), Live (`/event/:id/live`), meal collection (`/food-bank/:id`),
carpool (`/carpool/:id`), short-link (`/s/:code`) and receipt (`/checkout/:id`) pages.

Run `npm run dev` or `npm run build`. Copy `.env.example` to `.env.local` when
configuration is needed. Development proxies `/api/v1` to localhost:4000;
`GATHERGO_API_PROXY_TARGET` overrides that target. `VITE_API_BASE_URL` selects a
different API origin, including `/api/v1`.

The backend's public-web migration and module must be deployed first. Guest
completion requires a real email code, then uses a scoped web session stored in
the browser's session storage. Returning from payment or opening a receipt in
another browser can require verifying the same email again. Session expiry and
failed API calls are shown explicitly; there is no mock checkout or persistence.

Tickets, registrations, donations and volunteer applications use existing backend
services. Web food-bank donations issue receipts without meal passes. Meal claims,
carpool participation and Live interactions remain in the native app. Until store
listings exist, app actions show the real testing link and an installed-app button.
The backend's optional `PUBLIC_PLAY_STORE_URL` and `PUBLIC_APP_STORE_URL` enable
platform-specific store buttons.

Production hosting must serve `.well-known` files directly, forward `/api/v1/*`
to the backend if using the same-origin API, and rewrite frontend routes to
`index.html`. Keep `/checkout/*` in the browser. If forwarding `/s/*` to the
backend instead, preserve its existing 302 redirect to the full event/meal/ride URL.

Set `PUBLIC_ANDROID_SHA256_CERT_FINGERPRINTS` (comma-separated release signing
fingerprints) and `PUBLIC_IOS_APP_ID` (`TEAMID.bundleIdentifier`) in the build
environment to generate the association files. Use the exact identifiers and
signing certificates of the distributed app. Serve the extensionless Apple file
as `application/json`, without redirects. The native app already declares
`gathergo.events`; OS-level association still needs validation on release devices.

The isolated preview harness in the backend's `test/public-web-preview.ts` can
exercise these pages against a dedicated local PostgreSQL database. Its payment
and email adapters are test doubles; production always uses the configured
Paystack and mail services.
