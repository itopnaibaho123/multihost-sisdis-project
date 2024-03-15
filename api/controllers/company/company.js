const iResp = require('../../utils/response.interface.js');

const companyService = require('../../services/company/company.js')

const getCompanies = async (req, res) => {
    try {
        const result = await companyService.getCompanies();

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const getCompanyById = async (req, res) => {
    try {
        console.log(req.params.companyId)
        const result = await companyService.getCompanyById(req.params.companyId);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const createCompany = async (req, res) => {
    try {
        console.log(req.body)
        const result = await companyService.createCompany(req.body);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const updateCompany = async (req, res) => {
    try {
        console.log(req.params.companyId, req.body)
        const result = await companyService.updateCompany(req.params.companyId, req.body);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const deleteCompany = async (req, res) => {
    try {
        const result = await companyService.deleteCompany(req.params.companyId);
        console.log(req.params.companyId)

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

module.exports = { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany }