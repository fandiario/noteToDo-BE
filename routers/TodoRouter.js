const express = require ('express')
const Router = express.Router()

// Import Controller
const TodoController = require ("../controllers/TodoController")

// Import Middleware
const jwtVerify = require ("../middleware/jwtVerify")

Router.post ("/create-task", jwtVerify, TodoController.createTask)
Router.post ("/get-data-task",jwtVerify, TodoController.getDataTask)


module.exports = Router