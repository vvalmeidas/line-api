var registeredUsers = new Map()
const User = require('./user')
const Queue = require('./queue')

var currentLine = new Queue()

const utils = require('./utils')

/**
 * Obtém o ID de um usuário por meio do seu emaiil
 * @param {*} email email do usuário
 * @throws Descrição do erro, informando que não existe cadastro associado ao email informado
 */
const getIdByEmail = (email) => {
    utils.validateEmail(email)

    for(const [id, user] of registeredUsers.entries()) {
        if(user.email === email) {
            return id
        }
    }

    throw 'Não existe cadastro associado ao e-mail informado'
}

/**
 * Realiza o cadastro de um usuário
 * @param {*} req requisição contendo os dados do novo usuário
 * @param {*} res resposta
 */
const createUser = (req, res) => {
    const { name, email, gender } = req.body

    try {
        utils.verifyRegisterFields(name, email, gender)
        utils.validateEmail(email)
        const id = registeredUsers.size;
        const user = new User(id, name, email, utils.getFullGenderName(gender))
        registeredUsers.set(id, user)
        res.send(user)    
    } catch(e) {
        res.send({ error: e })
    }
}

/**
 * Adiciona um usuário à fila
 * @param {*} req requisição contendo o id do usuário
 * @param {*} res resposta
 */
const addToLine = (req, res) => {
    var { id } = req.body

    if(id) {
        id = parseInt(id)
        if(!registeredUsers.has(id)) {
            res.send({ error: 'Não existe usuário associado ao ID informado' })
        } else if(currentLine.getPosition(id) != -1) {
            res.send({ error: 'O usuário já foi inserido na fila anteriormente' })
        } else {
            currentLine.push(id)
            var position = currentLine.size()
            res.send({ position })    
        }    
    } else {
        res.send({ error: 'ID não informado' })
    }
}

/**
 * Encontra posição de um usuário com base no e-mail
 * @param {*} req requisição contendo o e-mail do usuário
 * @param {*} res resposta
 */
const findPosition = (req, res) => {
    const { email } = req.params
    
    try {
        var id = getIdByEmail(email)
        currentLine.peek()
        res.send({ position: currentLine.getPosition(id) })  
    } catch(e) {
        res.send({ error: e })
    }
}


/**
 * Realiza a listagem de todos os usuários da fila com as suas posições
 * @param {*} req requisição
 * @param {*} res resposta
 */
const showLine = (req, res) => {
    var position = 0
    var lineWithPositions = currentLine.get().map((id) => {
        var { name, email, gender } = registeredUsers.get(id)
        position++
        return { position, name, email, gender }
    })
    res.send(lineWithPositions)
}

/**
 * Retorna uma lista contendo todos usuários de um determinado gênero
 * @param {*} req requisição contendo a sigla do gênero (F, M, NB ou O)
 * @param {*} res resposta
 */
const filterLine = (req, res) => {
    var filteredUsers = []
    var requestedGender = req.params.gender

    try {
        requestedGender = utils.getFullGenderName(requestedGender)
        currentLine.peek() //lança uma exceção caso a fila esteja vazia
        currentLine.get().forEach((id, index) => {
            var { name, email, gender } = registeredUsers.get(id)
            if(gender === requestedGender) {
                filteredUsers.push({ position: index + 1, name, email, gender })
            }
        })
        res.send(filteredUsers)
    } catch(e) {
        res.send({ error: e })
    }
}

/**
 * Remove a primeira pessoa da fila, retornando suas informações
 * @param {*} req requisição
 * @param {*} res resposta
 */
const popLine = (req, res) => {
    try {
        var id = currentLine.pop()
        res.send(registeredUsers.get(id))    
    } catch(e) {
        res.send({ error: e })
    }
}

module.exports = { createUser, addToLine, findPosition, showLine, filterLine, popLine }