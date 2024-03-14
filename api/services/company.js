'use strict';
const iResp = require('../utils/response.interface.js')

const getCompanies = async () => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get all company`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const getCompanyById = async (companyId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get company ${companyId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const createCompany = async (body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, 'Successfully  create a company', result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const updateCompany = async (companyId, body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, `Successfully update company ${companyId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const deleteCompany = async (companyId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully delete company ${companyId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}


module.exports = { getCompanies, getCompanyById, createCompany, updateCompany, deleteCompany }

