'use strict';
const iResp = require('../utils/response.interface.js')

const getShipments = async () => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get all shipment`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const getShipmentById = async (shipmentId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get shipment ${shipmentId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const createShipment = async (body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, 'Successfully  create a shipment', result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const updateShipment = async (shipmentId, body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, `Successfully update shipment ${shipmentId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const deleteShipment = async (shipmentId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully delete shipment ${shipmentId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}


module.exports = { getShipments, getShipmentById, createShipment, updateShipment, deleteShipment }

