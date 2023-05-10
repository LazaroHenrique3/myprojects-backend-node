const User = require('../controllers/userController');
const yup = require('yup');

const createUserSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  passwordConfirm: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required(),
});

const validateCreateUser = async (req, res, next) => {
  const { body } = req;

  try {
    await createUserSchema.validate(body);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }

  const [existsUser] = await User.getUserByEmail(body.email);
  if (existsUser) {
    return res.status(400).json({ msg: 'This email has already been registered!' });
  }

  next();
};

const validateDeleteUser = async (req, res, next) => {
  const { id } = req.params;

  const [existsUser] = await User.getUserById(id);
  if (!existsUser) {
    return res.status(400).json({ msg: 'This user does not exist!' });
  }

  next();
};

const updateUserSchema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  password: yup.string(),
  passwordConfirm: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
});

const validateUpdateUser = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  try {
    await updateUserSchema.validate(body);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }

  const [existsUser] = await User.getUserById(id);
  if (!existsUser) {
    return res.status(400).json({ msg: 'This user does not exist!' });
  }

  const [emailExists] = await User.checkDuplicationEmailOnUpdate(body.email, id);
  if (emailExists) {
    return res.status(400).json({ msg: 'This email has already been registered!' });
  }

  next();
};

const checkUserId = async(req, res, next) => {
  const { id } = req.params;
  const userId = req.userId;

  //23 é o usuario de teste, logo não pode sofrear alterações
  //O usuario só pode fazer alterações (Update, Delete nele mesmo)
  if (userId == 23 || userId != id) {
    return res.status(405).send('Not Allowed!');
  }
  next();
}

module.exports = {
  validateCreateUser,
  validateDeleteUser,
  validateUpdateUser,
  checkUserId
};
