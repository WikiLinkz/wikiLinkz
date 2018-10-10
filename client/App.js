import React from 'react'
import { withRouter, Route, Switch } from 'react-router-dom'
import Game from './Game'
import Stats from './components/stats/Stats'

const App = () => {
  return (
    <Switch>
      <Route path='/stats' component={Stats} />
      <Route path='/game' component={Game} />
      <Route exact path='/' component={Game} />
    </Switch>
  )
}

export default withRouter(App)
