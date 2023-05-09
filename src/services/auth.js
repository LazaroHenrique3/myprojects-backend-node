const bcrypt = require('bcrypt')

const createPasswordHash = async (password) => {
    const salt = await bcrypt.genSalt(12)
    return await bcrypt.hash(password, salt)
}

const checkPassword = (user, password) => bcrypt.compare(password, user.password)

module.exports = {
    createPasswordHash,
    checkPassword
}