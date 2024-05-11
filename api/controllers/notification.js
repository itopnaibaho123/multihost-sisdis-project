const iResp = require('../utils/response.interface.js')

const notificationService = require('../services/notification.js')

const getNotification = async (req, res) => {
  const result = await notificationService.getNotification(req.user, req.body)
  res.status(result.code).send(result)
}

module.exports = { getNotification }
