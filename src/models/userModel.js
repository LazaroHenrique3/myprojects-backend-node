/*const connection = require('../config/connection')*/
const db = require('../config/connection')

const getAll = async () => {
    const connection = await db.connect();
    const [users] = await connection.execute("SELECT * FROM users")
    return users
}

const getUserById = async (id) => {
    const connection = await db.connect();
    try {
        const [user] = await connection.execute("SELECT * FROM users WHERE id = ?", [id])
        return user
    } catch (error) {
        return res.status(500).json({msg: "Internal error"})
    }
 
}

const getUserByEmail = async (email) => {
    const connection = await db.connect();
    try {
        const [user] = await connection.execute("SELECT * FROM users WHERE email = ?", [email])
        return user
    } catch (error) {
        return res.status(500).json({msg: "Internal error"})
    }

}

const createUser = async (user) => {
    const connection = await db.connect();
    const { name, email, password } = user
    const [createdUser] = await connection.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password])
    return [createdUser]
}

const deleteUser = async (id) => {
    const connection = await db.connect();
    const [removedUser] = await connection.execute("DELETE FROM users WHERE id = ?", [id])
    return removedUser
}

const updateUser = async (id, user) => {
    const connection = await db.connect();
    const { name, email, password } = user
    if (password === '') {
        const [updatedUser] = await connection.execute("UPDATE users SET name = ?,  email = ? WHERE id = ?", [name, email, id])
        return updatedUser
    }

    const [updatedUser] = await connection.execute("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [name, email, password, id])
    return updatedUser
}

const checkDuplicationEmailOnUpdate = async (email, userId) => {
    const connection = await db.connect();
    try {
        const user = await connection.execute("SELECT * FROM users WHERE email = ? AND id <> ?", [email, userId])
        return user
    } catch (error) {
        return res.status(500).json({msg: "Internal error"})
    }
}

module.exports = {
    getAll,
    getUserById,
    getUserByEmail,
    createUser,
    deleteUser,
    updateUser,
    checkDuplicationEmailOnUpdate
}