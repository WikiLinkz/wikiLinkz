import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import App from './App'
import History from './History'

ReactDOM.render(
  <Router history={History}>
    <App />
  </Router>,
  document.getElementById('app')
)
