const router = require('express').Router()

const userRouter = require('./user.js')
const carbonEmissionController = require('./carbonEmission.js')
const companyController = require('./company.js')
const divisionController = require('./division.js')
const shipmentController = require('./shipment.js')
const vehicleController = require('./vehicle.js')

router.use('/auth', userRouter)
router.use('/carbon_emission', carbonEmissionController)
router.use('/company', companyController)
router.use('/division', divisionController)
router.use('/shipment', shipmentController)
router.use('/vehicle', vehicleController)

module.exports = router;