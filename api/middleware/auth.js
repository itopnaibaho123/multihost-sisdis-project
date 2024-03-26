const iResp = require('../utils/response.interface.js')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send(
        iResp.buildErrorResponse(
          403,
          'A token is required for authentication',
          null
        )
      )
  } else {
    const token = req.headers.authorization
    try {
      const decoded = jwt.verify(token, 'secret_key')
      req.user = decoded
    } catch (err) {
      return res
        .status(401)
        .send(iResp.buildErrorResponse(401, 'Invalid token', null))
    }
  }
  return next()
}

module.exports = verifyToken
