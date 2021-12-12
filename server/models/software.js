var mongoose = require('mongoose');
var Schema = mongoose.Schema

var softwareSchema = mongoose.Schema({
    name: {type: String, required: true},
    catagory: {type: String, required: true},
    rating: { type: Number, min: 0, max: 5, default: 0 },
    details: {type: String, required: true},
    comments: [{
        type: Schema.ObjectId,
        ref: 'Comment'
    }],
    developerName: {type: String, required: true},
    subscriptionPrice: {type: String, required: true},
});

// create the model for software and expose it to our app
module.exports = mongoose.model('Software', softwareSchema);