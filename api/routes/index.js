const router = require('express').Router()

const userRouter = require('./user.js')
const exampleRouter = require('./example.js')

const companyRouter = require('./company.js')

router.use('/auth', userRouter)
router.use('/example', exampleRouter)

router.use('/company', companyRouter)

module.exports = router
