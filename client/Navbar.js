import React from 'react'
import Login from './components/login/Login'

const Navbar = () => {
  return (
    <header id="game-container" style={styles.navbar}>
      <h1 className="game-title" style={{ marginTop: 0, color: 'white' }}>WikiLinkz</h1>
      <Login />
    </header>
  )
}

export default Navbar

const styles = {
  navbar: {
    padding: "5px 15px 5px 15px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: '#36c',
    boxShadow: '0 4px 11px rgba(0,0,0,.5)',
    height: '60px',
  },
}