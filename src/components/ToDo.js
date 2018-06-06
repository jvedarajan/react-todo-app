import React, { Component } from "react";
class ToDo extends Component {
    constructor(props) {
        super(props);
        this.state = { notficationCount: 0,menus: this.props.states.menus  };
    }
    getTodos = () => {
        const getUserMenus = this.state.menus;
        let listCounts = 0;
        const _this = this;
        return Object.keys(getUserMenus).map(function (obj, i) {
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
        this.setState({ notficationCount: listCounts });
    }
    getTodoLists = (lists, todoName) => {
        let i = 0;
        const _this = this ;
        return lists.map((anObjectMapped, index) => {
            i++;
            let disabledClass = '';
            if(anObjectMapped.status==="completed"){
                disabledClass = "disabled";
            }
            let addChecked = '';
            if(anObjectMapped.status==="completed"){
                addChecked = { ["checked"]: true };
           }
            return (
                    <li className="list-group-item no_border" key={todoName + anObjectMapped.title}>
                    <label className="checkobox todo">{anObjectMapped.title}<input type="checkbox" data-task={todoName} value={index} onChange={((e) => _this.handleCheckboxTick(e))} { ...addChecked }/><span className="checkmark"></span>
                    <span className={disabledClass+" edit_lists todo"} onClick={this.handleEditListName(todoName, index)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></span> <span className="created_listtime">{anObjectMapped.created_at}</span>   
                    </label></li>
            );
        })
    }
    handleCheckboxTick = (clickElem)=>{
        const getDate  = this.props.states.datetime ;
        const val     = clickElem.target.value;
        const taskSelected = clickElem.target.getAttribute("data-task") ;
        const userInformation = this.props.states.allUsersInfo;
        let setStatus,setCompletedTime ;
        if(clickElem.target.checked){
          setStatus = "completed";
          setCompletedTime = getDate;
        }else{
          setStatus = "pending";
          setCompletedTime =  "";
        }
        const userMenus = this.state.menus;
       const selectedRowMenus =  userMenus[taskSelected] ;
     // for (let a in selectedRowMenus) {
        if (selectedRowMenus.menuname === taskSelected) {
            selectedRowMenus.added_lists[val].status = setStatus;
            selectedRowMenus.added_lists[val].completed_at = setCompletedTime;
               // break;
               localStorage.setItem('userInfo', JSON.stringify(userInformation));
               //this.props.states.menus = userMenus;
               this.setState({ menus: userMenus });
         }
     // }
    }
    handleEditListName = (edittodo, row) => {
        const userMenus = this.state.menus;
        const _this = this ;
        return function () {
            const modal = _this.refs.editListModal;
            modal.style.display = "block";
            _this.refs.editTaskName.innerHTML = edittodo + " Todo";
            const editedRowMenus =  userMenus[edittodo] ;
                if (editedRowMenus.menuname === edittodo) {
                    _this.refs.edit_task.value = editedRowMenus.added_lists[row].title;
                    _this.refs.edit_index.value = row;
                    _this.refs.edit_todo.value = edittodo;
                }
        }
    }
    getTodoNotification = (listsObj) => {
        let listCounts = 0;
        Object.keys(listsObj).map(function (obj, i) {
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
        const userInformation = this.props.states.allUsersInfo;
        if (taskEdited !== "" && taskEdited.length > 10) {
            taskInput.classList.remove('invalid');
            taskInput.nextElementSibling.classList.add('hide');
            const selectedRowMenus = menus[taskTodo];
           // for (var a in menus) {
                if (selectedRowMenus.menuname === taskTodo) {
                    selectedRowMenus.added_lists[taskIndex].title = taskEdited;
                   // break;
                }
            //}
            localStorage.setItem('userInfo', JSON.stringify(userInformation));
            this.setState({ menus: menus });
            this.handleModalClose();
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
    render() {
        return (<div>
            <div className="row">
                <div className="content_title">
                    <h5>To Do</h5>
                </div>
                <div className="col-sm-12 offset-md-2 offset-lg-2 col-md-6 col-lg-6">
                    {this.getTodoNotification(this.props.states.menus)}
                    {this.getTodos()}
                </div>
            </div>
            <div className="modal" id="myModal" role="dialog" ref="editListModal">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 ref="editTaskName" id="editTaskName"></h5>
                            <button type="button" className="close" ref="closeModal" data-dismiss="modal" aria-label="Close" onClick={() => this.handleModalClose()}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form >
                                <div className="form-group">
                                    <label>Edit Task</label>
                                    <input type="text" className="form-control" ref="edit_task" name="edit_task" id="edit_task" onChange={(e) => this.handleCheckInput(e)} />
                                    <span className="error hide">Enter valid Task min 10 chars</span>
                                </div>
                                <input type="hidden" id="edit_index" name="edit_index" ref="edit_index" />
                                <input type="hidden" id="edit_todo" name="edit_todo" ref="edit_todo" />
                                <button type="button" className="btn btn-primary" onClick={() => this.submitEditTask()}>Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}
export default ToDo;