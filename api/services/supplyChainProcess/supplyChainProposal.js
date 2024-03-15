'use strict';
const iResp = require('../../utils/response.interface.js')

const getList = async () => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get all supply chain proposal`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const getById = async (scProposalId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get supply chain proposal ${scProposalId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const create = async (body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, 'Successfully  create a supply chain proposal', result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const update = async (scProposalId, body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, `Successfully update supply chain proposal ${scProposalId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const remove = async (scProposalId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully delete supply chain proposal ${scProposalId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}


module.exports = { getList, getById, create, update, remove }

