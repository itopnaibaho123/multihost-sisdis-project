const carbonTransactionRouter = require('express').Router()
const carbonTransactionController = require('../../controllers/carbonTrading/carbonTransaction.js')
const auth = require('../../middleware/auth.js')

carbonTransactionRouter.get(
  '/',
  auth.verifyToken,
  carbonTransactionController.getList
)
carbonTransactionRouter.get(
  '/:carbonTransactionId',
  auth.verifyToken,
  carbonTransactionController.getById
)
carbonTransactionRouter.get(
  '/proposal/:idProposal',
  auth.onlyAdminPerusahaan,
  carbonTransactionController.getCarbonTransactionByIdProposal
)
carbonTransactionRouter.get(
  '/perusahaan/:idPerusahaan',
  auth.onlyAdminPerusahaan,
  carbonTransactionController.getCarbonTransactionByIdPerusahaan
)
carbonTransactionRouter.post(
  '/verifikasi_transfer_karbon',
  auth.onlyAdminPerusahaan,
  carbonTransactionController.verifikasiTransferKarbon
)
carbonTransactionRouter.post(
  '/',
  auth.verifyToken,
  carbonTransactionController.create
)
carbonTransactionRouter.put(
  '/:carbonTransactionId',
  auth.verifyToken,
  carbonTransactionController.update
)
carbonTransactionRouter.delete(
  '/:carbonTransactionId',
  auth.verifyToken,
  carbonTransactionController.remove
)

module.exports = carbonTransactionRouter
