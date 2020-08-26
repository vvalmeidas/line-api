const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = require('chai')
const should = chai.should()

const SERVER = 'http://localhost:3000'

chai.use(chaiHttp)

var userValidMaria = {'name': 'Maria', 'email': Math.random().toString(36).substring(8) + '@email.com','gender': 'F'}
var userValidCarla = {'name': 'Carla', 'email': Math.random().toString(36).substring(8) + '@email.com','gender': 'F'}
var userValidAri = {'name': 'Ari', 'email': Math.random().toString(36).substring(8) + '@email.com', 'gender': 'F'}


describe('Cadastro de usuário (createUser)', () => {
    it('Cadastro com sucesso: usuária Maria', (done) => {
        chai.request(SERVER)
        .post('/createUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(userValidMaria)
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('error')
            res.body.should.be.a('object').that.have.property('id')
            res.body.should.be.a('object').that.have.property('name').equal(userValidMaria.name)
            res.body.should.be.a('object').that.have.property('email').equal(userValidMaria.email)
            res.body.should.be.a('object').that.have.property('gender').equal('Feminino')
            userValidMaria.id = res.body.id
            done()
        })
    })

    it('Cadastro com sucesso: usuária Carla', (done) => {
        chai.request(SERVER)
        .post('/createUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(userValidCarla)
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('error')
            res.body.should.be.a('object').that.have.property('id')
            res.body.should.be.a('object').that.have.property('name').equal(userValidCarla.name)
            res.body.should.be.a('object').that.have.property('email').equal(userValidCarla.email)
            res.body.should.be.a('object').that.have.property('gender').equal('Feminino')
            userValidCarla.id = res.body.id
            done()
        })
    })

    it('Cadastro com sucesso: usuária Ari', (done) => {
        chai.request(SERVER)
        .post('/createUser')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(userValidAri)
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('error')
            res.body.should.be.a('object').that.have.property('id')
            res.body.should.be.a('object').that.have.property('name').equal(userValidAri.name)
            res.body.should.be.a('object').that.have.property('email').equal(userValidAri.email)
            res.body.should.be.a('object').that.have.property('gender').equal('Feminino')
            userValidAri.id = res.body.id
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
        .send({...userValidMaria, 'email': 'maria@email'})
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
        .send({...userValidMaria, 'gender': 'g'})
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

describe('Adicionar usuário na fila (addToLine)', () => {
    it('Adicionando usuária Maria na primeira posição com sucesso', (done) => {
        chai.request(SERVER)
        .post('/addToLine')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({'id': userValidMaria.id})
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('error')
            res.body.should.be.a('object').that.have.property('position').equal(1)
            done()
        })
    })

    it('Adicionando usuária Carla na segunda posição com sucesso', (done) => {
        chai.request(SERVER)
        .post('/addToLine')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({'id': userValidCarla.id})
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('error')
            res.body.should.be.a('object').that.have.property('position').equal(2)
            done()
        })
    }) 

    it('Falha ao adicionar na fila: ID repetido', (done) => {
        chai.request(SERVER)
        .post('/addToLine')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({'id': userValidCarla.id})
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

describe('Exibir a fila completa e ordenada (showLine)', () => {
    it('Exibindo a fila com sucesso', (done) => {
        chai.request(SERVER)
        .get('/showLine')
        .end((err, res) => {
            res.body.should.be.a('array')
            const firstUser = res.body[0]
            const secondUser = res.body[1]
            firstUser.should.be.a('object').that.have.property('position').equal(1)
            firstUser.should.be.a('object').that.have.property('name').equal(userValidMaria.name)
            firstUser.should.be.a('object').that.have.property('email').equal(userValidMaria.email)
            firstUser.should.be.a('object').that.have.property('gender').equal('Feminino')
            secondUser.should.be.a('object').that.have.property('position').equal(2)
            secondUser.should.be.a('object').that.have.property('name').equal(userValidCarla.name)
            secondUser.should.be.a('object').that.have.property('email').equal(userValidCarla.email)
            secondUser.should.be.a('object').that.have.property('gender').equal('Feminino')
            done()
        })
    })
})

describe('Encontrar posição do usuário na fila (findPosition)', () => {
    it('Encontrando posição da usuária Maria com sucesso', (done) => {
        chai.request(SERVER)
        .get(`/findPosition/${userValidMaria.email}`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('error')
            res.body.should.be.a('object').that.have.property('position').equal(1)
            done()
        })
    })

    it('Encontrando posição da usuária Carla com sucesso', (done) => {
        chai.request(SERVER)
        .get(`/findPosition/${userValidCarla.email}`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('error')
            res.body.should.be.a('object').that.have.property('position').equal(2)
            done()
        })
    })

    it('Buscando um email que não está na fila', (done) => {
        chai.request(SERVER)
        .get(`/findPosition/${userValidAri.email}`)
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
        .get(`/findPosition/carla@email`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('position')
            res.body.should.be.a('object').that.have.property('error').equal('O campo e-mail possui formato inválido')
            done()
        })
    })
})


describe('Filtrar a fila por gênero (filterLine)', () => {
    it('Filtrando por gênero com sucesso', (done) => {
        chai.request(SERVER)
        .get(`/filterLine/f`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .end((err, res) => {
            res.body.should.be.a('array')
            const userCarla = res.body[0], userAri = res.body[1]
            userCarla.should.be.a('object').that.have.property('position').equal(1)
            userCarla.should.be.a('object').that.have.property('name').equal(userValidMaria.name)
            userCarla.should.be.a('object').that.have.property('email').equal(userValidMaria.email)
            userCarla.should.be.a('object').that.have.property('gender').equal('Feminino')
            userAri.should.be.a('object').that.have.property('position').equal(2)
            userAri.should.be.a('object').that.have.property('name').equal(userValidCarla.name)
            userAri.should.be.a('object').that.have.property('email').equal(userValidCarla.email)
            userAri.should.be.a('object').that.have.property('gender').equal('Feminino')
            done()
        })
    })

    it('Falha ao filtrar: gênero inválido', (done) => {
        chai.request(SERVER)
        .get(`/filterLine/invalido`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .end((err, res) => {
            res.body.should.be.a('object').that.have.property('error').equal('O campo gênero possui formato inválido. Informe F (Feminino), M (Masculino), NB (Não-binário) ou O (Outros).')
            done()
        })
    })

})

describe('Remover da primeira posição da fila e retornar (popLine)', () => {
    it('Removendo a usuária que foi inserida primeiro (Maria) com sucesso', (done) => {
        chai.request(SERVER)
        .post('/popLine')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({'id': userValidMaria.id})
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('error')
            res.body.should.be.a('object').that.have.property('id').equal(userValidMaria.id)
            res.body.should.be.a('object').that.have.property('name').equal(userValidMaria.name)
            res.body.should.be.a('object').that.have.property('email').equal(userValidMaria.email)
            res.body.should.be.a('object').that.have.property('gender').equal('Feminino')
            userValidMaria.id = res.body.id
            done()
        })
    })

    it('Removendo a usuária que foi inserida depois (Carla) com sucesso', (done) => {
        chai.request(SERVER)
        .post('/popLine')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({'id': userValidMaria.id})
        .end((err, res) => {
            res.body.should.be.a('object').that.not.have.property('error')
            res.body.should.be.a('object').that.have.property('id').equal(userValidCarla.id)
            res.body.should.be.a('object').that.have.property('name').equal(userValidCarla.name)
            res.body.should.be.a('object').that.have.property('email').equal(userValidCarla.email)
            res.body.should.be.a('object').that.have.property('gender').equal('Feminino')
            userValidMaria.id = res.body.id
            done()
        })
    })

    it('Falha ao remover da fila: fila vazia', (done) => {
        chai.request(SERVER)
        .post('/popLine')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({'id': userValidMaria.id})
        .end((err, res) => {
            res.body.should.be.a('object').that.have.property('error').equal('A fila está vazia')
            done()
        })
    })
})