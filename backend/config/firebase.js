const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('../firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET // firebase storage bucket
});

console.log('Firebase initialized');

module.exports = admin;
// This code initializes Firebase Admin SDK with the service account credentials and exports the admin object.
