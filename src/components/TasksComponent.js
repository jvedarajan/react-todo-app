import React, { Component } from "react";
class TasksComponent extends Component {
    componentWillReceiveProps = (nextProps)=>{
       // console.log(nextProps);
       this.getTaskLists(nextProps);
    }
    /*componentWillUpdate = ()=>{
        this.getTaskLists();
    }*/
    getTaskLists = (getProps) => {
     
        const task = this.props.taskType;
        let userMenus;
       if(getProps){
             userMenus = getProps.states.menus;
        }else{ 
             userMenus = this.props.states.menus;
        }

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
                        return (<li className="list-group-item" key={i}><span className={disabledClass+" edit_lists"} data-row-id={item.id} onClick={() => _this.clickAddEditTask(item.title, 'Edit', i,item.id,item.priority)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></span><span className= {disabledClass+" delete_lists"} onClick={() => _this.clickDelete(task,i,item.id)}><i className="fa fa-trash-o" aria-hidden="true"></i></span><span>{item.title}</span> <span className="created_listtime">{_this.getDateFormatChange(item.created_at)}</span> 
                        <p key={i} className={item.status+" task_status"}>{item.status}</p></li>);
                    });
                } else {
                    return (<li className="list-group-item" key="empty">Your Task Lists are Empty. </li>);
                }
            }
        });
    }
    getDateFormatChange = (date) => {
        if (date === "1970-01-01 00:00:00") {
            return '-';
        }
        if (date !== '' && date !== undefined && date !== null) {
            const dateTimeArr = date.split(' ');
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const dateOnly = dateTimeArr[0];
            const dateArr = dateOnly.split("-");
            const intMonth = months[dateArr[1] - 1];
            const timeOnly = dateTimeArr[1];
            const timeArr  = timeOnly.split(":");
            let section = "AM";
            const h = timeArr[0];
            const m = timeArr[1];
            if(h>=12){
                section = "PM";
            }
            return intMonth + ' ' + dateArr[2] + ',' + dateArr[0]+" "+h+":"+m+" "+section;
        }
    }
    clickAddEditTask = (val, action, rowIndex,id,priority) => {
        const modal = document.getElementById("modalTask");
        let setVal,serPriority;
        modal.style.display = "block";
       document.getElementById("show_task_type").innerHTML = this.props.taskType;
        document.getElementById("task_type").value = this.props.taskType;
        document.getElementById('task_action').innerHTML = action;
        if (action === 'Edit') {
            setVal = val;
            serPriority = priority;
            document.getElementById("btn-task").innerHTML = "Submit";
        } else {
            serPriority = "";
            setVal = '';
            document.getElementById("btn-task").innerHTML = action;
        }
        document.getElementById("task_name").value = setVal;
        document.getElementById("task_priority").value = serPriority;
        document.getElementById("edit_index").value = rowIndex;
        document.getElementById("edit_row").value = id;
    }
    clickDelete = (taskName,rowIndex,rowID) => {
        const modal = document.getElementById("modalDeleteTask");
        modal.style.display = "block";
        document.getElementById("delete_task_type").value = taskName;
        document.getElementById("delete_task_index").value = rowIndex;
        document.getElementById("delete_task_row").value = rowID;
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
                                {this.getTaskLists(this.props)}
                                <li className="list-group-item"><span>Add To-Do in Lists</span><button type="button" className="btn btn-primary add-task-btn" onClick={() => this.clickAddEditTask('', 'Add', -1,-1,"")}><i className="fa fa-plus" aria-hidden="true"></i></button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default TasksComponent;