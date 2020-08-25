const express = require('express')
const Line = require('./line')

module.exports = (server) => {
    const api = express.Router()

    api.post('/createUser', Line.createUser)
    api.post('/addToLine', Line.addToLine)
    api.post('/findPosition', Line.findPosition)
    api.post('/filterLine', Line.filterLine)
    api.post('/showLine', Line.showLine)
    api.post('/popLine', Line.popLine)
    server.use(api)
}
