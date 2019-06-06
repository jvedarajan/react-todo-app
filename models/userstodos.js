const mongoose = require('mongoose');
const userTodoSchema = new mongoose.Schema({
    user_id: String,
    menu_id: Number,
    todo_name: String,
    todo_status:Number,
    todo_priority:Number,
    todo_type:String,
    created_at: Date,
    completed_at:Date,
    due_date:Date
});
module.exports = mongoose.model('usersTodos', userTodoSchema);