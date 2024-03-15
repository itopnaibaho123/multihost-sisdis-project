const transactionRouter = require('express').Router()
const transactionController = require('../../controllers/carbonTrading/transaction.js')

transactionRouter.get('/', transactionController.getList)
transactionRouter.get('/:transactionId', transactionController.getById)
transactionRouter.post('/', transactionController.create)
transactionRouter.put('/:transactionId', transactionController.update)
transactionRouter.delete('/:transactionId', transactionController.remove)

module.exports = transactionRouter;