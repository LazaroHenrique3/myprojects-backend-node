const projectModel = require("../models/projectModel")

const getAll = async (req, res) => {
   try {
    const {id, titleSearch} = req.params
    let [, titleSearchFormated] = titleSearch.split('=')
    titleSearchFormated = (titleSearchFormated === '') ? `%` : `%${titleSearchFormated}%` 
    const projects = await projectModel.getAll(id, titleSearchFormated)
    return res.status(200).json(projects)
   } catch (error) {
     return res.status(500).json({msg: "Internal error"})
   }
}

const getProjectById = async (id) => {
    try {
        const project = await projectModel.getProjectById(id)
        return project
    } catch (error) {
        console.log(error)
    }
}

const createProject = async (req, res) => {
    try {
        const {insertId} = await projectModel.createProject(req.body)
        //Buscando o project que acabou d eser inserida
        const newProject = await projectModel.getProjectById(insertId)
        return res.status(201).json({msg: "Project created!", project: newProject})
    } catch (error) {
        return res.status(500).json({msg: "Internal error"})
    }
}

const deleteProject = async (req, res) => {
    try {
        const {id} = req.params
        await projectModel.deleteProject(id)
        return res.status(200).json({msg: "Project has been deleted successfully!"})
    } catch (error) {
        return res.status(500).json({msg: "Internal error"})
    }
}

const updateProject = async (req, res) => {
    try {
        const {id} = req.params
        await projectModel.updateProject(id, req.body)
        return res.status(200).json({msg: "Project has been updated successfully!"})
    } catch (error) {
        return res.status(500).json({msg: "Internal error"})
    }
}

module.exports =  {
    getAll,
    getProjectById,
    createProject,
    deleteProject,
    updateProject
}