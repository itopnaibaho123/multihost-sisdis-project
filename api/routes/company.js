const companyRouter = require('express').Router()
const vehicleController = require('../controllers/company/vehicle.js')
const companyController = require('../controllers/company/company.js')
const divisionController = require('../controllers/company/division.js')
const shipmentController = require('../controllers/company/shipment.js')
const carbonEmissionController = require('../controllers/company/carbonEmission.js')
const auth = require('../middleware/auth.js')

companyRouter.get('/vehicle', vehicleController.getList)
companyRouter.get('/vehicle/:vehicleId', vehicleController.getById)
companyRouter.post('/vehicle', vehicleController.create)
companyRouter.put('/vehicle/:vehicleId', vehicleController.update)
companyRouter.delete('/vehicle/:vehicleId', vehicleController.remove)

companyRouter.get('/division', divisionController.getList)
companyRouter.get('/division/:divisionId', divisionController.getById)
companyRouter.post('/division/', divisionController.create)
companyRouter.put('/division/:divisionId', divisionController.update)
companyRouter.delete('/division/:divisionId', divisionController.remove)

companyRouter.get('/shipment', shipmentController.getList)
companyRouter.get('/shipment/:shipmentId', shipmentController.getById)
companyRouter.post('/shipment/', shipmentController.create)
companyRouter.put('/shipment/:shipmentId', shipmentController.update)
companyRouter.delete('/shipment/:shipmentId', shipmentController.remove)

companyRouter.get('/carbon_emission', carbonEmissionController.getList)
companyRouter.get(
  '/carbon_emission/:carbonEmissionId',
  carbonEmissionController.getById
)
companyRouter.post('/carbon_emission', carbonEmissionController.create)
companyRouter.put(
  '/carbon_emission/:carbonEmissionId',
  carbonEmissionController.update
)
companyRouter.delete(
  '/carbon_emission/:carbonEmissionId',
  carbonEmissionController.remove
)

companyRouter.get('/', auth, companyController.getList)
companyRouter.get('/:companyId', companyController.getById)
companyRouter.post('/', companyController.create)
companyRouter.put('/:companyId', companyController.update)
companyRouter.delete('/:companyId', companyController.remove)

module.exports = companyRouter
