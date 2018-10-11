import React, { PureComponent } from 'react'

// points utility
const getPoints = (clicks) => {
  let points = 1000
  if (clicks >= 3 && clicks <= 10) points -= ((clicks - 2) * 100)
  if (clicks >= 11) points = 100
  return points
}

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
    const points = getPoints(clicks)
    return (
      <div className='gameover-container' style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
        {
          won
            ? <h2>Way to go!</h2>
            : <h2>Time's up</h2>
        }
        {
          won
            ? <h2>YOU REACHED THE TARGET!</h2>
            : <h2>NICE TRY. PLAY AGAIN!</h2>
        }
        <div id='game-finished-container'>
          <p>Start: {start}</p>
          <p>Target: {target}</p>
          <p>History: {history.join(' => ')}</p>
          <p>Clicks: {clicks} </p>
          {
            won
              ? <p>Points: {points}</p>
              : null
          }
        </div>
      </div>
    )
  }
}

export default Finished
