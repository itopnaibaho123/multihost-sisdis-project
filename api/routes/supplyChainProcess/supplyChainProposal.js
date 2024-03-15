const scProposalRouter = require('express').Router()
const scProposalController = require('../../controllers/supplyChainProcess/supplyChainProposal.js')

scProposalRouter.get('/', scProposalController.getList)
scProposalRouter.get('/:scProposalId', scProposalController.getById)
scProposalRouter.post('/', scProposalController.create)
scProposalRouter.put('/:scProposalId', scProposalController.update)
scProposalRouter.delete('/:scProposalId', scProposalController.remove)

module.exports = scProposalRouter;