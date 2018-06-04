import React, { Component } from "react";

class DashboardContent extends Component {
    constructor(props) {
        super(props);
        this.state = { completedTask: 0, pendingTask: 0 };
        this.taskStatusCounts();
    }
    taskStatusCounts= ()=>{
        const uMenus = this.props.states.menus;
        const _thisState = this ;
       return  Object.keys(uMenus).map(function (menuObj, ind) {
                const addedLists = uMenus[menuObj].added_lists;
                return _thisState.findTaskCounts(addedLists);
        });
    }
    findTaskCounts = (taskLists)=>{
        if (taskLists.length > 0) {
            for(var row in taskLists){
               var status = taskLists[row].status ;
               if(status==="pending"){
                  this.state.pendingTask++;
               }
               if(status==="completed"){
                this.state.completedtask++;
               }
            }
        } 
    }
    loadTaskDetails = ()=>{
        const getUserMenus = this.props.states.menus;
        var _this = this;
        var listNo = 0;
        return Object.keys(getUserMenus).map(function (obj, i) {
            const addedLists = getUserMenus[obj].added_lists;
            const addedListsCount = addedLists.length;
            if (addedListsCount > 0) {
                listNo++ ;
                if (getUserMenus[obj].menuname !== 'My-Day') {
                   return addedLists.map(function(item, j){
                        return (<tr key={listNo}><td>{listNo}</td><td>{addedLists[j].title}</td><td>{getUserMenus[obj].menuname}</td><td>{addedLists[j].status}</td><td>{_this.dateFormatChange(addedLists[j].created_at)}</td><td>{_this.dateFormatChange(addedLists[j].completed_at)}</td></tr>);
                    });
                }
            }
        });
    }
    dateFormatChange = (date)=>{
        if(date!=='' && date!==undefined && date!==null){
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const dateArr     = date.split(' ');
            const month  = dateArr[0] ;
            const intMonth = months.indexOf(month)+1;
            return  dateArr[1].slice(0, -1)+'/'+intMonth+'/'+dateArr[2]+' '+dateArr[4]+dateArr[6];
        }
    }
    render() {
        return (
            <div className="row">
                <div className="content_title">
                    <h5>Dashboard</h5>
                </div>
                <div className="col-sm-12 col-md-9 col-lg-9 padding_none">
                    <div className="dashboard_notification">
                        <div className="alert alert-info">
                            <strong>{this.state.completedTask+this.state.pendingTask}</strong> Todos assigned to you!.
                </div>
                    </div>
                    <div className="row padding_none">
                        <div className="col-sm-12 col-md-6 col-lg-6 cards_div">
                            <div className="card dashboard_cards">
                                <div className="card-body">Basic card</div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 col-lg-6 cards_div">
                            <div className="card dashboard_cards right">
                                <div className="card-body">Basic card</div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-12 card">
                            <div className="table-responsive">
                            <table className="table">
                                        <thead>
                                          <tr>
                                            <th>No</th>
                                            <th>Task</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Created Time</th>
                                            <th>Completed Time</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                            {this.loadTaskDetails()}
                                        </tbody>
                              </table>
                            </div>
                        </div>
                       
                    </div>
                </div>
                <div className="col-sm-12 col-md-3 col-lg-3">
                    <div className="card dashboard_cards alert alert-primary sub">
                        <div className="card-body">
                            <h5>Task Completed</h5>
                            <p className="count">{this.state.completedTask}</p>
                        </div>
                    </div>
                    <div className="card dashboard_cards alert alert-success sub">
                        <div className="card-body">
                            <h5>Pending Task</h5>
                                <p className="count">{this.state.pendingTask}</p>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}
export default DashboardContent;