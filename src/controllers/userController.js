const userModel = require('../models/userModel')
const auth = require('../services/auth')

const getAll = async (req, res) => {
    try {
        const users = await userModel.getAll()
        return res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Internal error" })
    }
}

const getUserByEmail = async (email) => {
    try {
        const user = await userModel.getUserByEmail(email)
        return user
    } catch (error) {
        console.log(error)
    }
}

const getUserById = async (id) => {
    try {
        const user = await userModel.getUserById(id)
        return user
    } catch (error) {
        console.log(error)
    }
}

const createUser = async (req, res) => {
    try {
        const {name, email, password} = req.body

        //Criptografando a senha
        const passwordHash = await auth.createPasswordHash(password)

        await userModel.createUser({name, email, password: passwordHash})
        return res.status(201).json({ msg: "User created!" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Internal error" })
    }
}


const deleteUser = async (req, res) => {
    try {
        const {id} = req.params
        await userModel.deleteUser(id)
        return res.status(200).json({ msg: "User deleted!" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Internal error" })
    }
}

const updateUser = async (req, res) => {
    try {
        const {id} = req.params
        const {name, email, password} = req.body
        let passwordUser = ''

        //Criptografando a senha se necessário
        if(password !== ''){
            passwordUser = await auth.createPasswordHash(password)
        }

        await userModel.updateUser(id, {name, email, password: passwordUser})

        return res.status(200).json({ msg: "User updated!", user: {id, name, email}})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Internal error" })
    }
}

const checkDuplicationEmailOnUpdate = async (email, id) => {
    try {
        const [user] = await userModel.checkDuplicationEmailOnUpdate(email, id)
        return user
    } catch (error) {
        console.log(error)
    }
}

module.exports =  {
    getAll,
    getUserById,
    getUserByEmail,
    createUser,
    deleteUser,
    updateUser,
    checkDuplicationEmailOnUpdate
}
