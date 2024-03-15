'use strict';
const iResp = require('../../utils/response.interface.js')

const getList = async () => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get all carbonTransaction`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const getById = async (carbonTransactionId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get carbonTransaction ${carbonTransactionId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const create = async (body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, 'Successfully  create a carbonTransaction', result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const update = async (carbonTransactionId, body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, `Successfully update carbonTransaction ${carbonTransactionId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const remove = async (carbonTransactionId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully delete carbonTransaction ${carbonTransactionId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}


module.exports = { getList, getById, create, update, remove }

