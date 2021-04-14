const express = require ("express")

// Cors = to let our API accessed by FrontEnd or another party 
const cors = require ("cors")

// Import Router
const authenticRouter = require ("./routers/AuthenticRouter")

// Init Cors
const app = express()
app.use (cors())

// Init Body Parser
app.use (express.json())

// Init PORT
const PORT = 4000

// Route
    // Home
app.get ("/", (req, res) => {
    res.status (200).send (`
        <h1>Hello World from Authentic System API</h1>
    `)
})

    // Router
app.use("/authentic-system", authenticRouter)




app.listen (PORT, () => console.log (`App is listening on port : ${PORT}`))