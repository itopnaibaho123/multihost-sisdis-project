const iResp = require('../../utils/response.interface.js');

const ministryAdminService = require('../../services/user/ministryAdmin.js');

const getList = async (req, res) => {
    try {
        const result = await ministryAdminService.getList();

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
        console.log(req.params.ministryAdminId)
        const result = await ministryAdminService.getById(req.params.ministryAdminId);

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
        const result = await ministryAdminService.create(req.body);

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
        console.log(req.params.ministryAdminId, req.body)
        const result = await ministryAdminService.update(req.params.ministryAdminId, req.body);

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
        const result = await ministryAdminService.remove(req.params.ministryAdminId);
        console.log(req.params.ministryAdminId)

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

module.exports = { getList, getById, create, update, remove }