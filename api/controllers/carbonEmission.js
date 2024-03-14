const iResp = require('../utils/response.interface.js');

const carbonEmissionService = require('../services/carbonEmission.js');

const getCarbonEmissions = async (req, res) => {
    try {
        const result = await carbonEmissionService.getCarbonEmissions();

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const getCarbonEmissionById = async (req, res) => {
    try {
        console.log(req.params.carbonEmissionId)
        const result = await carbonEmissionService.getCarbonEmissionById(req.params.carbonEmissionId);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const createCarbonEmission = async (req, res) => {
    try {
        console.log(req.body)
        const result = await carbonEmissionService.createCarbonEmission(req.body);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const updateCarbonEmission = async (req, res) => {
    try {
        console.log(req.params.carbonEmissionId, req.body)
        const result = await carbonEmissionService.updateCarbonEmission(req.params.carbonEmissionId, req.body);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const deleteCarbonEmission = async (req, res) => {
    try {
        const result = await carbonEmissionService.deleteCarbonEmission(req.params.carbonEmissionId);
        console.log(req.params.carbonEmissionId)

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

module.exports = { getCarbonEmissions, getCarbonEmissionById, createCarbonEmission, updateCarbonEmission, deleteCarbonEmission }