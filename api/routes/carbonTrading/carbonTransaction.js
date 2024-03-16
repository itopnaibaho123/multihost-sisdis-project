const carbonTransactionRouter = require('express').Router()
const carbonTransactionController = require('../../controllers/carbonTrading/carbonTransaction.js')

carbonTransactionRouter.get('/', carbonTransactionController.getList)
carbonTransactionRouter.get(
  '/:carbonTransactionId',
  carbonTransactionController.getById
)
carbonTransactionRouter.post('/', carbonTransactionController.create)
carbonTransactionRouter.put(
  '/:carbonTransactionId',
  carbonTransactionController.update
)
carbonTransactionRouter.delete(
  '/:carbonTransactionId',
  carbonTransactionController.remove
)

module.exports = carbonTransactionRouter
