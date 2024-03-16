const scProcessRouter = require('express').Router()
const scProcessController = require('../../controllers/supplyChainProcess/supplyChain.js')

scProcessRouter.get('/', scProcessController.getList)
scProcessRouter.get('/:scProcessId', scProcessController.getById)
scProcessRouter.post('/', scProcessController.create)
scProcessRouter.put('/:scProcessId', scProcessController.update)
scProcessRouter.delete('/:scProcessId', scProcessController.remove)

module.exports = scProcessRouter
