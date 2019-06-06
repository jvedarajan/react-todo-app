import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

const w = moment().weekday();
const daysToSubtract = ((w + 3 + Math.floor(24 / 16))) % 7;
const endOfWeek = moment().add(14 - daysToSubtract, 'days');

class ModalAddTask extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = { dueDate: moment() };
    }

    handleChange = (date) => {
        this.setState({
            dueDate: date
        });
    }

    handleClickCloseModal = () => {
        const modal = this.refs.modalTask;
        modal.style.display = "none";
    }

    handleCheckInput = (event) => {
        const target = event.target || event.srcElement;
        if (target.value === "") {
            target.classList.add('invalid');
            target.nextElementSibling.classList.remove('hide');
        } else {
            target.classList.remove('invalid');
            target.nextElementSibling.classList.add('hide');
        }
    }

    handleSubmitTask = () => {
        const taskIPElem = this.refs.task_name;
        const taskAction = this.refs.task_action.innerText;
        const taskName = this.refs.task_name.value;
        const taskTodo = this.refs.task_type.value;
        const menus = this.props.menus;
        const taskIndex = this.refs.edit_index.value;
        const taskRow = this.refs.edit_row.value;
        const taskPriorityElem = this.refs.task_priority;
        const taskPriority = taskPriorityElem.value;
        const duedate = this.state.dueDate;
        let taskDuedate;
        if (duedate !== "" && duedate !== undefined && duedate !== null) {
            taskDuedate = this.state.dueDate.format("YYYY-MM-DD") + " 23:59:59";

        } else {
            taskDuedate = "";
            this.setState({ dueDate: moment() });
        }

        const menusRow = menus[taskTodo];
        if (taskName !== "" && taskName.length > 10 && taskPriority !== "") {
            taskIPElem.classList.remove('invalid');
            taskIPElem.nextElementSibling.classList.add('hide');
            if (menusRow.menuname === taskTodo) {
                if (taskAction === "Edit") {
                    menusRow.added_lists[taskIndex].title = taskName;
                    menusRow.added_lists[taskIndex].priority = taskPriority;
                }
                if (taskAction === "Add") {
                    const createNewTask = { title: taskName, created_at: this.getCurrentTime("db"), status: "pending", completed_at: "", due_date: duedate, priority: taskPriority };
                    menusRow.added_lists.push(createNewTask);
                }
            }
            const passData = { taskTodo: taskTodo, taskName: taskName, taskAction: taskAction, editID: taskRow, taskPriority: taskPriority, taskDuedate: taskDuedate };
            this.callApiAddEditTodo(passData);
            this.props.handleStateUpdateNewTask(menus);
        } else {
            taskIPElem.classList.add('invalid');
            taskIPElem.nextElementSibling.classList.remove('hide');
        }
        if (taskPriority === "") {
            taskPriorityElem.classList.add('invalid');
            taskPriorityElem.nextElementSibling.classList.remove('hide');
            taskIPElem.classList.remove('invalid');
            taskIPElem.nextElementSibling.classList.add('hide');
        } else {
            taskPriorityElem.classList.remove('invalid');
            taskPriorityElem.nextElementSibling.classList.add('hide');
        }
    }

    getCurrentTime = (passdb) => {
        const today = new Date();
        let currentDateTime = '';
        if (passdb) {
            currentDateTime = moment(today).format('YYYY-MM-DD h:m:s');
        } else {
            currentDateTime = moment(today).format('lll');
        }
        return currentDateTime;
    }


    callApiAddEditTodo = async (data) => {
        const _this = this;
        const userID = localStorage.getItem('loggedUserID');
        const response = await fetch('/api/addEditTodo',
            {
                method: 'POST',
                body: JSON.stringify({
                    user: userID,
                    taskTodo: data.taskTodo,
                    taskName: data.taskName,
                    taskAction: data.taskAction,
                    created_at: _this.getCurrentTime('dbdateformat'),
                    editID: data.editID,
                    taskPriority: data.taskPriority,
                    taskDuedate: data.taskDuedate
                }),
                headers: { "Content-Type": "application/json" }
            });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if (body.status === "OK") {
            _this.handleClickCloseModal();
            if (data.taskAction === "Add") {
                _this.refs.edit_row = body.data;
                // _this.refs.delete_task_row = body.data;
            }
        }
    }

    render() {
        return (<div className="modal" id="modalTask" role="dialog" ref="modalTask">
            <div className="modal-dialog modal-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5> <span id="show_task_type" ref="showTaskType"></span></h5>
                        <button type="button" className="close" ref="closeModal" data-dismiss="modal" aria-label="Close" onClick={() => this.handleClickCloseModal()}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form >
                            <div className="form-group">
                                <label><span id="task_action" ref="task_action"></span> Task</label>
                                <input type="text" className="form-control" ref="task_name" name="task_name" id="task_name" onChange={(e) => this.handleCheckInput(e)} />
                                <span className="error hide">Enter valid Task min 10 chars</span>
                            </div>
                            <div className="form-group">
                                <label>Due Date</label>
                                <DatePicker className="form-control" minDate={new
                                    Date()} maxDate={new Date(endOfWeek)}
                                    selected={this.state.dueDate}
                                    onChange={this.handleChange} ref="due_date" id="due_date"
                                />
                                <span className="error hide">Please Select Date</span>
                            </div>
                            <div className="form-group">
                                <label>Priority</label>
                                <select className="form-control" ref="task_priority" id="task_priority" onChange={(e) => this.handleCheckInput(e)}>
                                    <option value="">Select</option>
                                    <option value="1">Low</option>
                                    <option value="2">Medium</option>
                                    <option value="3">High</option>
                                </select>
                                <span className="error hide">Please Select Priority</span>
                            </div>
                            <input type="hidden" id="task_type" name="task_type" ref="task_type" />
                            <input type="hidden" id="edit_index" name="edit_index" ref="edit_index" />
                            <input type="hidden" id="edit_row" name="edit_row" ref="edit_row" />
                            <button type="button" className="btn btn-primary" id="btn-task" onClick={() => this.handleSubmitTask()}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>)
    }
}
export default ModalAddTask;