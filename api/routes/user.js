const userRouter = require('express').Router()
const userController = require('../controllers/user.js')
const auth = require('../middleware/auth.js')

userRouter.post('/user/register', auth.verifyToken, userController.registerUser)
userRouter.post(
  '/admin-kementerian/register',
  userController.registerAdminKementrian
)

userRouter.post('/enroll', userController.enrollAdmin)
userRouter.post('/login', userController.loginUser)
userRouter.post('/update', userController.updateUser)

module.exports = userRouter
