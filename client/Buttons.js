import React from 'react'

const Buttons = (props) => {
  const { generateGlobalGame, joinGlobalGame, stopGlobalGame } = props.props
  return (
    <div className='button-container' style={{ display: "flex", justifyContent: "center" }}>
      <button onClick={generateGlobalGame}>Generate Global Game</button>
      <button onClick={joinGlobalGame}>Join Global Game</button>
      <button onClick={stopGlobalGame}>Stop/Achive Global Game</button>
    </div>
  )
}

export default Buttons