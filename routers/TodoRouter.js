const express = require ('express')
const Router = express.Router()

// Import Controller
const TodoController = require ("../controllers/TodoController")

// Import Middleware
const jwtVerify = require ("../middleware/jwtVerify")

Router.post ("/create-task", jwtVerify, TodoController.createTask)
Router.post ("/get-data-task",jwtVerify, TodoController.getDataTask)

Router.patch ("/update-task-done", TodoController.updateTaskDone)
Router.post ("/delete-task", TodoController.deleteTask)

Router.post ("/get-data-per-task", TodoController.getDataPerTask)
Router.patch ("/update-task", TodoController.updateTask)


module.exports = Router