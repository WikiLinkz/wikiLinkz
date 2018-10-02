const Firebase = require('firebase')
const credentials = require('./credentials')

const app = Firebase.initializeApp(credentials)
const db = app.database()

module.exports = { db, app }
