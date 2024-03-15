const iResp = require('../../utils/response.interface.js');

const divisionService = require('../../services/company/division.js');

const getDivisions = async (req, res) => {
    try {
        const result = await divisionService.getDivisions();

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const getDivisionById = async (req, res) => {
    try {
        console.log(req.params.divisionId)
        const result = await divisionService.getDivisionById(req.params.divisionId);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const createDivision = async (req, res) => {
    try {
        console.log(req.body)
        const result = await divisionService.createDivision(req.body);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const updateDivision = async (req, res) => {
    try {
        console.log(req.params.divisionId, req.body)
        const result = await divisionService.updateDivision(req.params.divisionId, req.body);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const deleteDivision = async (req, res) => {
    try {
        const result = await divisionService.deleteDivision(req.params.divisionId);
        console.log(req.params.divisionId)

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

module.exports = { getDivisions, getDivisionById, createDivision, updateDivision, deleteDivision }