'use strict';
const iResp = require('../../utils/response.interface.js')

const getDivisions = async () => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get all division`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const getDivisionById = async (divisionId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get division ${divisionId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const createDivision = async (body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, 'Successfully  create a division', result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const updateDivision = async (divisionId, body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, `Successfully update division ${divisionId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const deleteDivision = async (divisionId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully delete division ${divisionId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}


module.exports = { getDivisions, getDivisionById, createDivision, updateDivision, deleteDivision }

