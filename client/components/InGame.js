import React from 'react'
import LeaderboardContainer from './leaderboard/LeaderboardContainer'

const InGame = (props) => {
  const { time, html, handleClick, userStats, start, target, startTime, endTime, initTime } = props
  return (
    <div className='ingame-container'>
      <div
        className='gameTimer-container'
        style={{ display: "flex", justifyContent: "center" }}
      >
        <h1>Global Game Ends in <b>{time.m}:{time.s}</b></h1>
      </div>
      <div
        className='game-wikipedia-info-container'
        style={{ display: 'flex', borderStyle: 'solid', paddingLeft: 25 }}
      >
        <div
          className='game-wikipedia-render'
          style={{ flex: '3', height: '80vh', overflowY: 'scroll' }}
        >
          {(html === '') ? null :
            <div
              className='wiki-article'
              onClick={handleClick}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          }
        </div>
        <LeaderboardContainer userStats={userStats} start={start} target={target} startTime={startTime} endTime={endTime} initTime={initTime} />
      </div>
    </div>
  )
}

export default InGame
