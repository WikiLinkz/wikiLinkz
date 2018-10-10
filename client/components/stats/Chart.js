import React, { Component } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

class CustomTooltip extends Component {
  render() {
    const { active } = this.props

    if (active) {
      const { payload } = this.props
      const { history } = payload[0].payload
      const titles = history.split(',')
      console.log(titles)
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