import * as Firebase from 'firebase'
const credentials = require('./credentials')

export const app = Firebase.initializeApp(credentials)
export const db = app.database()
