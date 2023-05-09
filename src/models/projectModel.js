/*const connection = require('../config/connection')*/
const db = require('../config/connection')

const getAll = async (user, titleSearch) => {
    const connection = await db.connect();
    const query =
    `SELECT p.id, p.title, p.status, p.created_at, t.id AS task_id, t.title AS task_title, t.status AS task_status
    FROM projects AS p
    LEFT JOIN tasks t ON p.id = t.id_project
    WHERE p.id_user = ? AND p.title LIKE ?;`

    //Fazendo um destructuring do array na primeira posição
    const [projects] = await connection.execute(query, [user, titleSearch])

    //Objeto que vai armazenar ros objetos da forma adequada
    let objectProjects = {}

    projects.forEach((project) => {
        //Verifico se o projeto foi adicionado ao objeto 
        if (!objectProjects[project.id]) {
            objectProjects[project.id] = {
                id: project.id,
                title: project.title,
                status: project.status,
                created_at: project.created_at,
                tasks: []
            }
        }

        //Verificando se existe tarefas neste projeto
        if (project.task_id !== null) {
            // Adiciona a tarefa ao array de tarefas do projeto correspondente
            objectProjects[project.id].tasks.push({
                id: project.task_id,
                title: project.task_title,
                status: project.task_status
            })
        }
    })
    const projectsArray = Object.values(objectProjects)

    //Ordenando o array
    projectsArray.sort((a, b) => {
        if (a.status === 'Em andamento' && b.status !== 'Em andamento') {
          return -1; // a vem antes de b
        } else if (a.status !== 'Em andamento' && b.status === 'Em andamento') {
          return 1; // a vem depois de b
        } else if (a.status === 'Pendente' && b.status !== 'Pendente') {
          return -1; // a vem antes de b
        } else if (a.status !== 'Pendente' && b.status === 'Pendente') {
          return 1; // a vem depois de b
        } else {
          return 0; // não há diferença na ordem
        }
      });
      
    return projectsArray
}

const getProjectById = async (project) => {
    const connection = await db.connect();
    try {
        //Fazendo um destructuring do array na primeira posição
        const [projects] = await connection.execute('SELECT * FROM projects WHERE id = ?', [project])
        return projects
    } catch (error) {
        return res.status(500).json({ msg: "Internal error" })
    }
}

const createProject = async (project) => {
    const connection = await db.connect();
    const { title, user } = project

    const dateUTC = new Date(Date.now()).toUTCString();

    const query = 'INSERT INTO projects (title, status, created_at, id_user) VALUES (?, ?, ?, ?)'
    const [createdProject] = await connection.execute(query, [title, 'Pendente', dateUTC, user])
    return createdProject
}

const deleteProject = async (id) => {
    const connection = await db.connect();
    const [removedProject] = await connection.execute('DELETE FROM projects WHERE id = ?', [id])
    return removedProject
}

const updateProject = async (id, project) => {
    const connection = await db.connect();
    const { title, status } = project

    query = "UPDATE projects SET title = ?, status = ? WHERE id = ?"

    const [updatedProject] = await connection.execute(query, [title, status, id])
    return updatedProject
}

//Como vai ser várias funções exportamos como objeto
module.exports = {
    getAll,
    getProjectById,
    createProject,
    deleteProject,
    updateProject
}