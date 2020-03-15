require('dotenv').config();  //this will get all the environment variable from the .env file

module.exports = {
    DB: process.env.APP_DB,
    SECRET: process.env.APP_SECRET,
    PORT: process.env.APP_PORT
}