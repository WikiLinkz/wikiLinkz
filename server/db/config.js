const Firebase = require('firebase')
if (process.env.NODE_ENV !== 'production') require('./credentials')

const app = Firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
})

const db = app.database()
const googleProvider = new Firebase.auth.GoogleAuthProvider()
const auth = Firebase.auth()

module.exports = { db, app, googleProvider, auth }
