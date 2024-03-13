const router = require('express').Router()

const userRouter = require('./user.js')
const shipmentController = require('./shipment.js')

router.use('/auth', userRouter)
router.use('/shipment', shipmentController)

module.exports = router;