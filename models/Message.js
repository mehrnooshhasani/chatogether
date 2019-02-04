const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// message schema
const MessageSchema = new Schema({
    created: {
        type: Date,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    conversationId: {
        type: String,
        required: true
    },
    inChatRoom: {
        type: Boolean
    }
});

module.exports = mongoose.model('Message', MessageSchema);
