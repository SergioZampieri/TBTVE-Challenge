function notFound (req, res, next) {
  res.status(404).json({ error: 'Route does not exist' })
}

module.exports = notFound
