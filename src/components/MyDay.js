import React, { Component } from "react";
class MyDay extends Component {
  constructor(props) {
    super(props);
    this.state = {menus: this.props.states.menus  };
}
getTodayDate=()=>{
  const todayDate = this.props.states.datetime;
  const dateArr     = todayDate.split(' ');
  return  dateArr[1].slice(0, -1)+'-'+dateArr[0]+'-'+dateArr[2];
}
getTodayTask=()=>{
  const _this = this ;
    const getDate = _this.props.states.datetime2 ;
    const userMenus = _this.state.menus;
    let listCount = 0 ;
    const dateArr     = getDate.split(' ');
  /*  const day = dateArr[1].slice(0, -1) ;
    const month = dateArr[0] ;
    const year  = dateArr[2] ;*/
    return Object.keys(userMenus).map(function (menuObj, ind) {
          const addedLists = userMenus[menuObj].added_lists;
          if (addedLists.length > 0) {
              return addedLists.map(function (item, i) {
                  const createdDateTime = item.created_at;
                 /*  const createdDateArr = createdDateTime.split(' ');
                 const cday = createdDateArr[1].slice(0, -1) ;
                  const cmonth = createdDateArr[0] ;
                  const cyear  = createdDateArr[2] ; */
                  var patt = new RegExp(dateArr[0]);
                  var checkDate = patt.test(createdDateTime);
                 // if(day===cday && month===cmonth && year===cyear){
                   if(checkDate){
                    let addChecked = '';
                    if(item.status==="completed"){
                         addChecked = { ["checked"]: true };
                    }
                    return (<li className="list-group-item" key={i}>
                    <label className="checkobox">{item.title}<input type="checkbox" data-task={menuObj} data-row-id={item.id} value={i} onChange={((e) => _this.handleCheckboxTick(e))} { ...addChecked } /><span className="checkmark"></span>
                        <span className={item.status+" task_status"}>{item.status}</span>
                        <p className="task_desc">{menuObj}</p>
                    </label></li>);
                  }
              });
              listCount++;
          }
  });
 
  if(listCount===0){
    return (<li className="list-group-item" key="empty">Your Task Lists are Empty. </li>);
  }
}
handleCheckboxTick = (clickElem)=>{
  const getDate = this.props.states.datetime ;
  const val = clickElem.target.value;
  const taskSelected = clickElem.target.getAttribute("data-task") ;
  const rowId    = clickElem.target.getAttribute("data-row-id") ;
  //const userInformation = this.props.states.allUsersInfo;
  let setStatus,setCompletedTime,setDBstatus ;
  if(clickElem.target.checked){
    setStatus = "completed";
    setCompletedTime = getDate;
    setDBstatus  = 1 ;
  }else{
    setStatus = "pending";
    setCompletedTime =  "";
    setDBstatus   = 0;
  }
  const userMenus = this.state.menus;
  const selectedTodoTask = userMenus[taskSelected];
//for (let a in userMenus) {
  if (selectedTodoTask.menuname === taskSelected) {
    selectedTodoTask.added_lists[val].status = setStatus;
    selectedTodoTask.added_lists[val].completed_at = setCompletedTime;
       //   break;
  }
//}
//localStorage.setItem('userInfo', JSON.stringify(userInformation));
//this.props.states.menus = userMenus;
this.setState({ menus: userMenus });
this.callApiChangeTodoStatus(taskSelected, rowId, setDBstatus);
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
    return (
      <div className="row">
        <div className="content_title">
          <h5>My Day</h5>
        </div>
        <div className="col-sm-12 offset-md-2 col-md-6">
                    <div className="card todo_cards default myday_todo">
                        <div className="card-header"> Today Todos <span>{this.getTodayDate()}</span></div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                              {this.getTodayTask()}
                            </ul>
                        </div>
                    </div>
        </div>
      </div>
    );
  }
}
export default MyDay;