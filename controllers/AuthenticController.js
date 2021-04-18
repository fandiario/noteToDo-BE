// Validator to validate email
const validator = require ('validator')

// Read data from HTML
const fs = require ("fs")
const handlebars = require ("handlebars")

// Import Hash Password
const hashPassword = require ("./../helpers/Hash")

// Import New Password
const newPassword = require ("./../helpers/NewPassword")

// Import Connection
const db = require ("../connection/Connection")

// Import Transporter
const transporter = require ("../helpers/Transporter")

// Import Code Activator
const activatorCode = require ("../helpers/ActivationCode")

// JWT Token
const jwt = require ("jsonwebtoken")


// Register
const register = (req, res) => {
    try {
        // 1. Get Input from FrontEnd
        const data = req.body
        console.log (data)

        // 2. Data validation
        if (!data.email || !data.password) throw ({ message: "Empty data field detected" })

        if (!(validator.isEmail(data.email))) throw ({message: "Invalid email format"})

        if (data.password.length < 6) throw ({message: "Password's min. length is 6 characters"})

        // 3. Hash Data
        try {
            const passwordHashed = hashPassword(data.password)
            data.password = passwordHashed
            data.activation_code = activatorCode ()

            // 4. Store Data to DB
            // Check Email exist ?
            let queryCheck = `SELECT * FROM users WHERE email = ?`
            db.query(queryCheck, data.email, (err, result) => {
                try {
                    if (err) throw err

                    if (result.length === 0){

                        // Insert Data
                        let queryInsert = `INSERT INTO users SET ?`
                        db.query (queryInsert, data, (err, result) => {
                            try {

                                if (err) throw err

                                // res.status(200).send({
                                //     error: false,
                                //     message: "Data successfully registered."
                                // })
                                
                                // 5. Send Email confirmation
                                fs.readFile ("D:/Data/Purwadhika/JCWM1602/Modul-03/02.W-02/01.Day-01/Project-NoteToDo/Authentic_System/template/emailConfirmation.html", {encoding: 'utf-8'}, (err, file) => {
                                    if (err) throw err

                                    const template = handlebars.compile (file)
                                    const templateRes = template({email: data.email, link: `http://localhost:3000/confirmation/link/${result.insertId}/${passwordHashed}`, code: data.activation_code, linkActivationCode: `http://localhost:3000/confirmation/code/${result.insertId}/${passwordHashed}`})
                                    
                                    
                                    transporter.sendMail ({
                                        from: "fandi.ario10@gmail.com",
                                        to:"fandi.ario10@gmail.com",
                                        // to: data.email,
                                        subject: "Email Confirmation",
                                        html: templateRes
                                    })
                                
                                    .then ((response) => {
                                        res.status(200).send({
                                            error: false,
                                            message: "User registration is success. Please check your email in 1 x 24 hours"
                                        }) 
                                    })
                                
                                    .catch ((err) => {
                                        // console.log ("Test")
                                        res.status(500).send({
                                            error: true,
                                            message: err.message
                                        })
                                    })
                                })
                                


                            } catch (error) {
                                res.status(500).send({
                                    error: true,
                                    message: error.message
                                })
                            }
                        })
                    } else {
                        res.status(200).send({
                            error: true,
                            message: "Email already exist"
                        }) 
                    }

                } catch (error) {
                    res.status(500).send({
                        error: true,
                        message: error.message
                    }) 
                }
            })

        // 5. Send Email confirmation
        } catch (error) {
            res.status(500).send ({
                error: true,
                message: "Internal Server Error"
            })
        }
        
    } catch (error) {
        res.status(406).send ({
            error: true,
            message: error.message
        })   
    }
}

// Test Send Email
const testEmail =(req, res) => {
    transporter.sendMail ({
        from: "fandi.ario10@gmail.com",
        to:"fandi.ario10@gmail.com",
        subject: "Email Confirmation Test",
        html: "<h1>Hello World from Email Confirm</h1>"
    })

    .then ((res) => {
        console.log (res)
    })

    .catch ((err) => {
        console.log (err)
    })
}

// Test Login
const login = (req, res) => {
    try {
        // 1. Get Data
        const data = req.body

        // 2. Validate Data
        if (!data.email || !data.password) throw { message: "Empty data field detected"}

        // 3. Hash Password 
        const passwordHashed = hashPassword (data.password)

        // 4. Locate Email and Hashed Password
        let queryCheck= 'SELECT * FROM users WHERE email = ? AND password = ? AND is_email_confirmed = 1'
        db.query (queryCheck, [data.email, passwordHashed], (err, result) => {
            try {
                if (err) throw err

                if (result.length === 1) {
                    // res.status (200).send ({
                    //     error: false,
                    //     message: "Login is Success"
                    // })

                    jwt.sign ({id: result[0].id, activation_code: result[0].activation_code, created_at: result[0].created_at}, "123abc", (err, token) => {
                        try {
                            res.status (200).send ({
                                error: false,
                                message: "Login is Success",
                                data: {
                                    token: token
                                }
                            })
                                    
                        } catch (error) {
                            res.status(500).send ({
                                error: true,
                                message: "Error Token Generator"
                            })
                        }
                    })
                
                } else {
                    res.status (200).send ({
                        error: true,
                        message: "Wrong email or password."
                    })
                }


            } catch (error) {
                res.status (500).send ({
                    error: true,
                    message: error.message
                })
            }
        })

        
    } catch (error) {
        res.status (406).send ({
            error: true,
            message: error.message
        })
    }
}

// Email Confirmation
const emailConfirmation = (req, res) => {
    const data = req.body
    // const idInput = data.id
    // const passInput = `'${data.password}'`
    const idInput = data.dataToSend.id
    const passInput = `'${data.dataToSend.password}'`
    console.log (idInput)
    console.log (passInput)

    let queryCheck = `SELECT * FROM users WHERE id = ${idInput} AND password = ${passInput}`
    db.query (queryCheck, (err, result) => {
        try {
            if (err) throw err
            // console.log (res)
            if (result[0].is_email_confirmed === 0) {
                let queryConfirm = `UPDATE users SET is_email_confirmed = 1 WHERE id = ${idInput} AND password = ${passInput}`
                
                db.query(queryConfirm, (err, result) => {
                    try {
                        if (err) throw err
                        
                        res.status(200).send ({
                            error: false,
                            message: "Congratulation. Your Account is now active."
                        })
                        
                    } catch (error) {
                        res.status (500).send({
                            error: true,
                            message: error.message
                        })
                    }
                })

            } else {
                res.status (200).send ({
                    error: true,
                    message: "Your Account is already active."
                })
            }
            
        } catch (error) {
            res.status(500).send ({
                error: true,
                message: error.message
            })
        }
    })
}

// Email Confirmation Code
const emailConfirmationCode = (req, res) => {
    const data = req.body

    const idInput = data.dataToSend.id
    const passInput = `'${data.dataToSend.password}'`
    const codeInput = data.dataToSend.confirmationCode

    let queryCheck = `SELECT * FROM users WHERE id = ${idInput} AND password = ${passInput} AND activation_code = ${codeInput}`
    db.query (queryCheck, (err, result) => {
        try {
            if (err) throw err

            if (result[0].is_email_confirmed === 0){
                let queryConfirm = `UPDATE users SET is_email_confirmed = 1 WHERE id = ${idInput} AND password = ${passInput}`

                db.query (queryConfirm, (err, result) => {
                    try {
                        if (err) throw err

                        res.status (200).send ({
                            error: false,
                            message: "Congratulation. Your Account is now active."
                        })
                        
                    } catch (error) {
                        res.status (500).send ({
                            error: true,
                            message: error.message
                        })
                    }
                })



            } else {
                res.status (200).send ({
                    error: true,
                    message: "Your Account is already active."
                })
            }

            
        } catch (error) {
            res.status(500).send ({
                error: true,
                message: error.message
            })
        }
    })

}



// Forgot Password
const forgotPassword = (req, res) => {
    try {
        const data = req.body
        const inputEmail = data.inputEmail
        console.log (inputEmail)

        data.password = newPassword ()
        let newPass = data.password
        
        let newPassHashed = hashPassword(data.password)
        data.password = newPassHashed
        // console.log (inputEmail)

        let queryCheck = `SELECT * FROM users WHERE email = '${inputEmail}'`
        db.query (queryCheck, (err, result) => {
            console.log ("check1")
            try {
                if (err) throw err

                if (result.length === 1){
                    // Patch password
                    let queryPatch = `UPDATE users SET password = '${data.password}' WHERE email = '${inputEmail}'`
                    db.query (queryPatch, (err, result) => {
                        console.log ("check2")
                        try {
                            if (err) throw err
                            
                            fs.readFile ("D:/Data/Purwadhika/JCWM1602/Modul-03/02.W-02/01.Day-01/Project-NoteToDo/Authentic_System/template/forgotPassword.html", {encoding: "utf-8"}, (err, file) => {
                                if (err) throw err

                                const template = handlebars.compile (file)
                                const templateRes = template ({email: data.inputEmail, newPassword: newPass})

                                transporter.sendMail ({
                                    from: "fandi.ario10@gmail.com",
                                    to:"fandi.ario10@gmail.com",
                                    // to: data.email,
                                    subject: "New Password Request",
                                    html: templateRes
                                })

                                .then ((response) => {
                                    res.status (200).send ({
                                        error: false,
                                        message: "New Password has been sent to your email."
                                    })
                                })

                                .catch ((err) => {
                                    res.status (500).send ({
                                        error: true,
                                        message: err.message
                                    })
                                })
                            })


                        } catch (error) {
                            res.status(500).send({
                                error: true,
                                message: error.message
                            })
                        }
                    })
                } else {
                    res.status(200).send({
                        error: true,
                        message: "Invalid Email"
                    })
                }


            } catch (error) {
                res.status(500).send({
                    error: true,
                    message: error.message
                }) 
            }
        })


    } catch (error) {
        res.status(406).send ({
            error: true,
            message: error.message
        })   
    }
}

// Get Data User From Token
const getUserData = (req, res) => {
    let data = req.dataToken
    // console.log (data.token)
    // console.log (data.id)

    let queryGetData = `SELECT * FROM users WHERE id = ${data.id}`
    db.query (queryGetData, (err, result) => {
        try {
            if (err) throw err

            res.status(200).send ({
                error: false,
                // message: 'check'
                dataUser: result[0] 
            })

        } catch (error) {
            res.status(500).send({
                error: true,
                message: error.message
            }) 
        }
    })
}

module.exports = {
    register: register,
    testEmail: testEmail,
    login: login,
    emailConfirmation: emailConfirmation,
    emailConfirmationCode: emailConfirmationCode,
    forgotPassword: forgotPassword,
    getUserData: getUserData
}