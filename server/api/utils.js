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

module.exports = { getDate, getRandomNums, titleize, underTitleize }
