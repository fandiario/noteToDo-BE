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
                message: "Get Data successfully",
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

const updateTaskDone = () => {

}

module.exports = {
    createTask: createTask,
    getDataTask: getDataTask,
    updateTaskDone: updateTaskDone
}