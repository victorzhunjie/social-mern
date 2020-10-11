'use strict'
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config/keys')
// const requireLogin = require('../../middleware/requireLogin')
const _ = require('lodash')
const config = require('config')

const UserCrudModel = require('../models/user-crud-model')
const UserModel = require('../models/user-model')
const  { connectToDatabase, disConnectDB } = require('../db/connect-db')
let userModel, userCrudModel, dbConnection
const mongoDbString = _.get(config, 'MONGO_DB', '')
module.exports.create = () => {
    async function init() {
        if (!mongoDbString) {
            try {
                console.log('---- mongoDbString mongoDbString', config)
                dbConnection = await connectToDatabase(mongoDbString)
            } catch (error) {
                console.log('Could not init handler', error)
                throw error
            }
        }
        dbConnection = await connectToDatabase(mongoDbString)
        if (!userModel || !userCrudModel) {
            userModel = new UserModel(dbConnection)
            userCrudModel = new UserCrudModel(dbConnection)
        }
    }

    const authController = {

        signIn: async (req, res) => {
            console.log('------------signIn')
            await init()
            const { email, password } = req.body
            if (!email || !password) {
                return res.status(422).json({ error: "please add email or password" })
            }
            try {
                const result = await userModel.signIn(email, password)
                return res.json(result)
            } catch (error) {
                console.log(error)
                await disConnectDB(mongoDBUrl)
            }
        },


        resetPassword: async (req, res) => {
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    console.log(err)
                }
                const token = buffer.toString("hex")
                User.findOne({ email: req.body.email })
                    .then(user => {
                        if (!user) {
                            return res.status(422).json({ error: "User dont exists with that email" })
                        }
                        user.resetToken = token
                        user.expireToken = Date.now() + 3600000
                        user.save().then((result) => {
                            res.json({ message: "check your email" })
                        })

                    })
            })
        },
        newPassword: async (req, res) => {
            const newPassword = req.body.password
            const sentToken = req.body.token
            try {
                const user = await User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
                if (!user) {
                    return res.status(422).json({ error: "Try again session expired" })
                }
                const hashedpassword = await bcrypt.hash(newPassword, 12)
                if (hashedpassword) {
                    user.password = hashedpassword
                    user.resetToken = undefined
                    user.expireToken = undefined
                    user.save().then((saveduser) => {
                        res.json({ message: "password updated success" })
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    return authController
}
