const db = require('./connection');
const Joi = require('joi');

// username - default to anonymous
// subject
// message
// imageURL
// created
const schema = Joi.object().keys({
    username: Joi.string().alphanum().required(),
    subject: Joi.string().required(),
    message: Joi.string().max(500).required(),
    // Accept git or git http/https
    imageURL: Joi.string().uri({
        scheme: [
            'git',
            /git\+https?/
        ]
    })
});

const messages = db.get('messages');

function getAll() {
    return messages.find();
}

function create(message) {
    if (!message.username) {
        message.username = 'Anonymous';
    }
    const result = Joi.validate(message, schema);
    if (result.error == null) {
        message.created = new Date();
        return messages.insert(message);
    } else {
        return Promise.reject(result.error);
    }
}

module.exports = {
    create,
    getAll
};