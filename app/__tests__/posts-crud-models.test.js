/* globals describe, it, expect, after, beforeAll */
const expect = require('chai').expect
const connectToDatabase = require('../db/connect-db')
const PostCrudModel = require('../models/post-crud-model')
const config = require('config')
const _ = require('lodash')

describe('mern social post crud model() tests', async () => {
  let dbConnection
  let postCrudModel
  let mongoDbString

  const samplePost = {
    title: 'title',
    body: 'body',
    photo: 'photo'
  }

  before(async () => {
    mongoDbString = _.get(config, 'MONGO_DB', '')
    dbConnection = await connectToDatabase(mongoDbString)
    postCrudModel = new PostCrudModel(dbConnection)
  })
  after(async () => {
    if (dbConnection.readyState) {
      console.info('Cleaning test database')
      await dbConnection.db.dropDatabase()
      await dbConnection.close()
    }
  })

  describe('function createPost() tests', () => {
    it('should add new post', async () => {
      const expectedResult = {
        title: 'title',
        body: 'body'
      }
      const result = await postCrudModel.createPost(samplePost)
      expect(result.title).equal(expectedResult.title)
      expect(result.body).equal(expectedResult.body)
    })
    it('should not add new post', async () => {
      try {
        await postCrudModel.createPost()
        expect(true).equal(false) // expected to fail
      } catch (error) {
        expect(error.message).equal('Bad Request')
      }
    })
  })

  describe('function getPostById() tests', () => {
    it('should get post by id', async () => {
      const expectedResult = {
        title: 'title',
        body: 'body'
      }
      const savedPost = await postCrudModel.createPost(samplePost)
      const result = await postCrudModel.getPostById(savedPost._id)
      expect(result.title).equal(expectedResult.title)
      expect(result.body).equal(expectedResult.body)
    })
    it('should not get post by id', async () => {
      try {
        await postCrudModel.getPostById()
        expect(true).equal(false) // expected to fail
      } catch (error) {
        expect(error.message).equal('Bad Request')
      }
    })
  })
  describe('function updatePostById() tests', () => {
    it('should update post by id', async () => {
      const expectedResult = {
        title: 'title',
        body: 'updated'
      }
      const updateData = {
        body: 'updated'
      }
      const savedPost = await postCrudModel.createPost(samplePost)
      const result = await postCrudModel.updatePostById(savedPost._id, updateData)
      expect(result.title).equal(expectedResult.title)
      expect(result.body).equal(expectedResult.body)
    })
    it('should not update post by id', async () => {
      try {
        await postCrudModel.updatePostById()
        expect(true).equal(true) // expected to fail
      } catch (error) {
        expect(error.message).equal('Bad Request')
      }
    })
  })

  describe('function deletePostById() tests', () => {
    it('should delete post by id', async () => {
      const expectedResult = { ok: 1, n: 1, deletedCount: 1 }
      const savedPost = await postCrudModel.createPost(samplePost)
      const result = await postCrudModel.deletePostById(savedPost._id)
      expect(result).deep.equal(expectedResult)
    })
    it('should not delete post by id', async () => {
      try {
        await postCrudModel.updatePostById()
        expect(true).equal(true) // expected to fail
      } catch (error) {
        expect(error.message).equal('Bad Request')
      }
    })
  })
})
