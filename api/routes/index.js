const router = require('express').Router()

const userRouter = require('./user.js')
const carbonEmissionController = require('./company/carbonEmission.js')
const companyController = require('./company/company.js')
const divisionController = require('./company/division.js')
const shipmentController = require('./company/shipment.js')
const vehicleController = require('./company/vehicle.js')

router.use('/auth', userRouter)
router.use('/carbon_emission', carbonEmissionController)
router.use('/company', companyController)
router.use('/division', divisionController)
router.use('/shipment', shipmentController)
router.use('/vehicle', vehicleController)

module.exports = router;