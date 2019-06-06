import React, { Component } from "react";
import moment from 'moment';

class DashboardContent extends Component {
    constructor(props) {
        super(props);
        this.state = { totalTask: 0 };
    }

    componentWillReceiveProps(nextprops) {
        this.setState({ totalTask: nextprops.states.tasksCount });
    }

    getTaskDetails = () => {
        const getUserMenus = this.props.states.menus;
        const _this = this;
        let listNo = 0;
        return Object.keys(getUserMenus).map((obj, i) => {
            const addedLists = getUserMenus[obj].added_lists;
            const addedListsCount = addedLists.length;
            if (addedListsCount > 0) {
                if (getUserMenus[obj].menuname !== 'My-Day' && getUserMenus[obj].menuname!= 'To-Do') {
                    return addedLists.map((item, j) => {
                        listNo++;
                        return (<tr key={listNo}><td>{listNo}</td><td>{addedLists[j].title}</td><td>{getUserMenus[obj].menuname}</td><td>{addedLists[j].status}</td><td>{_this.getDateFormatChange(addedLists[j].created_at)}</td><td>{_this.getDateFormatChange(addedLists[j].completed_at)}</td></tr>);
                    });
                }
            }
        });
    }

    getDateFormatChange = (dates) => {
        let date = '';
        if (dates !== '' && dates !== undefined && dates !== null) {
            date = moment(dates).format('lll');

        } else {
            date = '-';
        }
        return date;
    }

    render() {
        return (
            <div className="row">
                <div className="content_title">
                    <h5>Dashboard</h5>
                </div>
                <div className="col-sm-12 col-md-9 padding_none">
                    <div className="dashboard_notification">
                        <div className="alert alert-info">
                            <strong>{this.state.totalTask}</strong> Todos assigned to you!.
                          </div>
                    </div>
                    <div className="row padding_none">
                        <div className="col-sm-12 col-md-12 card">
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
                                        {this.getTaskDetails()}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-sm-12 col-md-3">
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