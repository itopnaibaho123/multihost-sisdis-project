const router = require('express').Router()

const userRouter = require('./user.js')

const companyController = require('./company/company.js')
const carbonEmissionController = require('./company/carbonEmission.js')
const divisionController = require('./company/division.js')
const shipmentController = require('./company/shipment.js')
const vehicleController = require('./company/vehicle.js')

router.use('/auth', )
router.use('/auth/ministry', )
router.use('/auth/sc-staff', )
router.use('/auth/sc-manager', )
router.use('/auth/sc-admin', )

router.use('/company', companyController)
router.use('/company/carbon_emission', carbonEmissionController)
router.use('/company/division', divisionController)
router.use('/company/shipment', shipmentController)
router.use('/company/vehicle', vehicleController)

router.use('/carbon_trading/sales/proposal', )
router.use('/carbon_trading/transactions', )

router.use('/supply_chain', )
router.use('/supply_chain/proposal', )

module.exports = router;