import React, { Component } from "react";
import moment from 'moment';

class ToDo extends Component {
    state = { notficationCount: 0, menus: this.props.states.menus };
    getTodos = () => {
        const getUserMenus = this.state.menus;
        let listCounts = 0;
        const _this = this;
        return Object.keys(getUserMenus).map((obj, i) => {
            const addedLists = getUserMenus[obj].added_lists;
            const addedListsCount = addedLists.length;
            listCounts += addedListsCount;

            if (addedListsCount > 0) {
                if (getUserMenus[obj].menuname !== 'My-Day') {
                    return (<div className="card todo_cards" key={'card-' + getUserMenus[obj].menuname}>
                        <div className="card-header" key={'header-' + getUserMenus[obj].menuname}>{getUserMenus[obj].menuname} Todo </div>
                        <div className="card-body" key={'body-' + getUserMenus[obj].menuname}>
                            <ul key={'ul-' + getUserMenus[obj].menuname}>
                                {_this.getTodoLists(addedLists, getUserMenus[obj].menuname)}
                            </ul>
                        </div>
                    </div>)
                }
            }

        });
        _this.setState({ notficationCount: listCounts });

    }

    getTodoLists = (lists, todoName) => {
        let i = 0;
        const _this = this;
        console.log(lists);
        return lists.map((anObjectMapped, index) => {
            i++;
            let disabledClass = '';
            if (anObjectMapped.status === "completed") {
                disabledClass = "disabled";
            }
            let addChecked = '';
            if (anObjectMapped.status === "completed") {
                addChecked = { ["checked"]: true };
            }
            return (
                <li className="list-group-item no_border" key={index}>
                    <label className="checkobox todo"><input type="checkbox" data-task={todoName} data-row-id={anObjectMapped.id} value={index} onChange={((e) => _this.handleCheckboxTick(e))} {...addChecked} /><span className="checkmark"></span>

                    </label>   <span className={disabledClass + " edit_lists todo"} onClick={() => _this.clickEditTask(anObjectMapped.title, anObjectMapped.task, index, anObjectMapped.id, anObjectMapped.priority, anObjectMapped.due_date)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></span> <span>{anObjectMapped.title}</span> <span className="created_listtime">{_this.getDateFormatChange(anObjectMapped.created_at)}</span></li>
            );


        });
    }

    getDateFormatChange = (dates) => {
        if (dates !== '' && dates !== undefined && dates !== null) {
            let date = moment(dates).format('lll');
            return date;
        }
    }

    handleCheckboxTick = (clickElem) => {

        const getDate = this.props.states.datetime;
        const val = clickElem.target.value;

        const taskSelected = clickElem.target.getAttribute("data-task");
        const rowId = clickElem.target.getAttribute("data-row-id");
        let setStatus, setCompletedTime, setDBstatus;

        if (clickElem.target.checked) {
            setStatus = "completed";
            setCompletedTime = getDate;
            setDBstatus = 1;
        } else {
            setStatus = "pending";
            setCompletedTime = "";
            setDBstatus = 0;
        }
        const userMenus = this.state.menus;
        const selectedRowMenus = userMenus[taskSelected];
        if (selectedRowMenus.menuname === taskSelected) {
            selectedRowMenus.added_lists[val].status = setStatus;
            selectedRowMenus.added_lists[val].completed_at = setCompletedTime;
            this.callApiChangeTodoStatus(taskSelected, rowId, setDBstatus);
            this.setState({ menus: userMenus });
        }
    }

    clickEditTask = (val, taskType, rowIndex, id, priority, dueDate) => {

        const modal = document.getElementById("modalTask");
        let setVal, serPriority;
        modal.style.display = "block";
        modal.querySelector("#show_task_type").innerHTML = taskType;
        modal.querySelector("#task_type").value = taskType;
        modal.querySelector('#task_action').innerHTML = "Edit";

        setVal = val;
        serPriority = priority;
        modal.querySelector("#btn-task").innerHTML = "Submit";
        if (dueDate !== "") {
            dueDate = moment(dueDate).format('L');
        }

        modal.querySelector("#task_name").value = setVal;
        modal.querySelector("#task_priority").value = serPriority;
        modal.querySelector("#edit_index").value = rowIndex;
        modal.querySelector("#edit_row").value = id;
        modal.querySelector("#due_date").value = dueDate;
    }


    getTodoNotification = (listsObj) => {
        let listCounts = 0;
        Object.keys(listsObj).map((obj, i) => {
            const addedListsCount = listsObj[obj].added_lists.length;
            if (listsObj[obj].menuname !== 'My-Day') {
                listCounts += addedListsCount;
            }
        });
        if (listCounts > 0) {
            return <div className="dashboard_notification"><div className="alert alert-info"><strong>{listCounts}</strong> Todos assigned to you!. </div> </div>

        } else {
            return <div className="dashboard_notification"><div className="alert alert-warning"> You don't have any assigned Todos. </div></div>
        }
    }

    handleModalClose = () => {
        const modal = this.refs.editListModal;
        modal.style.display = "none";
    }

    submitEditTask = () => {
        const taskInput = this.refs.edit_task;
        const taskEdited = taskInput.value;
        const taskIndex = this.refs.edit_index.value;
        const taskTodo = this.refs.edit_todo.value;
        const menus = this.props.states.menus;
        const rowID = taskInput.getAttribute('data-row-id');
        if (taskEdited !== "" && taskEdited.length > 10) {
            taskInput.classList.remove('invalid');
            taskInput.nextElementSibling.classList.add('hide');
            const selectedRowMenus = menus[taskTodo];

            if (selectedRowMenus.menuname === taskTodo) {
                selectedRowMenus.added_lists[taskIndex].title = taskEdited;
            }
            this.callApiEditTodo(taskTodo, taskEdited, rowID);
            this.setState({ menus: menus });

        }
        else {
            taskInput.classList.add('invalid');
            taskInput.nextElementSibling.classList.remove('hide');
        }
    }

    handleCheckInput = (event) => {
        const taskInput = this.refs.edit_task;
        const taskInputVal = taskInput.value;
        if (taskInputVal === "") {
            taskInput.classList.add('invalid');
            taskInput.nextElementSibling.classList.remove('hide');
        } else {
            taskInput.classList.remove('invalid');
            taskInput.nextElementSibling.classList.add('hide');
        }
    }

    callApiChangeTodoStatus = async (taskSelected, rowId, setDBstatus) => {
        const _this = this;
        let completed_at;
        if (setDBstatus === 0) {
            completed_at = "0000-00-00 00:00:00";
        } else {
            completed_at = _this.props.states.datetime2;
        }
        const response = await fetch('/api/updateTodoStatus',
            {
                method: 'POST',
                body: JSON.stringify({
                    user: _this.props.states.userRowIndex,
                    taskTodo: taskSelected,
                    rowId: rowId,
                    taskStatus: setDBstatus,
                    completed_at: completed_at
                }),
                headers: { "Content-Type": "application/json" }
            });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if (body.status === "OK") {
        }
    }

    render() {
        return (<div>
            <div className="row">
                <div className="content_title">
                    <h5>To Do</h5>
                </div>
                <div className="col-sm-12 offset-md-2 col-md-6">
                    {this.getTodoNotification(this.props.states.menus)}
                    {this.getTodos()}
                </div>
            </div>
        </div>
        );
    }
}
export default ToDo;