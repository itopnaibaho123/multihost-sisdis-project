const companyRouter = require('express').Router()
const vehicleController = require('../controllers/company/vehicle.js')
const companyController = require('../controllers/company/company.js')
const divisionController = require('../controllers/company/division.js')
const shipmentController = require('../controllers/company/shipment.js')
const carbonEmissionController = require('../controllers/company/carbonEmission.js')
const supplyChainController = require('../controllers/company/supplyChain.js')
const auth = require('../middleware/auth.js')

companyRouter.get(
  '/vehicle/:companyId',
  auth.verifyToken,
  vehicleController.getList
)
companyRouter.get(
  '/vehicle/detail/:vehicleId',
  auth.verifyToken,
  vehicleController.getById
)
companyRouter.post('/vehicle', auth.verifyToken, vehicleController.create)
companyRouter.put(
  '/vehicle/:vehicleId',
  auth.verifyToken,
  vehicleController.update
)
companyRouter.delete(
  '/vehicle/:vehicleId',
  auth.verifyToken,
  vehicleController.remove
)

companyRouter.get(
  '/division/:companyId',
  auth.verifyToken,
  divisionController.getList
)
companyRouter.get(
  '/division/detail/:divisionId',
  auth.verifyToken,
  divisionController.getById
)
companyRouter.post(
  '/division',
  auth.onlyAdminPerusahaan,
  divisionController.create
)
companyRouter.put(
  '/division/:divisionId',
  auth.verifyToken,
  divisionController.update
)
companyRouter.delete(
  '/division/:divisionId',
  auth.verifyToken,
  divisionController.remove
)

companyRouter.get(
  '/shipment/:companyId',
  auth.verifyToken,
  shipmentController.getList
)
companyRouter.get(
  '/shipment/detail/:shipmentId',
  auth.verifyToken,
  shipmentController.getById
)
companyRouter.post('/shipment/', auth.verifyToken, shipmentController.create)
companyRouter.put(
  '/shipment/:shipmentId',
  auth.verifyToken,
  shipmentController.update
)
companyRouter.delete(
  '/shipment/:shipmentId',
  auth.verifyToken,
  shipmentController.remove
)

companyRouter.get(
  '/carbon_emission/:companyId',
  auth.verifyToken,
  carbonEmissionController.getList
)
companyRouter.get(
  '/carbon_emission/detail/:carbonEmissionId',
  auth.verifyToken,
  carbonEmissionController.getById
)
companyRouter.post(
  '/carbon_emission',
  auth.verifyToken,
  carbonEmissionController.create
)
companyRouter.put(
  '/carbon_emission/:carbonEmissionId',
  auth.verifyToken,
  carbonEmissionController.update
)
companyRouter.delete(
  '/carbon_emission/:carbonEmissionId',
  auth.verifyToken,
  carbonEmissionController.remove
)

companyRouter.get(
  '/supply_chain/:supplyId',
  auth.verifyToken,
  supplyChainController.getList
)
companyRouter.get(
  '/supply_chain/detail/:supplyId',
  auth.verifyToken,
  supplyChainController.getById
)
companyRouter.post(
  '/supply_chain',
  auth.verifyToken,
  supplyChainController.create
)

companyRouter.post(
  '/supply_chain/approve_kementerian/:supplyId',
  auth.onlyAdminKementerian,
  supplyChainController.ApproveKementerian
)

companyRouter.post(
  '/supply_chain/approve_perusahaan/:supplyId',
  auth.onlyAdminPerusahaan,
  supplyChainController.ApprovePerusahaan
)
companyRouter.put(
  '/supply_chain/:supplyId',
  auth.verifyToken,
  supplyChainController.update
)
companyRouter.delete(
  '/supply_chain/:supplyId',
  auth.verifyToken,
  supplyChainController.remove
)

companyRouter.get('/', auth.verifyToken, companyController.getList)
companyRouter.get('/:companyId', auth.verifyToken, companyController.getById)
companyRouter.post('/', companyController.create)
companyRouter.put(
  '/approve/:companyId',
  auth.onlyKementerian,
  companyController.approve
)

module.exports = companyRouter
