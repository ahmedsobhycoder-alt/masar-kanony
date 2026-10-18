# Users and wallet types

The dashboard calls `/api/v1/admin-management`. All routes require an administrator's bearer token.

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/users?page=1&limit=10&search=` | Users; search matches name, email, or phone |
| GET | `/users/stats` | Total, subscribed, and unsubscribed account counts |
| POST | `/users` | Create a verified user with name, email, phone, password, and optional role |
| PUT | `/users/:id` | Edit name, email, phone, role (`admin` or `user`), or active status |
| GET | `/wallets?page=1&limit=10&search=` | Wallet types and their phone numbers |
| GET | `/wallets/stats` | Wallet counts and usage ranked by payment requests |
| POST | `/wallets` | Create a wallet with paymentType, phone, and optional active status |
| PUT | `/wallets/:id` | Edit paymentType, phone, or active status |
| DELETE | `/wallets/:id` | Delete a wallet without deleting payment history |

Routes in the table are relative to `/api/v1/admin-management`.

List responses contain `data.list` and `data.paginationResult`. Summary responses contain `data.total`, plus the summary fields used by each page. User subscription status is returned as `isSubscribed`.

## Updating the running backend

The dashboard's development proxy targets `https://masar.aes-designstudio.com`. Editing or building this local backend does not update that server.

Deploy the backend source changes, including the new `src/presentation/routes/adminManagementRoute.ts` file and its registration in `src/app.ts`. Then install build dependencies and rebuild on the backend host:

```sh
npm ci --include=dev
npm run build
```

Restart the backend using its existing process manager. For a manually managed process, `npm start` starts the compiled backend; `npm run start:fresh` rebuilds before starting. Do not start another copy alongside an existing server on the same port.

Verify the deployed routes without exposing any credentials:

```sh
curl -i 'https://masar.aes-designstudio.com/api/v1/admin-management/users?page=1&limit=10&search='
curl -i 'https://masar.aes-designstudio.com/api/v1/admin-management/wallets?page=1&limit=10&search='
```

Without a bearer token, the updated backend returns HTTP 401. HTTP 404 indicates the running server still does not contain the route registration. Sign in to the dashboard as an administrator to verify the actual records and summary cards.

Run the API tests with `npm run test:admin-management`. They use mocked database operations and do not modify the application database.

## Subscription plan

The dashboard page `/subscription-plans` manages the existing single subscription plan.

| Method | Route | Access |
| --- | --- | --- |
| GET | `/api/v1/subscriptionPlan` | Public; records a successful GET request |
| GET | `/api/v1/subscriptionPlan/:id` | Public; records successful reads of existing plans |
| GET | `/api/v1/subscriptionPlan/admin` | Admin; reads the plan without affecting analytics |
| GET | `/api/v1/subscriptionPlan/stats` | Admin; total, authenticated, guest, and unique signed-in user statistics |
| POST | `/api/v1/subscriptionPlan` | Admin; creates the plan if none exists |
| PUT | `/api/v1/subscriptionPlan/:id` | Admin; edits the plan |

Authenticated public GET requests identify a user when the client sends its bearer token. Repeat requests increase the request count, but each signed-in user is counted once in `uniqueUsers`. Guests are counted as requests, not unique people. Administrator reads and failed requests are excluded. Tracking begins after deploying this change; past requests cannot be reconstructed. Statistics persist independently of the plan and are cumulative across edits.

Run `npm run test:subscription-plans` to verify editing, authentication, unique viewers, and request counters over HTTP with mocked database operations.
