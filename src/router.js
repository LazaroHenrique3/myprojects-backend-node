const express = require('express')
const cors = require('cors')

const router = express.Router()

// Configuração do CORS
router.use(cors())

//Controllers
const projectController = require('./controllers/projectController')
const taskController = require('./controllers/taskController')
const userController = require('./controllers/userController')
const sessionsController = require('./controllers/sessionsControllers')

//Midlewares
const projectMiddlewares = require('./middlewares/projectMiddlewares')
const taskMiddlewares = require('./middlewares/taskMiddlewares')
const userMiddlewares = require('./middlewares/userMiddlewares')
const auth = require('./middlewares/authenticationMiddlewares')

//Rotas
//--Públicas
router.post('/login', sessionsController.create)
router.post('/users', userMiddlewares.validateCreateUser, userController.createUser)

//--Privadas
router.use(auth.authenticate)

//Projects
router.get('/project/:id/:titleSearch', projectMiddlewares.checkUserId, projectController.getAll)
router.post('/project/:id', projectMiddlewares.checkUserId, projectMiddlewares.validateCreateProject, projectController.createProject)
router.delete('/project/:id', projectController.deleteProject)
router.put('/project/:id', projectMiddlewares.validateUpdateProject, projectController.updateProject)

//Tasks
router.get('/task/:id', taskController.getAll)
router.post('/task', taskMiddlewares.validateCreateTask, taskController.createTask)
router.delete('/task/:id', taskController.deleteTask)
router.put('/task/:id', taskMiddlewares.validateUpdateTask, taskController.updateTask)

//Users
router.get('/users', userController.getAll)
router.delete('/users/:id', userMiddlewares.checkUserId, userMiddlewares.validateDeleteUser,  userController.deleteUser)
router.put('/users/:id', userMiddlewares.checkUserId, userMiddlewares.validateUpdateUser,  userController.updateUser)

module.exports = router