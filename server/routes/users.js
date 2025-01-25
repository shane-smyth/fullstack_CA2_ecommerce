const router = require('express').Router()

let users =
    [
        {
            userId: "U001",
            name: "guest user",
            email: "guest@gmail.com",
            password: "password",
            accessLevel: "guest"
        },
        {
            userId: "U002",
            name: "logged in user",
            email: "loggedIn@gmail.com",
            password: "password",
            accessLevel: "user"
        },
        {
            userId: "U003",
            name: "admin",
            email: "admin@gmail.com",
            password: "password",
            accessLevel: "admin"
        }
    ]

// read all items from products JSON
router.get(`/users`, (req, res) => {
    // console.log(req)
    res.json(users)
})

module.exports = router