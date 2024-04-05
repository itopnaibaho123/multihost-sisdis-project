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

userRouter.post('/edit/password', auth.verifyToken, userController.editPassword)

userRouter.post('/edit/email', auth.verifyToken, userController.editEmail)

userRouter.get(
  '/list/manager',
  auth.onlyAdminPerusahaan,
  userController.getAllManagerByIdPerusahaan
)

userRouter.get(
  '/list/staf',
  auth.onlyAdminKementerian,
  userController.getAllStafKementerian
)

userRouter.post('/delete/user', auth.verifyToken, userController.deleteUser)

module.exports = userRouter
