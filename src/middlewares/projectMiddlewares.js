const yup = require('yup');
const User = require('../controllers/userController')

const createProjectSchema = yup.object().shape({
    title: yup.string().required(),
    user: yup.string().required(),
});

const updateProjectSchema = yup.object().shape({
    title: yup.string().required(),
    status: yup.string().required(),
});

const validateCreateProject = async (req, res, next) => {
    try {
        const { body } = req;
        await createProjectSchema.validate(body);

        const users = await User.getUserById(body.user);
        const existsUser = users[0];

        if (!existsUser) {
            return res.status(400).json({ msg: 'This user does not exist!' });
        }

        next();
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
};

const validateUpdateProject = async (req, res, next) => {
    try {
        const { body } = req;
        await updateProjectSchema.validate(body);
        next();
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
};

module.exports = {
    validateCreateProject,
    validateUpdateProject
};