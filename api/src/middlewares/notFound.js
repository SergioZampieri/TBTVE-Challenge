function notFound(err, req, res, next) {
  res.status(404).send(`Error: Route does not exist, ${err}`)
}

module.exports = notFound
