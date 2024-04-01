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

userRouter.get(
  '/list/manager/:idPerusahaan',
  auth.onlyAdminPerusahaan,
  userController.getAllManagerByIdPerusahaan
)

userRouter.get(
  '/list/staf',
  auth.onlyAdminKementerian,
  userController.getAllStafKementerian
)

module.exports = userRouter
