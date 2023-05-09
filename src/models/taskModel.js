/*const connection = require('../config/connection')*/
const db = require('../config/connection')

const getAll = async (projectId) => {
    const connection = await db.connect();
    //Fazendo um destructuring do array na primeira posição
    const [tasks] = await connection.execute('SELECT * FROM tasks WHERE id_project = ?', [projectId])
    return tasks
}

const getTaskById = async (task) => {
    const connection = await db.connect();
    try {
        //Fazendo um destructuring do array na primeira posição
        const [tasks] = await connection.execute('SELECT * FROM tasks WHERE id = ?', [task])
        return tasks
    } catch (error) {
        return res.status(500).json({ msg: "Internal error" })
    }
}

const createTask = async (project) => {
    const connection = await db.connect();
    const { title, projectId } = project

    const query = 'INSERT INTO tasks (title, status, id_project) VALUES (?, ?, ?)'
    const [createdTask] = await connection.execute(query, [title, 'Pendente', projectId])
    return createdTask
}

const deleteTask = async (id) => {
    const connection = await db.connect();
    const [removedTask] = await connection.execute('DELETE FROM tasks WHERE id = ?', [id])
    return removedTask
}

const updateTask = async (id, task) => {
    const connection = await db.connect();
    const { title, status } = task

    query = "UPDATE tasks SET title = ?, status = ? WHERE id = ?"

    const [updatedTask] = await connection.execute(query, [title, status, id])
    return updatedTask
}

//Como vai ser várias funções exportamos como objeto
module.exports = {
    getAll,
    getTaskById,
    createTask,
    deleteTask,
    updateTask
}