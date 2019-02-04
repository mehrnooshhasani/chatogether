const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// conversation schema
const ConversationSchema = new Schema({
    participants: {
        type: []
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
