const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth')
const util = require('util')

const authenticate = async (req, res, next) => {
    //Pegando o token de autorização
    const authHeader = req.headers.authorization

    //Verificando se o header foi enviado
    if (!authHeader) {
        return res.status(401).json({ msg: "Token was not provided." })
    }

    //Bearer XXXXX
    const [, token] = authHeader.split(' ')

    try {
        //Comparadno os tokens
        const decoded = await util.promisify(jwt.verify)(token, authConfig.secret)

        req.userId = decoded.id
        return next()
    } catch (error) {
        //console.log(error)
        return res.status(401).json({ msg: "invalid token." })
    }
}

module.exports = {
    authenticate
}