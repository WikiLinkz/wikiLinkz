import React, { Component } from 'react'
import { BarChart, Bar, XAxis, Tooltip } from 'recharts'

class CustomTooltip extends Component {
  render() {
    const { active } = this.props

    if (active) {
      const { payload } = this.props
      const { history } = payload[0].payload
      const titles = history.split(',')
      return (
        <div className='custom-tooltip'>
          {titles.map(title => {
            return <li>{title}</li>
          })}
        </div>
      )
    }

    return null
  }
}

class Chart extends Component {
  render() {
    const { games } = this.props
    return (
      <BarChart width={1000} height={500} data={games}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
        <XAxis dataKey="game" />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="clicks" barSize={40} fill={games.won ? "orange" : "blue"} label={{ fill: 'white' }} />
      </BarChart>
    )
  }
}

export default Chart