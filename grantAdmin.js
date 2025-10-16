// grantAdmin.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK using service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "1i2E38OaOyeGoKEVV2YvDcJFoAD2";

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Successfully granted admin privileges to UID: ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error setting admin privileges:", error);
    process.exit(1);
  });
