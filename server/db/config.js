const Firebase = require('firebase')
const { apiKey, authDomain, databaseURL, storageBucket, messagingSenderId } = require('./credentials')

const app = Firebase.initializeApp({
  apiKey: process.env.API_KEY || apiKey,
  authDomain: process.env.AUTH_DOMAIN || authDomain,
  databaseURL: process.env.DATABASE_URL || databaseURL,
  storageBucket: process.env.STORAGE_BUCKET || storageBucket,
  messagingSenderId: process.env.MESSAGING_SENDER_ID || messagingSenderId
})
const db = app.database()

module.exports = { db, app }
