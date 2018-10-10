import React, { Component } from 'react'
import { BarChart, Bar, XAxis, Tooltip, Label } from 'recharts'

class CustomTooltip extends Component {
  render() {
    const { active } = this.props

    if (active) {
      const { payload } = this.props
      const { history, target } = payload[0].payload
      const titles = history.split(',')
      return (
        <div className='custom-tooltip'>
          <p>Target: {target}</p>
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
        <XAxis dataKey="game" tick={false}>
          <Label value="Games played with number of clicks (hover over to see history)" offset={0} position="insideBottom" />
        </XAxis>
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'blue', strokeWidth: 1 }} />
        <Bar dataKey="clicks" barSize={60} fill='blue' label={{ fill: 'white' }} />
      </BarChart>
    )
  }
}

export default Chart