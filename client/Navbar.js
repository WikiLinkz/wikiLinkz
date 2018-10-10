import React from 'react'
import GlobalGameInfo from './components/GlobalGameInfo'
import Login from './components/login/Login'

const Navbar = () => {
  return (
    <div id="game-container" style={{ padding: 25 }}>
      <header className="game-header" style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
        <h1 className="game-title" >WikiLinks Game</h1>
        <GlobalGameInfo />
        <Login />
      </header>
    </div>
  )
}

export default Navbar
