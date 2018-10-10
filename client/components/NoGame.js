import React from 'react'

const NoGame = (props) => {
  const { generateGlobalGame } = props
  return (
    <div className='nogame-container'>
      <h2>No Game Running!</h2>
      <button id='start-game-button' onClick={generateGlobalGame}>Start A Game</button>
    </div>
  )
}

export default NoGame
