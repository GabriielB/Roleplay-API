import test from 'japa'
import supertest from 'supertest'

// URL Base para servir de teste
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

// Grupo de testes nomeado de User
test.group('User', () => {
  // Teste Unitario esperando o código 201 da requisição POST
  test.only('Deve criar um usuário', async (assert) => {
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
})
