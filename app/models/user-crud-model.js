const _ = require('lodash')
const UserSchema = require('../db/user-schema')
class UserCrudModel {
    constructor(dbConnection) {
        if (dbConnection) {
            this.UserModel = dbConnection.model('User', UserSchema)
        } else {
            throw new Error('DB Connection is required.')
        }
    }

    async createUser(userObject) {
        try {
            if (userObject) {
                const user = new this.UserModel(userObject)
                const userMongoObject = await user.save()
                return userMongoObject.toObject()
            } else {
                throw new Error('Bad Request')
            }
        } catch (error) {
            console.log('createUser', error, userObject)
            throw error
        }
    }

    async getUserById(id) {
        try {
            if (id) {
                const userMongoObject = await this.UserModel.findOne({ _id: id }).exec()
                if (!userMongoObject || _.isEmpty(userMongoObject)) {
                    throw new Error('Not Found')
                }
                return userMongoObject.toObject()
            } else {
                throw new Error('Bad Request')
            }
        } catch (error) {
            console.log('Error getUserById', error, id)
            throw error
        }
    }

    async updateUserById(id, updateClause) {
        try {
            if (id && updateClause) {
                const updateRes = await this.UserModel.findOneAndUpdate({ _id: id }, updateClause, { new: true }).exec()

                if (!updateRes || _.isEmpty(updateRes)) {
                    throw new Error('Not Found')
                }
                const user = updateRes.toObject()
                return user
            } else {
                throw new Error('Bad Request')
            }
        } catch (error) {
            console.log('Error updateUserById', error, updateClause)
            throw error
        }
    }

    async deleteUserById(id) {
        try {
            if (id) {
                const deletedResult = await this.UserModel.deleteOne({ _id: id }).exec()
                return deletedResult
            } else {
                throw new Error('Bad Request')
            }
        } catch (error) {
            console.log('Error deleteUserById', error, id)
            throw error
        }
    }
}

module.exports = UserCrudModel