import React, { Component } from "react";
import moment from 'moment';

class TasksComponent extends Component {
    constructor(props) {
        super(props);
        this.getAllRefs = this.props.passrefs;

    }
    componentDidMount = () => {
        
    }

    componentWillReceiveProps = (nextProps) => {
        this.getTaskLists(nextProps);
    }

    getTaskLists = (getProps) => {

        const task = this.props.taskType;
        let userMenus;
        if (getProps) {
            userMenus = getProps.states.menus;
        } else {
            userMenus = this.props.states.menus;
        }

        const _this = this;
        return Object.keys(userMenus).map((menuObj, ind) => {

            if (userMenus[menuObj].menuname === task) {
                const addedLists = userMenus[menuObj].added_lists;
                if (addedLists.length > 0) {
                    return addedLists.map((item, i) => {

                        let disabledClass = '';
                        if (item.status === "completed") {
                            disabledClass = "disabled";
                        }
                        return (<li className="list-group-item" key={i}><span className={disabledClass + " edit_lists"} data-row-id={item.id} onClick={() => _this.clickAddEditTask(item.title, 'Edit', i, item.id, item.priority, item.due_date)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></span><span className={disabledClass + " delete_lists"} onClick={() => _this.clickDelete(task, i, item.id)}><i className="fa fa-trash-o" aria-hidden="true"></i></span><span>{item.title}</span> <span className="created_listtime">{_this.getDateFormatChange(item.created_at)}</span>
                            <p key={i} className={item.status + " task_status"}>{item.status}</p></li>);
                    });
                } else {
                    return (<li className="list-group-item" key="empty">Your Task Lists are Empty. </li>);
                }
            }
        });
    }


    getDateFormatChange = (dates) => {
        if (dates !== '' && dates !== undefined && dates !== null) {
            let date = moment(dates).format('lll');
            return date;
        }
    }

    clickAddEditTask = (val, action, rowIndex, id, priority, dueDate) => {
       
        const modal = document.getElementById("modalTask");
        let setVal, serPriority;
        modal.style.display = "block";
        modal.querySelector("#show_task_type").innerHTML = this.props.taskType;
        modal.querySelector("#task_type").value = this.props.taskType;
        modal.querySelector('#task_action').innerHTML = action;
        if (action === 'Edit') {
            setVal = val;
            serPriority = priority;
            modal.querySelector("#btn-task").innerHTML = "Submit";
            if (dueDate !== "") {
                dueDate = moment(dueDate).format('L');
            }
        } else {
            serPriority = "";
            setVal = '';
            modal.querySelector("#btn-task").innerHTML = action;
        }
        modal.querySelector("#task_name").value = setVal;
        modal.querySelector("#task_priority").value = serPriority;
        modal.querySelector("#edit_index").value = rowIndex;
        modal.querySelector("#edit_row").value = id;
        modal.querySelector("#due_date").value = dueDate;
    }

    clickDelete = (taskName, rowIndex, rowID) => {
        const modal = document.getElementById("modalDeleteTask");
        modal.style.display = "block";
        modal.querySelector("#delete_task_type").value = taskName;
        modal.querySelector("#delete_task_index").value = rowIndex;
        modal.querySelector("#delete_task_row").value = rowID;
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
                                <li className="list-group-item"><span>Add To-Do in Lists</span><button type="button" className="btn btn-primary add-task-btn" onClick={() => this.clickAddEditTask('', 'Add', -1, -1, "", "")}><i className="fa fa-plus" aria-hidden="true"></i></button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default TasksComponent;