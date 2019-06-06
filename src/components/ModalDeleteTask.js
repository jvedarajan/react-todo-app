import React from 'react';


class ModalDeleteTask extends React.Component {

    handleClickCloseModal = () => {
        const modal2 = this.refs.modalDeleteTask;
        modal2.style.display = "none";
    }

    handleTaskDelete = () => {
        const taskType = this.refs.delete_task_type.value;
        const deleteIndex = this.refs.delete_task_index.value;
        const deleteRow = this.refs.delete_task_row.value;
        const menus = this.props.menus;
        menus[taskType].added_lists = [];
        this.callApiDeleteTodo(taskType, deleteRow, deleteIndex);
    }

    callApiDeleteTodo = async (taskTodo, rowId, deleteIndex) => {
        const _this = this;
        const userID = localStorage.getItem('loggedUserID');
        const response = await fetch('/api/deleteTodo',
            {
                method: 'POST',
                body: JSON.stringify({
                    user: userID,
                    taskTodo: taskTodo,
                    rowId: rowId
                }),
                headers: { "Content-Type": "application/json" }
            });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        if (body.status === "OK") {
            //  _this.callApiGetTodoLists("callback");
            this.props.handleStateDeleteTask();
            _this.handleClickCloseModal();

        }
    }

    render() {
        return (<div className="modal" id="modalDeleteTask" role="dialog" ref="modalDeleteTask">
            <div className="modal-dialog modal-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5> Delete?</h5>
                        <button type="button" className="close" ref="closeModal" data-dismiss="modal" aria-label="Close" onClick={() => this.handleClickCloseModal()}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure want to Delete?</p>
                        <div className="offset-md-3  col-md-9  col-sm-12">
                            <div className="row">
                                <input type="hidden" id="delete_task_type" name="delete_task_type" ref="delete_task_type" />
                                <input type="hidden" id="delete_task_index" name="delete_task_index" ref="delete_task_index" />
                                <input type="hidden" id="delete_task_row" name="delete_task_row" ref="delete_task_row" value="0" />
                                <div className="col-md-6 ">
                                    <button type="button" className="btn btn-info btn-cancel" onClick={() => this.handleClickCloseModal()}>Cancel</button>
                                </div>
                                <div className="col-md-6 ">
                                    <button type="button" className="btn btn-primary btn-delete" onClick={() => this.handleTaskDelete()}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}
export default ModalDeleteTask;