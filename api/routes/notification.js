const notificationRouter = require('express').Router()
const auth = require('../middleware/auth.js')
const notificationController = require('../controllers/notification.js')

notificationRouter.get(
  '/',
  auth.verifyToken,
  notificationController.getNotification
)

module.exports = notificationRouter
