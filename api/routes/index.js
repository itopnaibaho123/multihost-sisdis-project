const router = require('express').Router()

const userRouter = require('./user.js')
router.use('/auth', userRouter)

module.exports = router;