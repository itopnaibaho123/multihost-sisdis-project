const router = require('express').Router()

const userRouter = require('./user.js')
const exampleRouter = require('./example.js')

const companyRouter = require('./company.js')
const salesProposalRouter = require('./carbonTrading/carbonSalesProposal.js')
const transactionRouter = require('./carbonTrading/carbonTransaction.js')
const notificationRouter = require('./notification.js')

router.use('/auth', userRouter)
router.use('/example', exampleRouter)

router.use('/company', companyRouter)
router.use('/carbon_trading/sales-proposal', salesProposalRouter)
router.use('/carbon_trading/transactions', transactionRouter)
router.use('/notifications', notificationRouter)

module.exports = router
