var registeredUsers = new Map()
const User = require('./user')
const Queue = require('./queue')

var currentLine = new Queue()

const utils = require('./utils')

/**
 * Realiza o cadastro de um usuário
 * @param {*} req requisição contendo os dados do novo usuário
 * @param {*} res resposta
 */
const createUser = (req, res) => {
    const { name, email, gender } = req.body

    try {
        utils.validateRegisterFields(name, email, gender)
        utils.validateEmail(email)
        utils.validateGender(gender)
        const id = registeredUsers.size;
        const user = new User(id, name, email, utils.obtainFullGenderName(gender))
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
    const { email } = req.body

    try {
        if(currentLine.isEmpty()) {
            res.send({ error: 'A fila está vazia' })
        } else {
            utils.validateEmail(email)
            var id = getIdByEmail(email)
            res.send({ position: currentLine.getPosition(id) })  
        }
    } catch(e) {
        res.send({ error: e })
    }
}

/**
 * Obtém o ID de um usuário por meio do seu emaiil
 * @param {*} email email do usuário
 * @throws Descrição do erro, informando que não existe cadastro associado ao email informado
 */
const getIdByEmail = (email) => {
    var foundId = null

    registeredUsers.forEach((user, id) => {
        console.log(user.email)
        console.log(email)
        console.log(email === user.email)
        if(email === user.email) {
            foundId = id
        }
    })

    //XXXXXXXXXXXXXXXXXXXX VERIFICAR MELHOR, FAZER MAIS TESTES

    if(foundId) return foundId
    throw 'Não existe cadastro associado ao e-mail informado'
}

/**
 * Realiza a listagem de todos os usuários da fila com as suas posições
 * @param {*} req requisição
 * @param {*} res resposta
 */
const showLine = (req, res) => {
    var position = 0

    var lineWithPositions = currentLine.get().map((id) => {
        var user = registeredUsers.get(id)
        console.log({ id, ...user })
        position++
        return { position, id, ...user }
    })
    res.send(lineWithPositions) //VERIFICAR RETORNO COM ARRAY?????
}

const filterLine = (req, res) => {

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