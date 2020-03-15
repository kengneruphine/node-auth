const cors = require('cors');
const express = require('express');
const bp = require('body-parser');
const { connect } = require('mongoose');
const { success, error } = require('consola');

//Bring in the app constants
const { DB, PORT } = require('./config');

//initialise the application
const app = express();

//Middlewares
app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//User Router Middleware
//const userRouter = require('./routes/users');

app.use('/api/users', require('./routes/users'));
app.use('/api', (req, res) => {
    res.json({ message: "hello" });
})
const startApp = async () => {
    try {
        //connection with the database
        connect(DB, {
            useFindAndModify: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        success({
            message: `Successfully connected  with the database \n${DB}`,
            badge: true
        })
    //start listening to the server on port 5000
        app.listen(PORT, () => success({ message: `Server started on PORT ${PORT}`, badge: true })
        );

    } catch (err) {
        error({
            message: `Unable to connect with the database \n${err}`,
            badge: true
        });
       
    }
}

startApp();