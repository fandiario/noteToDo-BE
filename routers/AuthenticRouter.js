const express = require ("express")
const Router = express.Router()

// Import Controller
const authenticController = require ("./../controllers/AuthenticController")

Router.post ("/register", authenticController.register)
Router.get ("/send-email", authenticController.testEmail)
Router.post ("/login", authenticController.login)
Router.patch ("/confirmation", authenticController.emailConfirmation)
Router.patch ("/forgot-password", authenticController.forgotPassword)
Router.post ("/get-data-user", authenticController.getUserData)

module.exports = Router