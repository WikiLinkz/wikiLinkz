import React, { Component } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

const data = [
  { game: 'Start A - End A', clicks: 5, history: 'Start A, blah, blah, blah, End A', won: true },
  { game: 'Start B - End B', clicks: 10, history: 'Start B, blah, blah, blah, blah, blah, blah, blah, blah, End B', won: true },
  { game: 'Start C - End C', clicks: 3, history: 'Start C, blah, blah', won: false },
  { game: 'Start D - End D', clicks: 1, history: 'Start D', won: false },
  { game: 'Start E - End E', clicks: 0, history: "", won: false },
]

class CustomTooltip extends Component {
  getHistory(label, history) {
    const games = history.split(', ').join('\n')
    return `History: ${games}`
  }

  render() {
    const { active } = this.props

    if (active) {
      const { payload, label } = this.props
      const { history } = payload[0].payload
      return (
        <div className='custom-tooltip'>
          <p className='history'>{this.getHistory(label, history)}</p>
        </div>
      )
    }

    return null
  }
}

class Chart extends Component {
  render() {
    console.log('====================================')
    console.log(this.props)
    console.log('====================================')
    const { games } = this.props
    return (
      <BarChart width={1000} height={300} data={games}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="game" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="clicks" barSize={40} fill="red" />
      </BarChart>
    )
  }
}

export default Chart