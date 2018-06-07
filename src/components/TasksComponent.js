import React, { Component } from "react";
class TasksComponent extends Component {
    getTaskLists = () => {
        const task = this.props.taskType;
        const userMenus = this.props.states.menus;
        const _this = this;
        return Object.keys(userMenus).map(function (menuObj, ind) { 
            if (userMenus[menuObj].menuname === task) {
                const addedLists = userMenus[menuObj].added_lists;
                if (addedLists.length > 0) {
                    return addedLists.map(function (item, i) {
                        let disabledClass = '';
                        if(item.status==="completed"){
                            disabledClass = "disabled";
                        }
                        return (<li className="list-group-item" key={i}><span className={disabledClass+" edit_lists"} onClick={() => _this.clickAddEditTask(item.title, 'Edit', i)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></span><span className= {disabledClass+" delete_lists"} onClick={() => _this.clickDelete(task,i)}><i className="fa fa-trash-o" aria-hidden="true"></i></span><span>{item.title}</span> <span className="created_listtime">{item.created_at}</span> 
                        <p key={i} className={item.status+" task_status"}>{item.status}</p></li>);
                    });
                } else {
                    return (<li className="list-group-item" key="empty">Your Task Lists are Empty. </li>);
                }
            }
        });
    }
    clickAddEditTask = (val, action, rowIndex) => {
        const modal = document.getElementById("modalTask");
        let setVal;
        modal.style.display = "block";
       document.getElementById("show_task_type").innerHTML = this.props.taskType;
        document.getElementById("task_type").value = this.props.taskType;
        document.getElementById('task_action').innerHTML = action;
        if (action === 'Edit') {
            setVal = val;
            document.getElementById("btn-task").innerHTML = "Submit";
        } else {
            setVal = '';
            document.getElementById("btn-task").innerHTML = action;
        }
        document.getElementById("task_name").value = setVal;
        document.getElementById("edit_index").value = rowIndex;
    }
    clickDelete = (taskName,rowIndex) => {
        const modal = document.getElementById("modalDeleteTask");
        modal.style.display = "block";
        document.getElementById("delete_task_type").value = taskName;
        document.getElementById("delete_task_index").value = rowIndex;
    }

    render() {
        return (
            <div className="row">
                <div className="content_title">
                    <h5>{this.props.taskType}</h5>
                </div>
                <div className="col-sm-12 offset-md-2  col-md-6">
                    <div className="card todo_cards default">
                        <div className="card-header">{this.props.taskType} Todo</div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {this.getTaskLists()}
                                <li className="list-group-item"><span>Add To-Do in Lists</span><button type="button" className="btn btn-primary add-task-btn" onClick={() => this.clickAddEditTask('', 'Add', -1)}><i className="fa fa-plus" aria-hidden="true"></i></button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default TasksComponent;