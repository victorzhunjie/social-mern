const _ = require('lodash')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config/keys')
const UserSchema = require('../db/user-schema')
const PostSchema = require('../db/post-schema')
class UserModel {
    constructor(dbConnection) {
        if (dbConnection) {
            this.UserModel = dbConnection.model('User', UserSchema)
            this.PostModel = dbConnection.model('Post', PostSchema)
        } else {
            throw new Error('DB Connection is required.')
        }
    }

    async signIn(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Bad Request')
            }

            const savedUser = await this.UserModel.findOne({ email: email })

            if (!savedUser) {
                throw new Error('Invalid Email or password')
            }
            const passwordResult = await bcrypt.compare(password, savedUser.password)
            if (passwordResult) {
                // res.json({message:"successfully signed in"})
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                const { _id, name, email, followers, following, pic } = savedUser
                return { token, user: { _id, name, email, followers, following, pic } }
            }
            else {
                throw new Error('Invalid Email or password , password incorrect')
            }
        } catch (error) {
            console.log('signIn', error, email)
            throw error
        }
    }

    async getUserAndPostById(id) {
        try {
            if (id) {
                const userMongoObject = await this.UserModel.findOne({ _id: id }).exec()
                if (!userMongoObject || _.isEmpty(userMongoObject)) {
                    throw new Error('Not Found')
                }
                const postMongoObject = await this.PostModel.find({ postedBy: id }).populate("postedBy", "_id name").exec()
                if (!postMongoObject || _.isEmpty(postMongoObject)) {
                    throw new Error('Not Found')
                }
                const user = userMongoObject.toObject()
                const post = postMongoObject
                return { user, post }
            } else {
                throw new Error('Bad Request')
            }
        } catch (error) {
            console.log('Error getUserAndPostById', error, id)
            throw error
        }
    }

    async follow(followId, userId) {
        try {
            if (!followId || !userId) {
                throw new Error('Bad Request')
            }
            const updatedUser = await this.UserModel.findByIdAndUpdate(followId, { $push: { following: userId } }, { new: true })
            // remove password
            return updatedUser
        } catch (error) {
            console.log('Error follow', error, followId, userId)
            throw error
        }
    }
    
}

module.exports = UserModel