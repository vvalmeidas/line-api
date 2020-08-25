const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = require('chai')
const should = chai.should()

const SERVER = 'http://localhost:3000'

chai.use(chaiHttp)

const USER_VALID_MARIA = {'name': 'Maria', 'email': 'maria@email.com','gender': 'F'}
const USER_VALID_JOAO = {'name': 'Joao', 'email': 'joao@email.com','gender': 'M'}
const USER_VALID_ARI = {'name': 'Ari', 'email': 'ari@email.com', 'gender': 'NB'}

var registersCount = 0
var lineSize = 0

describe('Cadastro de usuário (createUser)', () => {
    it('Cadastro com sucesso', (done) => {
        chai.request(SERVER)
        .post('/createUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(USER_VALID_MARIA)
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('error')
            res.body.should.be.a('object').that.have.property('id')
            res.body.should.be.a('object').that.have.property('name').equal('Maria')
            res.body.should.be.a('object').that.have.property('email').equal('maria@email.com')
            res.body.should.be.a('object').that.have.property('gender').equal('Feminino')
            registersCount++;
            done()
        })
    })

    it('Cadastro com falha: falta o campo gênero', (done) => {
        chai.request(SERVER)
        .post('/createUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({'name': 'Maria', 'email': 'maria@email.com'})
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('id')
            res.body.should.be.a('object').that.not.have.property('name')
            res.body.should.be.a('object').that.not.have.property('email')
            res.body.should.be.a('object').that.not.have.property('gender')
            res.body.should.be.a('object').that.have.property('error').equal('Campo(s) ausente(s): gênero')
            done()
        })
    })

    it('Cadastro com falha: campo email com formato inválido', (done) => {
        chai.request(SERVER)
        .post('/createUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({'name': 'Maria', 'email': 'maria@email', 'gender': 'F'})
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('id')
            res.body.should.be.a('object').that.not.have.property('name')
            res.body.should.be.a('object').that.not.have.property('email')
            res.body.should.be.a('object').that.not.have.property('gender')
            res.body.should.be.a('object').that.have.property('error').equal('O campo e-mail possui formato inválido')
            done()
        })
    })

    it('Cadastro com falha: campo gênero possui formato inválido', (done) => {
        chai.request(SERVER)
        .post('/createUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({'name': 'Maria', 'email': 'maria@email.com', 'gender': 'g'})
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('id')
            res.body.should.be.a('object').that.not.have.property('name')
            res.body.should.be.a('object').that.not.have.property('email')
            res.body.should.be.a('object').that.not.have.property('gender')
            res.body.should.be.a('object').that.have.property('error').equal('O campo gênero possui formato inválido. Informe F (Feminino), M (Masculino), NB (Não-binário) ou O (Outros).')
            done()
        })
    })
})

const generateNewUser = (data) => {
    return new Promise((resolve, reject) => {
        chai.request(SERVER)
        .post('/createUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(data)
        .end((err, res) => {
            resolve(res.body.id)
        })
    })
}

describe('Adicionar usuário na fila (addToLine)', () => {
    var id;

    it('Adicionando na fila com sucesso', (done) => {
        var idValue
        generateNewUser(USER_VALID_JOAO)
        .then(value => {
            id = value
            chai.request(SERVER)
            .post('/addToLine')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({'id': id})
            .end((err, res) => {
                res.body.should.be.a('object').that.not.have.property('error')
                res.body.should.be.a('object').that.have.property('position')
                done()
            })
        })
    }) 

    it('Falha ao adicionar na fila: ID repetido', (done) => {
        chai.request(SERVER)
        .post('/addToLine')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({'id': id})
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('position')
            res.body.should.be.a('object').that.have.property('error').equal('O usuário já foi inserido na fila anteriormente')
            done()
        })
    }) 

    it('Falha ao adicionar na fila: faltando o ID', (done) => {
        chai.request(SERVER)
        .post('/addToLine')
        .set('content-type', 'application/x-www-form-urlencoded')
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('position')
            res.body.should.be.a('object').that.have.property('error').equal('ID não informado')
            done()
        })
    })

    it('Falha ao adicionar na fila: ID não foi cadastrado', (done) => {
        chai.request(SERVER)
        .post('/addToLine')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({'id': 1050})
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('position')
            res.body.should.be.a('object').that.have.property('error').equal('Não existe usuário associado ao ID informado')
            done()
        })
    })

})

describe('Encontrar posição do usuário na fila (findPosição)', () => {
    it('Encontrando posição de usuário com sucesso', (done) => {
        chai.request(SERVER)
        .get(`/findPosition/${USER_VALID_JOAO.email}`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('error')
            res.body.should.be.a('object').that.have.property('position').equal(1)
            done()
        })
    })

    it('Falha ao encontrar posição: email não encontrado na fila', (done) => {
        chai.request(SERVER)
        .get(`/findPosition/${USER_VALID_MARIA.email}`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('error')
            res.body.should.be.a('object').that.have.property('position').equal(-1)
            done()
        })
    })

    it('Falha ao encontrar posição: email não foi cadastrado', (done) => {
        chai.request(SERVER)
        .get(`/findPosition/semregistro@email.com`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('position')
            res.body.should.be.a('object').that.have.property('error').equal('Não existe cadastro associado ao e-mail informado')
            done()
        })
    })

    it('Falha ao encontrar posição: email com formato inválido', (done) => {
        chai.request(SERVER)
        .get(`/findPosition/joao@email`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('position')
            res.body.should.be.a('object').that.have.property('error').equal('O campo e-mail possui formato inválido')
            done()
        })
    })
})

describe('Exibir a fila completa e ordenada (showLine)', () => {
    it('Exibindo a fila com sucesso', (done) => {
        chai.request(SERVER)
        .get('/showLine')
        .end((err, res) => {
            const result = res.body[0]
            result.should.be.a('object').that.have.property('position').equal(1)
            result.should.be.a('object').that.have.property('name').equal(USER_VALID_JOAO.name)
            result.should.be.a('object').that.have.property('email').equal(USER_VALID_JOAO.email)
            result.should.be.a('object').that.have.property('gender').equal('Masculino')
            done()
        })
    })
})