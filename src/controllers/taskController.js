const taskModel = require("../models/taskModel")

const getAll = async (req, res) => {
   try {
    const {id} = req.params
    const tasks = await taskModel.getAll(id)
    return res.status(200).json(tasks)
   } catch (error) {
     return res.status(500).json({msg: "Internal error"})
   }
}

const createTask = async (req, res) => {
    try {
        const {insertId} = await taskModel.createTask(req.body)
        //Buscando a task que acabou de ser inserida
        const newTask = await taskModel.getTaskById(insertId)
        return res.status(201).json({msg: "Task created!", task: newTask})
    } catch (error) {
        return res.status(500).json({msg: "Internal error"})
    }
}

const deleteTask = async (req, res) => {
    try {
        const {id} = req.params
        await taskModel.deleteTask(id)
        return res.status(200).json({msg: "Task has been deleted successfully!"})
    } catch (error) {
        return res.status(500).json({msg: "Internal error"})
    }
}

const updateTask = async (req, res) => {
    try {
        const {id} = req.params
        await taskModel.updateTask(id, req.body)
        return res.status(200).json({msg: "Task has been updated successfully!"})
    } catch (error) {
        return res.status(500).json({msg: "Internal error"})
    }
}

module.exports =  {
    getAll,
    createTask,
    deleteTask,
    updateTask
}