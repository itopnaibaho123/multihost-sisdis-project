const router = require('express').Router()

const userRouter = require('./user.js')
const companyController = require('./company.js')
const shipmentController = require('./shipment.js')

router.use('/auth', userRouter)
router.use('/company', companyController)
router.use('/shipment', shipmentController)

module.exports = router;