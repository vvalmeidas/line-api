const express = require('express')
const line = require('./line')

/**
 * Método para definição das rotas da API
 * @param {*} server servidor
 */
module.exports = (server) => {
    const api = express.Router()
    api.post('/createUser', line.createUser)
    api.post('/addToLine', line.addToLine)
    api.get('/findPosition/:email', line.findPosition)
    api.get('/showLine', line.showLine)
    api.get('/filterLine/:gender', line.filterLine)
    api.post('/popLine', line.popLine)
    server.use(api)
}
