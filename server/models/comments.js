var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Comment', commentSchema);
