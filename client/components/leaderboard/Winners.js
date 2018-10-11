import React from 'react'

const Winners = props => {
  const { winners, clickInfo } = props
  return (
    <div id="winners">
      {
        winners.map(winner => {
          const username = clickInfo[winner[0]].username
          const points = winner[1]
          return (
            <div key={winner[0]} id="winner-single">
              <p>{username} <span id="winner-badge">{points}pts</span></p>
            </div>
          )
        })
      }
    </div>
  )
}

export default Winners
