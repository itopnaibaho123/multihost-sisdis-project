const scManagerRouter = require('express').Router()
const scManagerController = require('../../controllers/user/supplyChainManager.js')

scManagerRouter.get('/', scManagerController.getList)
scManagerRouter.get('/:scManagerId', scManagerController.getById)
scManagerRouter.post('/', scManagerController.create)
scManagerRouter.put('/:scManagerId', scManagerController.update)
scManagerRouter.delete('/:scManagerId', scManagerController.remove)

module.exports = scManagerRouter;