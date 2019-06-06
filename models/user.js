const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    created_at: Date
});
module.exports = mongoose.model('users', userSchema);