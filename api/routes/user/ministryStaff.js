const ministryStaffRouter = require('express').Router()
const ministryStaffController = require('../../controllers/user/ministryStaff.js')

ministryStaffRouter.get('/', ministryStaffController.getList)
ministryStaffRouter.get('/:ministryStaffId', ministryStaffController.getById)
ministryStaffRouter.post('/', ministryStaffController.create)
ministryStaffRouter.put('/:ministryStaffId', ministryStaffController.update)
ministryStaffRouter.delete('/:ministryStaffId', ministryStaffController.remove)

module.exports = ministryStaffRouter;