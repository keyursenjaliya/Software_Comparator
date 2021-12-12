var mongoose = require('mongoose');
var Schema = mongoose.Schema

var contactUsSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    message: {
        type: String
    }
});

// create the model for software and expose it to our app
module.exports = mongoose.model('ContactUs', contactUsSchema);