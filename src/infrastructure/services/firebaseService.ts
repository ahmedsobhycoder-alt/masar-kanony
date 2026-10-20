import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import path from "path";
import fs from "fs";

// Initialize on first send so missing credentials do not prevent API startup.
export const getFcm = () => {
  const accountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.resolve(process.cwd(), "src/infrastructure/config/firebase-service-account.json");
  const app = getApps()[0] || initializeApp({ credential: fs.existsSync(accountPath) ? cert(accountPath) : applicationDefault() });
  return getMessaging(app);
};
