# Admin courts and notifications

The court edit page supports adding floors and editing each floor name/image. Existing databases with the old globally unique floorName index need `npm run build` followed by `node scripts/migrate-floor-index.cjs` (set DB_URI). This replaces uniqueness with court + floorName, allowing the same floor name at different courts. The script has not been run against a live database.

Firebase credentials: set FIREBASE_SERVICE_ACCOUNT_PATH to an absolute service-account JSON path, use Application Default Credentials, or retain the existing src/infrastructure/config/firebase-service-account.json. Credentials are loaded only on first send.

Authenticated client endpoints:
- POST /api/v1/notifications/device-token with { "token": "FCM registration token" } at login and whenever the token refreshes.
- DELETE the same path/body at logout.
- GET /api/v1/notifications for the current user's inbox.
- PUT /api/v1/notifications/:id to mark read; PUT /mark-all-read to mark the inbox read.

Admin endpoints:
- GET /api/v1/notifications/admin?page=1&limit=20 for notification history.
- POST /api/v1/notifications with title, body, audience: "all" or "user"; include userId for audience "user". Optional type and data are supported.
- DELETE /api/v1/notifications/:id to remove a stored notification.

Broadcasts target all active accounts, save one inbox record per account, and send to registered devices in batches of at most 500. Response counts recipients, successful devices, failed devices and accounts without devices. Invalid/expired device tokens are removed. Failed push delivery keeps the inbox record. This is a synchronous send; very large audiences should use a durable job queue before production scale. Avoid retrying a partially completed request automatically as it may duplicate inbox records.

No live pushes were sent during development. End-to-end device delivery requires Firebase credentials and a client that registers its token and handles incoming messages.
