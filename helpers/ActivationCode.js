function activationCode () {
    let digit1 = (new Date ().getHours ()).toString()
    let digit2 = (new Date ().getMinutes ()).toString()
    let digit3 = (new Date ().getSeconds ()).toString()
    let digit4 = (Math.floor (Math.random ()*100)).toString()
    // let letters = "abcdefghijklmnopqrstuvwxyz"

    let code = digit1 + digit2 + digit3 +  digit4

    return code
}


module.exports = activationCode
// console.log (code)