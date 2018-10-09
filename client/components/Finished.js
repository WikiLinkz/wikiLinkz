import React from 'react'
import Stats from './Stats'

const Finished = (props) => {
  const { userStats, start, target, userId } = props
  const { history, clicks } = userStats
  return (
    <div className='gameover-container' style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
      <h2>Game Finished!</h2>
      <p>Start: {start}</p>
      <p>Target: {target}</p>
      <p>History: {history.join(' => ')}</p>
      <p>Clicks: {clicks} </p>
      <Stats userId={userId} />
    </div>
  )
}

export default Finished
