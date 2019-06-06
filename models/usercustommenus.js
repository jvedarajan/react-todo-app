const mongoose = require('mongoose');
const userCustomMenusSchema = new mongoose.Schema({
    user_id: String,
    menu_display_order: Number,
    menuname: String,
    created_at: Date,
    path:String
});
module.exports = mongoose.model('usersCustomMenus', userCustomMenusSchema);