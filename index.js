const express = require('express')
const server = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000


server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

server.listen(port, () => {
    console.log(`API line is running on port ${port}`)
})

require('./routes')(server)