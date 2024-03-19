const scAdminRouter = require('express').Router()
const scAdminController = require('../../controllers/user/supplyChainManager.js')

scAdminRouter.get('/', scAdminController.getList)
scAdminRouter.get('/:scAdminId', scAdminController.getById)
scAdminRouter.post('/', scAdminController.create)
scAdminRouter.put('/:scAdminId', scAdminController.update)
scAdminRouter.delete('/:scAdminId', scAdminController.remove)

module.exports = scAdminRouter
