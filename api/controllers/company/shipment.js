const iResp = require('../../utils/response.interface.js');

const shipmentService = require('../../services/company/shipment.js');

const getShipments = async (req, res) => {
    try {
        const result = await shipmentService.getShipments();

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const getShipmentById = async (req, res) => {
    try {
        console.log(req.params.shipmentId)
        const result = await shipmentService.getShipmentById(req.params.shipmentId);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const createShipment = async (req, res) => {
    try {
        console.log(req.body)
        const result = await shipmentService.createShipment(req.body);

        if (!result.success) {
            res.status(result.code).send(result)
        }
        
        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const updateShipment = async (req, res) => {
    try {
        console.log(req.params.shipmentId, req.body)
        const result = await shipmentService.updateShipment(req.params.shipmentId, req.body);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const deleteShipment = async (req, res) => {
    try {
        const result = await shipmentService.deleteShipment(req.params.shipmentId);
        console.log(req.params.shipmentId)

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

module.exports = { getShipments, getShipmentById, createShipment, updateShipment, deleteShipment }