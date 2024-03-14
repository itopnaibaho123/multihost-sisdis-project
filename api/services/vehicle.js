'use strict';
const iResp = require('../utils/response.interface.js')

const getVehicles = async () => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get all vehicle`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const getVehicleById = async (vehicleId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully get vehicle ${vehicleId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const createVehicle = async (body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, 'Successfully  create a vehicle', result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const updateVehicle = async (vehicleId, body) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(201, `Successfully update vehicle ${vehicleId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}

const deleteVehicle = async (vehicleId) => {
    try {
        let result = {};
        return iResp.buildSuccessResponse(200, `Successfully delete vehicle ${vehicleId}`, result);
    } catch (error) {
        return iResp.buildErrorResponse(500, 'Something wrong', error);
    }
}


module.exports = { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle }

