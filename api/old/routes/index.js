const router = require('express').Router()

const userRouter = require('./user.js')
const exampleRouter = require('../../routes/example.js')

const ministryStaffRouter = require('./user/ministryStaff.js')
const ministryAdminRouter = require('./user/ministryAdmin.js')
const scManagerRouter = require('./user/supplyChainManager.js')
const scAdminRouter = require('./user/supplyChainAdmin.js')

const companyRouter = require('./company/company.js')
const carbonEmissionRouter = require('./company/carbonEmission.js')
const divisionRouter = require('./company/division.js')
const shipmentRouter = require('./company/shipment.js')
const vehicleRouter = require('./company/vehicle.js')

const salesProposalRouter = require('./carbonTrading/carbonSalesProposal.js')
const transactionRouter = require('./carbonTrading/carbonTransaction.js')

const scProcessRouter = require('./supplyChainProcess/supplyChain.js')
const scProposalRouter = require('./supplyChainProcess/supplyChainProposal.js')

router.use('/auth', userRouter)
router.use('/example', exampleRouter)

router.use('/user/ministry-staff', ministryStaffRouter)
router.use('/user/ministry-admin', ministryAdminRouter)
router.use('/user/sc-manager', scManagerRouter)
router.use('/user/sc-admin', scAdminRouter)

router.use('/company', companyRouter)
router.use('/company/carbon_emission', carbonEmissionRouter)
router.use('/company/division', divisionRouter)
router.use('/company/shipment', shipmentRouter)
router.use('/company/vehicle', vehicleRouter)

router.use('/carbon_trading/sales-proposal', salesProposalRouter)
router.use('/carbon_trading/transactions', transactionRouter)

router.use('/supply_chain', scProcessRouter)
router.use('/supply_chain/proposal', scProposalRouter)

module.exports = router
