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

/*Lógica bem parecida com a do user, só que aqui basicamente irei impedir o user de 
dar get(buscar) nos proejtos que não sejam dele, logo por consequencia ele não poderá nem 
fazer update ou delete em projetos allheios ou sequer fazer algo com as tasks destes projetos,
além disso adicionei na rota de post também para impedir a criação de projetos para users que
não sejam ele*/ 
const checkUserId = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.userId;

    if (userId != id) {
        return res.status(405).send('Not Allowed!');
    }
    next();
}

module.exports = {
    validateCreateProject,
    validateUpdateProject,
    checkUserId,
};