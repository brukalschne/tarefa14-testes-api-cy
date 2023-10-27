/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
           }) 
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then(response => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let nome = `EBAC${Math.floor(Math.random() * 100)}`
          let email = nome + '@qa.com.br'
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "Usuario tarefa 14",
                    "email": email,
                    "password": "teste",
                    "administrador": "true"
               },
               failOnStatusCode: false
          }).then(response => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it.only('Deve validar um usuário com email inválido', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "Usuario tarefa 14",
                    "email": "tarefa14qa.com.br",
                    "password": "teste",
                    "administrador": "true"
               },
               failOnStatusCode: false
          }).then(response => {
               expect(response.status).to.equal(400)
               expect(response.body.email).to.equal('email deve ser um email válido')
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let nome = `EBAC${Math.floor(Math.random() * 100)}`
          let email = nome + '@qa.com.br'
          cy.cadastrarUsuario(nome, email, 'teste', 'true')
          .then(response => {
               let id = response.body._id

               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body: {
                         "nome": nome,
                         "email": email,
                         "password": "senhanova",
                         "administrador": "true"
                       }
               }).then(response => {
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
               })
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let nome = `EBAC${Math.floor(Math.random() * 100)}`
          let email = nome + '@qa.com.br'
          cy.cadastrarUsuario(nome, email, 'teste', 'true')
          .then(response => {
               let id = response.body._id
               
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`
               }).then(response => {
                    expect(response.status).to.equal(200)
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
               })
          })
     });


});
