const Firebase = require('firebase')
const credentials = require('./credentials')

const app = Firebase.initializeApp(credentials)
const db = app.database()
const googleProvider = new Firebase.auth.GoogleAuthProvider()
const auth = Firebase.auth()

module.exports = { db, app, googleProvider, auth }
