import React, { PureComponent } from 'react'

class Finished extends PureComponent {
  constructor() {
    super();
    this.state = {
      start: '',
      target: '',
      history: [],
      clicks: '',
      won: false
    }
  }

  componentDidMount() {
    const { userStats, start, target } = this.props
    const { history, clicks, won } = userStats
    this.setState({
      start, target, history, clicks, won
    })
  }

  render() {
    const { start, target, history, clicks, won } = this.state

    return (
      <div className='gameover-container' style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
        <h2>Game Finished!</h2>
        {
          won
            ? <h2>YOU WIKI WIKI WON DAWG!</h2>
            : <h2>YOU WIKI WIKI LOST DAWG!</h2>
        }
        <p>Start: {start}</p>
        <p>Target: {target}</p>
        <p>History: {history.join(' => ')}</p>
        <p>Clicks: {clicks} </p>
      </div>
    )
  }
}

export default Finished
