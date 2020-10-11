const _ = require('lodash')
const PostSchema = require('../db/post-schema')
class PostCrudModel {
    constructor(dbConnection) {
        if (dbConnection) {
            this.PostModel = dbConnection.model('Post', PostSchema)
        } else {
            throw new Error('DB Connection is required.')
        }
    }

    async createPost(userObject) {
        try {
            if (userObject) {
                const user = new this.PostModel(userObject)
                const mongoObject = await user.save()
                return mongoObject.toObject()
            } else {
                throw new Error('Bad Request')
            }
        } catch (error) {
            console.log('createPost', error, userObject)
            throw error
        }
    }

    async getPostById(id) {
        try {
            if (id) {
                const mongoObject = await this.PostModel.findOne({ _id: id }).exec()
                if (!mongoObject || _.isEmpty(mongoObject)) {
                    throw new Error('Not Found')
                }
                return mongoObject.toObject()
            } else {
                throw new Error('Bad Request')
            }
        } catch (error) {
            console.log('Error getPostById', error, id)
            throw error
        }
    }

    async updatePostById(id, updateClause) {
        try {
            if (id && updateClause) {
                const mongoObject = await this.PostModel.findOneAndUpdate({ _id: id }, updateClause, { new: true }).exec()
                if (!mongoObject || _.isEmpty(mongoObject)) {
                    throw new Error('Not Found')
                }
                return mongoObject.toObject()
            } else {
                throw new Error('Bad Request')
            }
        } catch (error) {
            console.log('Error updatePostById', error, updateClause)
            throw error
        }
    }

    async deletePostById(id) {
        try {
            if (id) {
                const deletedResult = await this.PostModel.deleteOne({ _id: id }).exec()
                return deletedResult
            } else {
                throw new Error('Bad Request')
            }
        } catch (error) {
            console.log('Error deletePostById', error, id)
            throw error
        }
    }
}

module.exports = PostCrudModel