const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()

const SERVER = 'http://localhost:3000'

chai.use(chaiHttp)

const USER_VALID_MARIA = {'name': 'Maria', 'email': 'maria@email.com','gender': 'F'}
const USER_VALID_JOAO = {'name': 'Joao', 'email': 'joao@email.com','gender': 'M'}

describe('Cadastro de usuário (createUser)', () => {
    it('Cadastro com sucesso', (done) => {
        chai.request(SERVER)
        .post('/createUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(USER_VALID_MARIA)
        .end((err, res) => {
            res.body.should.be.a('object').that.have.property('id')
            res.body.should.be.a('object').that.have.property('name').equal('Maria')
            res.body.should.be.a('object').that.have.property('email').equal('maria@email.com')
            res.body.should.be.a('object').that.have.property('gender').equal('Feminino')
            done()
        })
    })

    it('Cadastro com falha: falta o campo gênero', (done) => {
        chai.request(SERVER)
        .post('/createUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({'name': 'Maria', 'email': 'maria@email.com'})
        .end((err, res) => {
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
            res.body.should.be.a('object').that.have.property('error').equal('O campo gênero possui formato inválido. Informe F (Feminino), M (Masculino), NB (Não-binário) ou O (Outros).')
            done()
        })
    })
})

describe('Adicionar usuário na fila (addToLine)', () => {
    var id;

    before(() => {
        chai.request(SERVER)
        .post('/createUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(USER_VALID_JOAO)
        .end(async (err, res) => {
            id = await res.body.id
            console.log(id)
        })
    })

    console.log(id)
})


describe('Ver fila', () => {
    it('Fluxo normal', (done) => {
        chai.request(SERVER)
        .get('/showLine')
        .end((err, res) => {
            res.should.be.a('object')
            done()
        })
    })
})