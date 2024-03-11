const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    if(!req.headers.authorization){
        return res.status(403).send({"result":"A token is required for authentication"});
    }
    else {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, 'secret_key');
            req.user = decoded;
        } catch (err) {
            return res.status(401).send({"result":"Invalid Token"});
        }
    }
    return next();
};

module.exports = verifyToken;