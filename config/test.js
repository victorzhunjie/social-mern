module.exports={
    MONGO_DB:process.env.MONGO_DB || 'mongodb://localhost/victor',
    JWT_SECRET:process.env.JWT_SEC || 'secret',
    SENDGRID_API:process.env.SENDGRID_API,
    EMAIL:process.env.EMAIL
}