const iResp = require('../../utils/response.interface.js');

const shipmentService = require('../../services/company/shipment.js');

const getList = async (req, res) => {
    try {
        const result = await shipmentService.getList();

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const getById = async (req, res) => {
    try {
        console.log(req.params.shipmentId)
        const result = await shipmentService.getById(req.params.shipmentId);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const create = async (req, res) => {
    try {
        console.log(req.body)
        const result = await shipmentService.create(req.body);

        if (!result.success) {
            res.status(result.code).send(result)
        }
        
        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const update = async (req, res) => {
    try {
        console.log(req.params.shipmentId, req.body)
        const result = await shipmentService.update(req.params.shipmentId, req.body);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const remove = async (req, res) => {
    try {
        const result = await shipmentService.remove(req.params.shipmentId);
        console.log(req.params.shipmentId)

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

module.exports = { getList, getById, create, update, remove }