const salesProposalRouter = require('express').Router()
const salesProposalController = require('../../controllers/carbonTrading/carbonSalesProposal.js')

salesProposalRouter.get('/', salesProposalController.getList)
salesProposalRouter.get('/:salesProposalId', salesProposalController.getById)
salesProposalRouter.post('/', salesProposalController.create)
salesProposalRouter.put('/:salesProposalId', salesProposalController.update)
salesProposalRouter.delete('/:salesProposalId', salesProposalController.remove)

module.exports = salesProposalRouter;