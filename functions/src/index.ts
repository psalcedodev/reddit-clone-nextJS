import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();
const db = admin.firestore();

export const createUserDocument = functions.auth
    .user()
    .onCreate(async (user) => {
        const newUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName ?? user.email?.split("@")[0],
            photoURL: user.photoURL,
            providerData: user.providerData,
        };
        db.collection("users").doc(user.uid).set(newUser);
    });
