/* globals describe, it, expect, after, beforeAll */
const expect = require('chai').expect
const connectToDatabase = require('../db/connect-db')
const UserCrudModel = require('../models/user-crud-model')
const PostCrudModel = require('../models/post-crud-model')
const UserModel = require('../models/user-model')
const config = require('config')
const _ = require('lodash')

describe('mern social user model() tests', async () => {
  let dbConnection
  let userCrudModel
  let mongoDbString

  // const sampleUser = {
  //   name: 'victor',
  //   email: 'victor@email.com',
  //   password: 'password'
  // }

  before(async () => {
    mongoDbString = _.get(config, 'MONGO_DB', '')
    dbConnection = await connectToDatabase(mongoDbString)
    userCrudModel = new UserCrudModel(dbConnection)
    postCrudModel = new PostCrudModel(dbConnection)
    userModel = new UserModel(dbConnection)
  })
  after(async () => {
    if (dbConnection.readyState) {
      console.info('Cleaning test database')
      await dbConnection.db.dropDatabase()
      await dbConnection.close()
    }
  })

  describe('function getUserAndPostById() tests', () => {
    it('should add new user', async () => {
        const sampleUser = {
            name: 'victor',
            email: 'victor@email.com',
            password: 'password'
        }
        const sampleUserResult = await userCrudModel.createUser(sampleUser)
        const samplePost = {
            title: 'title',
            body: 'body',
            photo: 'photo',
            postedBy: sampleUserResult._id
        }
        await postCrudModel.createPost(samplePost)
        const result = await userModel.getUserAndPostById(sampleUserResult._id)
        expect(result.user.name).equal(sampleUser.name)
        expect(result.post.length).equal(1)
    })
    it('should not get user', async () => {
      try {
        await userCrudModel.getUserAndPostById()
        expect(true).equal(false) // expected to fail
      } catch (error) {
        expect(error.message).equal('Bad Request')
      }
    })
  })

  describe('function follow() tests', () => {
    it('should follow user', async () => {
        const sampleUser = {
            name: 'victor',
            email: 'victor@email.com',
            password: 'password'
        }
        const sampleUserResult = await userCrudModel.createUser(sampleUser)
        const samplePost = {
            title: 'title',
            body: 'body',
            photo: 'photo',
            postedBy: sampleUserResult._id
        }
        await postCrudModel.createPost(samplePost)
        const result = await userModel.getUserAndPostById(sampleUserResult._id)
        expect(result.user.name).equal(sampleUser.name)
        expect(result.post.length).equal(1)
    })
    it('should not follow user', async () => {
      try {
        await userCrudModel.getUserAndPostById()
        expect(true).equal(false) // expected to fail
      } catch (error) {
        expect(error.message).equal('Bad Request')
      }
    })
  })

})
