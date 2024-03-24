const adminRouter = require('express').Router()
const adminController = require('../controllers/admin.js')

adminRouter.post('/register', adminController.registerUser)
adminRouter.post('/enroll', adminController.enrollAdmin)
adminRouter.post('/login', adminController.loginUser)
adminRouter.post('/update', adminController.updateUser)

module.exports = adminRouter
