const jwt = require("jsonwebtoken");
const iResp = require('../utils/response.interface.js');

const verifyToken = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(403).send(iResp.buildErrorResponse(401, "A token is required for authentication"));
    }
    else {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, 'secret_key');
            req.user = decoded;
        } catch (err) {
            return res.status(401).send(iResp.buildErrorResponse(401, "Invalid Token"));
        }
    }
    return next();
};

module.exports = verifyToken;