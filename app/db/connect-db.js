const mongoose = require('mongoose')
const dbConnections = []

const connectToDatabase = async connectionString => {
  let dbConnection = dbConnections[connectionString]
  if (!dbConnection || dbConnection.readyState !== 1) {
    console.info('Connecting to mongoDB...')
    dbConnection = await mongoose.createConnection(connectionString, {
      useNewUrlParser: true,
      bufferCommands: false,
      bufferMaxEntries: 0
    })
    dbConnections[connectionString] = dbConnection
    console.info('MongoDB connected')
  }
  return dbConnection
}

const disConnectDB = async (dbConnection) => {
  return new Promise((resolve, reject) => {
    if (dbConnection) {
      dbConnection.close(function (error, success) {
        console.log('db connection close result: error:', error, ' success:', success)
        dbConnection = undefined
        return resolve()
      })
    } else {
      return resolve()
    }
  })
}

module.exports = { connectToDatabase, disConnectDB } 
