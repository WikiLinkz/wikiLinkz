const Firebase = require('firebase/app')
require('firebase/database')
require('firebase/auth')
console.log('ENVIRONMENT: ', process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production') require('./credentials')

Firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
})

const db = Firebase.database()
const googleProvider = new Firebase.auth.GoogleAuthProvider()
const auth = Firebase.auth()

module.exports = { db, googleProvider, auth }
