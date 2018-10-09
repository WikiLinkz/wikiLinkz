import React, { PureComponent } from 'react'

class Finished extends PureComponent {
  constructor() {
    super();
    this.state = {
      start: '',
      target: '',
      history: [],
      clicks: ''
    }
  }

  componentDidMount() {
    const { userStats, start, target } = this.props
    const { history, clicks } = userStats
    this.setState({
      start, target, history, clicks
    })
  }

  render() {
    const { start, target, history, clicks } = this.state
    console.log(history)
    return (
      <div className='gameover-container' style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
        <h2>Game Finished!</h2>
        <p>Start: {start}</p>
        <p>Target: {target}</p>
        <p>History: {history.join(' => ')}</p>
        <p>Clicks: {clicks} </p>
      </div>
    )
  }
}

export default Finished
