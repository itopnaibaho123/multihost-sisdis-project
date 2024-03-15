const iResp = require('../../utils/response.interface.js');

const vehicleService = require('../../services/company/vehicle.js');

const getVehicles = async (req, res) => {
    try {
        const result = await vehicleService.getVehicles();

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const getVehicleById = async (req, res) => {
    try {
        console.log(req.params.vehicleId)
        const result = await vehicleService.getVehicleById(req.params.vehicleId);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const createVehicle = async (req, res) => {
    try {
        console.log(req.body)
        const result = await vehicleService.createVehicle(req.body);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const updateVehicle = async (req, res) => {
    try {
        console.log(req.params.vehicleId, req.body)
        const result = await vehicleService.updateVehicle(req.params.vehicleId, req.body);

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

const deleteVehicle = async (req, res) => {
    try {
        const result = await vehicleService.deleteVehicle(req.params.vehicleId);
        console.log(req.params.vehicleId)

        if (!result.success) {
            res.status(result.code).send(result)
        }

        res.status(result.code).send(result)
    } catch (error) {
        res.status(500).send(iResp.buildErrorResponse(500, 'Something wrong', error));
    }
}

module.exports = { getVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle }