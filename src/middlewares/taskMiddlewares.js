const yup = require('yup');
const Project = require('../controllers/projectController');

const createTaskSchema = yup.object().shape({
  title: yup.string().required(),
  projectId: yup.string().required(),
});

const updateTaskSchema = yup.object().shape({
  title: yup.string().required(),
  status: yup.string().required(),
});

const validateCreateTask = async (req, res, next) => {
  try {
    const { body } = req;
    await createTaskSchema.validate(body, { abortEarly: false });

    const project = await Project.getProjectById(body.projectId);
    if (!project[0]) {
      return res.status(400).json({ msg: 'This project does not exist!' });
    }

    return next();
  } catch (err) {
    return res.status(400).json({ msg: err.errors });
  }
};

const validateUpdateTask = async (req, res, next) => {
  try {
    const { body } = req;
    await updateTaskSchema.validate(body, { abortEarly: false });

    return next();
  } catch (err) {
    return res.status(400).json({ msg: err.errors });
  }
};

module.exports = {
  validateCreateTask,
  validateUpdateTask,
};