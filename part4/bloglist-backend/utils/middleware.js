const logger = require('./logger')

const tokenExtractor = (request, response, next) => {
  // logger.info(`before assignment ${request.token}`)
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  else request.token = null
  // logger.info(`after assignment ${request.token}`)
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.name)
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: 'malformed user id' })
  }
  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }
  next()
}

module.exports = { tokenExtractor, errorHandler }