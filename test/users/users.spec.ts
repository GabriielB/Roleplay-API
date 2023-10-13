import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'

// URL Base para servir de teste
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

// Grupo de testes nomeado de User
test.group('User', (group) => {
  // Teste Unitario esperando o código 201 da requisição POST
  test('Deve criar um usuário', async (assert) => {
    const userPayload = {
      email: 'test@gmail.com',
      username: 'teste',
      password: 'teste',
      avatar: 'http://images.com/image/1',
    }
    // pegando o body da requisição e validando se ele existe
    const { body } = await supertest(BASE_URL).post('/users').send(userPayload).expect(201)
    assert.exists(body.user, 'User Undefined')
    assert.exists(body.user.id, 'ID Undefined')
    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.username, userPayload.username)
    assert.notExists(body.user.password, userPayload.password)
    assert.equal(body.user.avatar, userPayload.avatar)
  })
  test('Deve retornar o 409 o email ja estiver em uso', async () => {
    // Utilizando as Factorys para selecionar o email
    const { email } = await UserFactory.create()
    // selecionando o body criando uma requisicao para enviar o email da factory e enviar username e senha como teste
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({ email: email, username: 'teste', password: 'teste' })
      .expect(409)
  })

  test('Deve retornar o 409 o username ja existe', async () => {
    const { username } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({ email: 'teste', username, password: 'teste' })
      .expect(409)
  })

  test('Deve retornar 422 quando eu não informar os dados obrigatorios', async (assert) => {
    const { body } = await supertest(BASE_URL).post('/users').send({}).expect(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })
  // Utilizando hooks para executar comandos antes e dps de cada teste
  group.beforeEach(async () => {
    // rodando uma transação global para os dados não serem persistidos a cada vez que o controller rodar
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
