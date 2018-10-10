const Firebase = require('firebase/app')
require('firebase/database')
require('firebase/auth')
if (process.env.NODE_ENV !== 'production') require('./credentials')



Firebase.initializeApp({
  apiKey: 'AIzaSyDmPyGn3mJk9sUhTR9zzNR7NXlwXjdGKkE',
  authDomain: 'wikilinkz-8f973.firebaseapp.com',
  databaseURL: 'https://wikilinkz-8f973.firebaseio.com',
  storageBucket: 'wikilinkz-8f973.appspot.com',
  messagingSenderId: 'http://localhost:8080'
})

const db = Firebase.database()
const googleProvider = new Firebase.auth.GoogleAuthProvider()
const auth = Firebase.auth()

module.exports = { db, googleProvider, auth }
