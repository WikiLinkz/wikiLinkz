import React from 'react'

const Pregame = (props) => {
  const { time, start, target, pregame, joinGlobalGame } = props
  return (
    <div className='pregame-container'>
      <div className='gameTimer-container' style={{ display: "flex", justifyContent: "center" }}>
        {pregame
          ? <h1>Global Game Starts in <b>{time.m}:{time.s}</b></h1>
          : <h1>Global Game Ends in <b>{time.m}:{time.s}</b></h1>}
      </div>
      <div className='pregame-container-time-remaining' style={{ display: "flex", justifyContent: "center" }}>
        <h2><b>Start:</b> {start}</h2>
      </div>
      <div className='pregame-container-time-remaining' style={{ display: "flex", justifyContent: "center" }}>
        <h2><b>Target:</b> {target}</h2>
      </div>
      <button className='pregame-container-join-button' disabled={pregame} onClick={joinGlobalGame}>Join Game</button>
    </div>
  )
}

export default Pregame
