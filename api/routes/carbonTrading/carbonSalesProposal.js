const salesProposalRouter = require('express').Router()
const salesProposalController = require('../../controllers/carbonTrading/carbonSalesProposal.js')
const auth = require('../../middleware/auth.js')

salesProposalRouter.get('/', auth.verifyToken, salesProposalController.getList)
salesProposalRouter.get(
  '/perusahaan/:idPerusahaan',
  auth.onlyAdminPerusahaan,
  salesProposalController.getById
)
salesProposalRouter.get(
  '/:salesProposalId',
  auth.onlyAdminPerusahaan,
  salesProposalController.getById
)
salesProposalRouter.post('/', auth.verifyToken, salesProposalController.create)
salesProposalRouter.put(
  '/:salesProposalId',
  auth.verifyToken,
  salesProposalController.update
)
salesProposalRouter.delete(
  '/:salesProposalId',
  auth.verifyToken,
  salesProposalController.remove
)

module.exports = salesProposalRouter
