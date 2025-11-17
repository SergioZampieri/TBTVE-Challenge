function partialMatch(arr, sub) {
  sub = sub.toLowerCase()
  return arr.filter((str) => str.toLowerCase().includes(sub))
}
module.exports = partialMatch
