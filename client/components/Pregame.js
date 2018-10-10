import React from 'react'

const Pregame = (props) => {
  const { time, start, target, pregame, joinGlobalGame } = props
  return (
    <div className='pregame-container'>
      <div className='gameTimer-container' style={{ display: "flex", justifyContent: "center" }}>
        {pregame
          ? <h1>Global Game Starts in {time.m}:{time.s}</h1>
          : <h1>Global Game Ends in {time.m}:{time.s}</h1>}
      </div>
      <div className='pregame-container-time-remaining' style={{ display: "flex", justifyContent: "center" }}>
        <h2>Start: {start}</h2>
      </div>
      <div className='pregame-container-time-remaining' style={{ display: "flex", justifyContent: "center" }}>
        <h2>Target: {target}</h2>
      </div>
      <button className='pregame-container-join-button' disabled={pregame} onClick={joinGlobalGame}>Join Game</button>
    </div>
  )
}

export default Pregame
