import React from 'react'

const Pregame = props => {
  const {
    start,
    startSummary,
    target,
    targetSummary,
    startImg,
    targetImg,
    pregame,
    joinGlobalGame,
    postgame,
    finished,
  } = props
  let { time } = props
  if (time.h < 0 || time.m < 0) {
    time.h = 0
    time.m = 0
  }
  if (time.s <= 0) {
    time.s = '00'
  }
  let displayButton = 'initial'
  if (postgame) {
    displayButton = 'none'
  }
  return (
    <div className="pregame-container">
      <div
        className="gameTimer-container"
        style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
      >
        {pregame ? (
          <h1>
            Global Game Starts in{' '}
            <b>
              {time.m}:{time.s}
            </b>
          </h1>
        ) : (
          <h1 style={{ display: `${displayButton}` }}>
            Global Game Ends in{' '}
            <b>
              {time.m}:{time.s}
            </b>
          </h1>
        )}
      </div>
      <button
        className="pregame-container-join-button"
        style={{ display: `${displayButton}` }}
        disabled={pregame}
        onClick={joinGlobalGame}
      >
        Join Game
      </button>
      <div
        className="pregame-cards-container"
        style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }}
      >
        <div
          className="pregame-container-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            maxWidth: '40vw',
            textAlign: 'center',
          }}
        >
          <h2>
            <b>Start:</b> {start}
          </h2>
          <div
            className="pregame-container-img"
            style={{
              flex: '1',
              maxHeight: '300px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <img src={startImg} style={{ width: 'auto', maxHeight: '300px' }} />
            <p style={{ textAlign: 'center' }}>{startSummary} </p>
          </div>
        </div>
        <div
          className="pregame-container-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            maxWidth: '40vw',
            textAlign: 'center',
          }}
        >
          <h2>
            <b>Target:</b> {target}
          </h2>
          <div
            className="pregame-container-img"
            style={{
              flex: '1',
              maxHeight: '300px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <img src={targetImg} style={{ width: 'auto', maxHeight: '300px' }} />
            <p style={{ textAlign: 'center' }}>{targetSummary} </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pregame
