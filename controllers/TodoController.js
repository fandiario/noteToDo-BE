// import connection
const db = require ("../connection/Connection")

const createTask = (req, res) => {
    try {
        const data = req.body
        const dataToken = req.dataToken

        if (!data.title || !data.description || !data.date) throw {message: "Empty data field detected."}

        let dataToInsert = {
            title: data.title,
            description: data.description,
            date: data.date,
            users_id: dataToken.id
        }

        let queryInsert = `INSERT INTO tasks SET ?`
        db.query (queryInsert, dataToInsert, (err, result) => {
            try {
                if (err) throw err

                res.status (200).send ({
                    error: false,
                    message: "Successfully adding new task."
                })
                
            } catch (error) {
                res.status (500).send ({
                    error: true,
                    message: error.message
                })
            }
        })
        
    } catch (error) {
        res.status (500).send ({
            error: true,
            message: error.message
        })
    }
}

const getDataTask = (req, res) => {
    let idUser = req.dataToken.id
    // console.log (req.dataToken.id)

    let queryGet = `SELECT * FROM tasks WHERE users_id = ${idUser}`
    db.query (queryGet, (err, result) => {
        try {
            if (err) throw err

            let arrTask = []
            let resultTask = []

            result.forEach((element) => {
                let dateIndex = null
                let dateTask = (element.date).toString().split(" ")[2] + " " + (element.date).toString().split(" ")[1] + (" ") + (element.date).toString().split(" ")[3]
                let timeTask = (element.date).toString().split(" ")[4]
                // console.log ((element.date).toString().split(" ")[4])

                arrTask.forEach ((el, i) => {
                    if (el.date === dateTask){
                        dateIndex = i
                    } 
                })

                if (dateIndex === null) {
                    arrTask.push ({
                        date: dateTask,
                        taskLists: [{
                            id: element.id,
                            title: element.title,
                            date: element.date,
                            time: timeTask,
                            description: element.description,
                            status: element.status
                        }]
                    })

                } else {
                    arrTask[dateIndex].taskLists.push ({
                        id: element.id,
                        title: element.title,
                        date: element.date,
                        time: timeTask,
                        description: element.description,
                        status: element.status
                    })
                }
            })

            if (arrTask !== null) {
                resultTask = arrTask.sort(function(a,b) {
                    return new Date(b.date) - new Date(a.date)
                })
            }

            // console.log (resultTask[0])

            res.status (200).send ({
                error: false,
                message: "Get Data is success",
                data: resultTask
            })
            
        } catch (error) {
            res.status (500).send ({
                error: true,
                message: error.message
            })
        }
    })
}

const updateTaskDone = (req, res) => {
    const idTask = req.body.id
    // console.log (idTask)

    let queryUpdateDone = `UPDATE tasks SET status = 1 WHERE id = ${idTask}`
    db.query(queryUpdateDone, (err, result) => {
        try {
            if (err) throw err

            res.status (200).send ({
                error: false,
                message: "Your task status has been updated into Done"
            })
            
        } catch (error) {
            res.status (500).send ({
                error: true,
                message: error.message
            })
        }
    })
}

const deleteTask = (req, res) => {
    const idTask = req.body.id
    // console.log (req.body)

    let queryDelete = `DELETE FROM tasks WHERE id = ${idTask}`
    db.query (queryDelete, (err, result) => {
        try {
            if (err) throw err

            res.status (200).send ({
                error: false,
                message: "Your task has been deleted"
            })
            
        } catch (error) {
            res.status (500).send ({
                error: true,
                message: error.message
            })
        }
    })

}

const getDataPerTask = (req, res) => {
    let data = req.body
    let idTask = data.id

    let queryGet = `SELECT * FROM tasks WHERE id = ${idTask}`
    db.query(queryGet, (err, result) => {

        try {
            if (err) throw err

            if (result[0]){
                res.status (200).send ({
                    error: false,
                    message: "Get Data is success",
                    data: result[0]
                })

            } else {
                res.status (200).send ({
                    error: true,
                    message: "Data is not found or invalid id Task",
                })
            }
            
        } catch (error) {
            res.status (500).send ({
                error: true,
                message: error.message
            })
        }
    })
}

const updateTask = (req, res) => {
    let data = req.body
    console.log (data)

    let idTask = data.id
    let titleTask = data.title
    let descTask = data.description
    let dateTask = data.date

    try {
        if (!titleTask || !descTask || !dateTask) throw ({message: "Empty data field detected"})

        let queryUpdate = `UPDATE tasks SET title = '${titleTask}', description = '${descTask}', date = '${dateTask}' WHERE id = ${idTask}`
        db.query (queryUpdate, (err, result) => {
            try {
                if (err) throw err
                
                res.status (200).send ({
                    error: false,
                    message: "Your task has been updated"
                })

            } catch (error) {
                res.status (500).send ({
                    error: true,
                    message: error.message
                })
            }
        })

        
    } catch (error) {
        res.status (400).send ({
            error: true,
            message: error.message
        })
    }
}

module.exports = {
    createTask: createTask,
    getDataTask: getDataTask,
    updateTaskDone: updateTaskDone,
    deleteTask: deleteTask,
    getDataPerTask: getDataPerTask,
    updateTask: updateTask
}