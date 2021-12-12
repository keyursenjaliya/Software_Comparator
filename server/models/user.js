var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

VENDOR = 0
USER = 1

var userSchema = mongoose.Schema({
    // Using local for Local Strategy Passport
    local: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
    },
    role: { type: Number, enum: { VENDOR, USER }, default: USER }
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
