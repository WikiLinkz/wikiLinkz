import React from 'react'

const Finished = (props) => {
  const { userStats, start, target } = props
  const { history, clicks } = userStats
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

export default Finished
