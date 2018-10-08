import React from 'react'

const Pregame = (props) => {
  const { time, start, target } = props
  return (
    <div className='pregame-container'>
      <div className='gameTimer-container' style={{ display: "flex", justifyContent: "center" }}>
        <h1>Global Game Starts in {time.m}:{time.s}</h1>
      </div>
      <div className='pregame-container-time-remaining' style={{ display: "flex", justifyContent: "center" }}>
        <h2>Start: {start}</h2>
      </div>
      <div className='pregame-container-time-remaining' style={{ display: "flex", justifyContent: "center" }}>
        <h2>Target: {target}</h2>
      </div>
    </div>
  )
}

export default Pregame
