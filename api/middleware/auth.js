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
    try {
      const token = req.headers.authorization
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

const onlyKementerian = (req, res, next) => {
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
  }
  try {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, 'secret_key')
    if (decoded.userType.split('-')[1] !== 'kementerian') {
      return res
        .status(401)
        .send(
          iResp.buildErrorResponse(
            403,
            'Only person from kementerian who can access this',
            null
          )
        )
    } else {
      req.user = decoded
    }
  } catch (err) {
    return res
      .status(401)
      .send(iResp.buildErrorResponse(401, 'Invalid token', null))
  }
  return next()
}

const onlyAdminKementerian = (req, res, next) => {
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
  }
  try {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, 'secret_key')
    if (decoded.userType !== 'admin-kementerian') {
      return res
        .status(401)
        .send(
          iResp.buildErrorResponse(
            403,
            'Only Admin of kementerian can access this',
            null
          )
        )
    } else {
      req.user = decoded
    }
  } catch (err) {
    return res
      .status(401)
      .send(iResp.buildErrorResponse(401, 'Invalid token', null))
  }
  return next()
}

const onlyStafKementerian = (req, res, next) => {
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
  }
  try {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, 'secret_key')
    if (decoded.userType !== 'staf-kementerian') {
      return res
        .status(401)
        .send(
          iResp.buildErrorResponse(
            403,
            'Only Staf kementerian can access this',
            null
          )
        )
    } else {
      req.user = decoded
    }
  } catch (err) {
    return res
      .status(401)
      .send(iResp.buildErrorResponse(401, 'Invalid token', null))
  }
  return next()
}

const onlyPerusahaan = (req, res, next) => {
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
  }
  try {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, 'secret_key')
    if (decoded.userType.split('-')[1] !== 'perusahaan') {
      return res
        .status(401)
        .send(
          iResp.buildErrorResponse(
            403,
            'Only person from perusahaan who can access this',
            null
          )
        )
    } else {
      req.user = decoded
    }
  } catch (err) {
    return res
      .status(401)
      .send(iResp.buildErrorResponse(401, 'Invalid token', null))
  }
  return next()
}

const onlyAdminPerusahaan = (req, res, next) => {
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
  }
  try {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, 'secret_key')
    if (decoded.userType !== 'admin-perusahaan') {
      return res
        .status(401)
        .send(
          iResp.buildErrorResponse(
            403,
            'Only Admin of supply chain can access this',
            null
          )
        )
    } else {
      req.user = decoded
    }
  } catch (err) {
    return res
      .status(401)
      .send(iResp.buildErrorResponse(401, 'Invalid token', null))
  }
  return next()
}

const onlyManagerPerusahaan = (req, res, next) => {
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
  }
  try {
    const token = req.headers.authorization
    const decoded = jwt.verify(token, 'secret_key')
    if (decoded.userType !== 'manager-perusahaan') {
      return res
        .status(401)
        .send(
          iResp.buildErrorResponse(
            403,
            'Only Manager of supply chain can access this',
            null
          )
        )
    } else {
      req.user = decoded
    }
  } catch (err) {
    return res
      .status(401)
      .send(iResp.buildErrorResponse(401, 'Invalid token', null))
  }
  return next()
}

module.exports = {
  verifyToken,
  onlyPerusahaan,
  onlyAdminPerusahaan,
  onlyManagerPerusahaan,
  onlyKementerian,
  onlyAdminKementerian,
  onlyStafKementerian,
}
