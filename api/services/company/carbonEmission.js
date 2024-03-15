'use strict';
const iResp = require('../../utils/response.interface.js')

const getCarbonEmissions = async () => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get all carbonEmission`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const getCarbonEmissionById = async (carbonEmissionId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get carbonEmission ${carbonEmissionId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const createCarbonEmission = async (body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, 'Successfully  create a carbonEmission', result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const updateCarbonEmission = async (carbonEmissionId, body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, `Successfully update carbonEmission ${carbonEmissionId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const deleteCarbonEmission = async (carbonEmissionId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully delete carbonEmission ${carbonEmissionId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}


module.exports = { getCarbonEmissions, getCarbonEmissionById, createCarbonEmission, updateCarbonEmission, deleteCarbonEmission }

