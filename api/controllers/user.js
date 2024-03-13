const userService = require('../services/user.js')


const registerUser = async(req, res) => {
    try{

        const data = req.body;
        console.log(data);
        const username = data.username;
        const orgName = data.organizationName;
        const role = data.role;

        const result = await userService.registerUser(username, orgName, role)
        
        if (!result.error){
            res.status(200).send(result)
        }
        else{
            res.status(500).send(result)
        }

    } catch(error){
        const response = {
            "success": false, 
            "error": error.toString()
        };
        res.status(400).send(response)
    }
}

const enrollAdmin = async(req, res) => {
    try{
        
        const data = req.body;
        const username = data.username;
        const password = data.password;
        const orgName = data.organizationName;

        const result = await userService.enrollAdmin(username, password, orgName)
        res.status(200).send(result)

    } catch(error){
        const response = {
            "success": false, 
            "error": error.toString()
        };
        res.status(400).send(response)
    }
}


const loginUser = async(req, res) => {
    try{
        const data = req.body;
        const username = data.username;
        const password = data.password;

        const result = await userService.loginUser(username, password)
        res.status(200).send(result)

    } catch(error) {
        const response = {
            "success": false,
            "error": `Login Failed: ${error}` 
        }
        res.status(401).send(response)
        
    }
}

const updateUser = async(req, res) => {
    try{
        const data = req.body;
        const username = data.username;
        const password = data.password;
        const organizationName = data.organizationName;
        const dataUser = data.dataUser
        const role = data.role

        const result = await userService.updateUser(organizationName, username, password, role, dataUser)
        res.status(200).send(result)

    } catch(error) {
        const response = {
            "success": false,
            "error": `Update User Failed: ${error}` 
        }
        res.status(401).send(response)
        
    }
}

module.exports = {enrollAdmin, registerUser, loginUser, updateUser}