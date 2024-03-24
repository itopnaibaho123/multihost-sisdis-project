const router = require('express').Router()

const adminRouter = require('./user.js')
const exampleRouter = require('./example.js')

const companyRouter = require('./company.js')
const salesProposalRouter = require('./carbonTrading/carbonSalesProposal.js')
const transactionRouter = require('./carbonTrading/carbonTransaction.js')

router.use('/admin', adminRouter)
router.use('/example', exampleRouter)

router.use('/company', companyRouter)
router.use('/carbon_trading/sales-proposal', salesProposalRouter)
router.use('/carbon_trading/transactions', transactionRouter)

module.exports = router
