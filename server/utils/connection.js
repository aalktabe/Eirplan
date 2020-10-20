const mongoose = require('mongoose');


const mongoURI = 'mongodb+srv://eirplan:eirplan@eirplan.dprmb.mongodb.net/Eirplan?retryWrites=true&w=majority';
    
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

module.exports = conn;