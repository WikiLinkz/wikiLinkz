import React from 'react'
import GlobalGameInfo from './components/GlobalGameInfo'
import Login from './components/login/Login'

const Navbar = (props) => {
  const { generateGlobalGame, joinGlobalGame, stopGlobalGame } = props
  return (
    <div id="game-container" style={{ padding: 25 }}>
      <header className="game-header" style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
        <h1 className="game-title" >WikiLinks Game</h1>
        <GlobalGameInfo />
        <Login />
      </header>
      <div className='button-container' style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={generateGlobalGame}>Generate Global Game</button>
        <button onClick={joinGlobalGame}>Join Global Game</button>
        <button onClick={stopGlobalGame}>Stop/Achive Global Game</button>
      </div>
    </div>
  )
}

export default Navbar
