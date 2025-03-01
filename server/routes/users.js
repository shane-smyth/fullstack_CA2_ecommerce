const router = require('express').Router()
let createError = require('http-errors')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const fs = require('fs')
const JWT_PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILENAME, 'utf8')

const usersModel = require('../models/users')

// // read all records
// router.get(`/users`, (req, res) => {
//     usersModel.find((error, data) => {
//         res.json(data)
//     })
// })
//
//
// // read one record
// router.get(`/users/:id`, (req, res) => {
//     usersModel.findById(req.params.id, (error,data) => {
//         res.json(data)
//     })
// })
//
//
// // register
// router.post(`/users/register`, (req, res) => {
//     const { username, email, password } = req.body
//     if (!username || !email || !password) {
//         return res.json({ error: 'Username, password and email is required' })
//     }
//
//     // If a user with this email does not already exist, then create new user
//     usersModel.findOne({email: email}, (uniqueError, uniqueData) => {
//         if (uniqueData) {
//             res.json({errorMessage: `User already exists`})
//         }
//         else {
//             bcrypt.hash(password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) => {
//                 if (err) {
//                     return res.json({ errorMessage: "Error hashing password" })
//                 }
//
//                 // Save user with hashed password
//                 usersModel.create({ username, email, password: hash }, (error, data) => {
//                     if (data) {
//                         const token = jwt.sign({email: data.email, accessLevel:data.accessLevel}, JWT_PRIVATE_KEY, {algorithm: "HS256", expiresIn:process.env.JWT_EXPIRY})
//                         res.json({ username: data.username, accessLevel:data.accessLevel, token:token})
//                     } else {
//                         res.json({ errorMessage: "User was not registered" })
//                     }
//                 })
//             })
//         }
//     })
// })
//
//
// // login
// router.post(`/users/login`, (req, res) => {
//     const { email, password } = req.body
//     if (!email || !password) {
//         return res.json({ error: "email and password required" })
//     }
//
//     usersModel.findOne({email: email}, (uniqueError, uniqueData) => {
//         if (uniqueData) {
//             bcrypt.compare(password, uniqueData.password, (err, isMatch) => {
//                 if (isMatch) {
//                     const token = jwt.sign({email: uniqueData.email, accessLevel:uniqueData.accessLevel}, JWT_PRIVATE_KEY, {algorithm: 'HS256', expiresIn:process.env.JWT_EXPIRY})
//                     res.json({ name: uniqueData.username, accessLevel: uniqueData.accessLevel, token:token})
//                 }
//                 else {
//                     res.status(400).json({ errorMessage: "Invalid email or password" })
//                 }
//             })
//         }
//         else {
//             console.log("not found in db")
//             res.json({errorMessage:`User is not logged in`})
//         }
//     })
// })
//
//
// // logout
// router.post(`/users/logout`, (req,res) => {
//     res.json({})
// })
//
//
// // delete user
// router.delete(`/users/delete/:id`, (req, res) => {
//     const userId = req.params.id
//     usersModel.findByIdAndDelete(userId, (error, data) => {
//         if (error || !data) {
//             res.json({errorMessage: "User not found"})
//         }
//         res.json({data})
//     })
// })

const getAllUsers = (req, res, next) => {
    usersModel.find((err, data) => {
        if (err) {
            return next(err)
        }
        res.json(data)
    })
}

const getOneUser = (req, res, next) => {
    usersModel.findById(req.params.id, (err, data) => {
        if (err) {
            return next(err)
        }
        res.json(data)
    })
}

const checkThatUserExistsInUsersCollection = (req, res, next) => {
    usersModel.findOne({ email: req.body.email }, (err, data) => {
        if (err) {
            return next(err)
        }
        if (!data) {
            return res.status(401).json({ errorMessage: "User not found" })
        }
        req.data = data
        return next()
    })
}

const checkThatJWTPasswordIsValid = (req, res, next) => {
    bcrypt.compare(req.body.password, req.data.password, (err, result) => {
        if (err) {
            return next(err)
        }
        if (!result) {
            return res.status(401).json({ errorMessage: "Invalid password" })
        }
        return next()
    })
}

const checkThatUserIsNotAlreadyExists = (req, res, next) => {
    usersModel.findOne({ email: req.body.email }, (err, data) => {
        if (err) {
            return next(err)
        }
        if (data) {
            return next(createError(409, "User already exists"))
        }
        return next()
    })
}

const addNewUserToUserCollection = (req, res, next) => {
    const { username, email, password } = req.body

    bcrypt.hash(password, parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS), (err, hash) => {
        if (err) {
            return next(err)
        }

        usersModel.create({ username, email, password: hash }, (error, data) => {
            if (error) {
                return next(error)
            }
            return res.json(data)
        })
    })
}

const returnUsersDetailsAsJson = (req, res, next) => {
    const {username, email, password} = req.data
    const token = jwt.sign({email: email, accessLevel: req.data.accessLevel}, JWT_PRIVATE_KEY, {algorithm: 'HS256', expiresIn:process.env.JWT_EXPIRY})
    return res.json({ name: username, accessLevel: req.data.accessLevel, token:token})
}

const deleteUser = (req, res, next) => {
    const userId = req.params.id
    usersModel.findByIdAndDelete(userId, (error, data) => {
        if (error) {
            return next(error)
        }
        if (!data) {
            return res.status(404).json({ errorMessage: "User not found" })
        }
        return res.json({ message: "User deleted successfully", data })
    })
}

const logout = (req, res, next) => {
    return res.json({})
}

// get all records
router.get(`/users`, getAllUsers)

// get one record
router.get(`/users/:id`, getOneUser)

// register new user
router.post(`/users/register`, checkThatUserIsNotAlreadyExists, addNewUserToUserCollection)

// login
router.post(`/users/login`, checkThatUserExistsInUsersCollection, checkThatJWTPasswordIsValid, returnUsersDetailsAsJson)

// delete user
router.delete(`/users/delete/:id`, deleteUser)

// logout
router.post(`/users/logout`, logout)


module.exports = router