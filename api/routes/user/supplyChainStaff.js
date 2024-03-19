const scStaffRouter = require('express').Router()
const scStaffController = require('../../controllers/user/supplyChainStaff.js')

scStaffRouter.get('/', scStaffController.getList)
scStaffRouter.get('/:scStaffId', scStaffController.getById)
scStaffRouter.post('/', scStaffController.create)
scStaffRouter.put('/:scStaffId', scStaffController.update)
scStaffRouter.delete('/:scStaffId', scStaffController.remove)

module.exports = scStaffRouter
