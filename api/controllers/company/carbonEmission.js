const iResp = require('../../utils/response.interface.js');

const carbonEmissionService = require('../../services/company/carbonEmission.js');

const getList = async (req, res) => {
    try {
        const result = await carbonEmissionService.getList();

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
        console.log(req.params.carbonEmissionId)
        const result = await carbonEmissionService.getById(req.params.carbonEmissionId);

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
        const result = await carbonEmissionService.create(req.body);

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
        console.log(req.params.carbonEmissionId, req.body)
        const result = await carbonEmissionService.update(req.params.carbonEmissionId, req.body);

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
        const result = await carbonEmissionService.remove(req.params.carbonEmissionId);
        console.log(req.params.carbonEmissionId)

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

module.exports = { getList, getById, create, update, remove }