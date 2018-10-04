import React, { Component } from 'react'
import db from '../../../server/db/config'

export default class GameStats extends Component {
  constructor() {
    super()
    this.state = {
      currentGame: {}
    }
  }

  componentDidMount() {
    const { gameId } = this.props

  }

  render() {
    return (
      <div id="leaders">
        <h3>Leaders</h3>
      </div>
    )
  }
}
