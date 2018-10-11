const getDate = () => {
  var date = new Date();
  date.setDate(date.getDate() - 2);
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [date.getFullYear(), (month < 10 ? '0' : '') + month, (day < 10 ? '0' : '') + day];
}

const getRandomTarget = (min, max, start) => {
  var target = Math.floor(Math.random() * (max - min + 1)) + min
  return (target === start) ? getRandomTarget(min, max) : target
}

const getRandomNums = () => {
  const randomStart = Math.floor(Math.random() * (999 - 3) + 3)
  const randomTarget = Math.floor(getRandomTarget(3, 999, randomStart))
  return [randomStart, randomTarget]
}

const titleize = (title) => {
  return title.split('_').join(' ')
}

const underTitleize = (title) => {
  return title.split(' ').join('_')
}

const secondsToTime = (secs) => {
  let hours = Math.floor(secs / (60 * 60))

  let divisor_for_minutes = secs % (60 * 60)
  let minutes = Math.floor(divisor_for_minutes / 60)

  let divisor_for_seconds = divisor_for_minutes % 60
  let seconds = Math.ceil(divisor_for_seconds)

  if (seconds >= 0 && seconds < 10) {
    const newSeconds = `0${seconds}`
    seconds = newSeconds
  }

  let obj = {
    "h": hours,
    "m": minutes,
    "s": seconds
  };
  return obj
}

const initializeTimer = (startTime, endTime) => {
  const timeNow = new Date()
  // difference in seconds from mount to game startTime
  const timeToGameStart = ((Date.parse(startTime) - Date.parse(timeNow)) / 1000)
  // logic for if global game is in pregame state
  if (timeToGameStart > 0) {
    return {
      seconds: timeToGameStart
    }
  }
  // logic for if global game is in game state
  else if (timeToGameStart <= 0) {
    const timeToEnd = ((Date.parse(endTime) - Date.parse(timeNow)) / 1000)
    const seconds = timeToEnd < 0 ? 0 : timeToEnd
    return {
      seconds
    }
  }
  else {
    return {
      seconds: 0,
    }
  }
}

const getPoints = (clicks) => {
  let points = 1000
  if (clicks >= 3 && clicks <= 10) points -= ((clicks - 2) * 100)
  if (clicks >= 11) points = 100
  return points
}

module.exports = { getDate, getRandomNums, titleize, underTitleize, secondsToTime, initializeTimer, getPoints }
