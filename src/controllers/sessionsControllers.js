const jwt = require('jsonwebtoken')

const User = require('./userController')
const auth = require('../services/auth')

const authConfig = require('../config/auth')

const create = async (req, res) => {
    //Pegando os dados do form de login
    const {email, password} = req.body

    //buscando o usuário
    const [user] = await User.getUserByEmail(email)

    //Verificando se o usuário foi encontrado
    if(!user){
        return res.status(401).json({msg: "User / password invalid."})
    }

    //verificando se a senha está correta
    const isPassword = await auth.checkPassword(user, password)
    if(!isPassword){
        return res.status(401).json({msg: "User / password invalid."})
    }

    //Resgatando o id do usuario para devolver junto ao token
    const {id, name} = user

    return res.status(200).json({
        user: {
            id,
            name,
            email
        },
        token: jwt.sign({id}, authConfig.secret, {
            expiresIn: authConfig.expiresIn
        })
    })
}

module.exports = {
    create
}
