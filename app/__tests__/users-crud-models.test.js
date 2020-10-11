/* globals describe, it, expect, after, beforeAll */
const expect = require('chai').expect
const connectToDatabase = require('../db/connect-db')
const UserCrudModel = require('../models/user-crud-model')
const config = require('config')
const _ = require('lodash')

describe('mern social user crud model() tests', async () => {
  let dbConnection
  let userCrudModel
  let mongoDbString

  const sampleUser = {
    name: 'victor',
    email: 'victor@email.com',
    password: 'password'
  }

  before(async () => {
    mongoDbString = _.get(config, 'MONGO_DB', '')
    dbConnection = await connectToDatabase(mongoDbString)
    userCrudModel = new UserCrudModel(dbConnection)
  })
  after(async () => {
    if (dbConnection.readyState) {
      console.info('Cleaning test database')
      await dbConnection.db.dropDatabase()
      await dbConnection.close()
    }
  })

  describe('function createUser() tests', () => {
    it('should add new user', async () => {
      const expectedResult = {
        name: 'victor',
        email: 'victor@email.com'
      }
      
      const result = await userCrudModel.createUser(sampleUser)
      expect(result.name).equal(expectedResult.name)
      expect(result.email).equal(expectedResult.email)
    })
    it('should not add new user', async () => {
      try {
        await userCrudModel.createUser()
        expect(true).equal(false) // expected to fail
      } catch (error) {
        expect(error.message).equal('Bad Request')
      }
    })
  })

  describe('function getUserById() tests', () => {
    it('should get user by id', async () => {
      const expectedResult = {
        name: 'victor',
        email: 'victor@email.com'
      }
      const savedUser = await userCrudModel.createUser(sampleUser)
      const result = await userCrudModel.getUserById(savedUser._id)
      expect(result.name).equal(expectedResult.name)
      expect(result.email).equal(expectedResult.email)
    })
    it('should not get user by id', async () => {
      try {
        await userCrudModel.getUserById()
        expect(true).equal(false) // expected to fail
      } catch (error) {
        expect(error.message).equal('Bad Request')
      }
    })
  })
  describe('function updateUserById() tests', () => {
    it('should get user by id', async () => {
      const expectedResult = {
        name: 'victor',
        email: 'update@email.com'
      }
      const updateData = {
        email: 'update@email.com'
      }
      const savedUser = await userCrudModel.createUser(sampleUser)
      const result = await userCrudModel.updateUserById(savedUser._id, updateData)
      expect(result.name).equal(expectedResult.name)
      expect(result.email).equal(expectedResult.email)
    })
    it('should not get user by id', async () => {
      try {
        await userCrudModel.updateUserById()
        expect(true).equal(false) // expected to fail
      } catch (error) {
        expect(error.message).equal('Bad Request')
      }
    })
  })

  describe('function deleteUserById() tests', () => {
    it('should delete user by id', async () => {
      const expectedResult = { ok: 1, n: 1, deletedCount: 1 }
      const savedUser = await userCrudModel.createUser(sampleUser)
      const result = await userCrudModel.deleteUserById(savedUser._id)
      expect(result).deep.equal(expectedResult)
    })
    it('should not delete user by id', async () => {
      try {
        await userCrudModel.updateUserById()
        expect(true).equal(false) // expected to fail
      } catch (error) {
        expect(error.message).equal('Bad Request')
      }
    })
  })

})
