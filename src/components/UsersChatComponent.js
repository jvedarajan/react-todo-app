import React, { Component } from "react";
import axios from 'axios';
//import Tabs from 'react-responsive-tabs';
//import 'react-responsive-tabs/styles.css';
//<Tabs items={this.getTabs()} />
const users = [];
const userMsgs = [];
class UsersChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otherUsers: [],
            userMsgs: []
        }
    }
    componentDidMount = () => {
        this.getAllUsers();
        this.getAllUserMsgs();
    }
    getAllUsers = () => {
        const _this = this;
        axios.get('/api/users', {
            params: {
                user: _this.props.states.userRowIndex
            }
        }).then(function (response) {
            const responsedata = response.data.data;
            responsedata.map(function (item, i) {
                users.push({ "id": item.id, "name": item.firstname + ' ' + item.lastname });
            });
            _this.setState({ otherUsers: users });
        })
            .catch(function (error) {
                console.log(error);
            });
    }
    getAllUserMsgs = () => {
        const _this = this;
        axios.get('/api/userMessages', {
            params: {
                user: _this.props.states.userRowIndex
            }
        }).then(function (response) {
            const responsedata = response.data.data;
            responsedata.map(function (item, i) {
                userMsgs.push({ "send_msg": item.send_msg,"id": item.id });
            });
            _this.setState({ userMsgs: userMsgs });
        })
            .catch(function (error) {
                console.log(error);
            });
    }
    getTabs = () => {
        const tabListsArr = [{ name: <span className="tabs"><i class="fa fa-envelope" aria-hidden="true"></i> Send</span>, content: 'First' }, { name: <span className="tabs"><i className="fa fa-envelope-open" aria-hidden="true"></i> Inbox</span>, content: 'Second' }];
        return tabListsArr.map(tabLists => ({
            /* key: index, // Optional. Equals to tab index if this property is omitted
             tabClassName: 'tab', // Optional
             panelClassName: 'panel', // Optional*/
            title: tabLists.name,
            getContent: () => tabLists.content,
        }));
    }
    handleClickChatBox = (ele) => {
        const target = ele.target || ele.srcElement;
        const checkActive = (' ' + target.className + ' ').indexOf('fa-chevron-up') > -1;
        const msgBoxElement = this.refs.msgbox;
        if (checkActive) {
            target.classList.add('fa-chevron-down');
            target.classList.remove('fa-chevron-up');
            msgBoxElement.classList.add('active');

        } else {
            target.classList.remove('fa-chevron-down');
            target.classList.add('fa-chevron-up');
            msgBoxElement.classList.remove('active');
        }
    }
    handleClickTab = (clickTab) => {
        const sendli = this.refs.send;
        const inboxli = this.refs.inbox;
        const sendMsgSection = this.refs.sendMsgSection;
        const receiveMsgSection = this.refs.receiveMsgSection;
        if (sendli !== undefined && inboxli !== undefined) {
            if (clickTab === "send") {
                sendli.classList.add('active');
                inboxli.classList.remove('active');
                sendMsgSection.style.display = "block";
                receiveMsgSection.style.display = "none";
            } else {
                sendli.classList.remove('active');
                inboxli.classList.add('active');
                sendMsgSection.style.display = "none";
                receiveMsgSection.style.display = "block";
            }
        }
    }
    handleClickSendMsg = async () => {
        const msg = this.refs.sendmsg.value.trim();
        //const users = this.refs.send_usersusers;
        if (msg !== "") {
            const userId = this.props.states.userRowIndex;
            const created_at = this.props.states.datetime2;
            var users = document.getElementsByName('send_users[]');
            if (users.length > 0) {
                //let vals = "";
                let i, n, objData;
                let postData = [];
                for (i = 0, n = users.length; i < n; i++) {
                    if (users[i].checked) {
                        // vals += "," + users[i].value;
                        objData = { "user": userId, "send_msg": msg, "receiver_id": users[i].value, "created_at": created_at };
                        postData.push(objData);
                    }
                }
                const response = await fetch('/api/sendMessage',
                    {
                        method: 'POST',
                        body: JSON.stringify(postData),
                        headers: { "Content-Type": "application/json" }
                    });
                const body = await response.json();
                if (response.status !== 200) throw Error(body.message);
                if (body.status === "OK") {
                    this.refs.sendmsg.value = '';
                    document.getElementsByName('send_users[]').checked = false;
                }
                else {
                    alert("Error Occured Try again later");
                }
            }
        }
    }
    render() {
        return (
            <div className="chat-box card">
                <div className="chat-box-header">
                    <span className="card-title">User Chat</span>
                    <span className="arrow" onClick={this.handleClickChatBox.bind(this)}><i className="fa fa-chevron-up" aria-hidden="true"></i></span>
                </div>
                <div className="chat-box-body card-body" ref="msgbox">
                    <div className="tabs">
                        <ul className="ul_tabs">
                            <li className="send active" ref="send" onClick={this.handleClickTab.bind(this, 'send')}><span className="tab"><i className="fa fa-envelope" aria-hidden="true"></i> Send</span></li>
                            <li className="receive" ref="inbox" onClick={this.handleClickTab.bind(this, 'inbox')}><span className="tab" ><i className="fa fa-envelope-open" aria-hidden="true"></i> Inbox</span></li>
                        </ul>
                    </div>
                    <div className="tabs_content" >
                        <section ref="sendMsgSection">
                            <ul className="list-group list-group-flush">
                                {this.state.otherUsers.map(user =>
                                    <li key={user.id} className="list-group-item"> <label className="user_label">{user.name}<input type="checkbox" name="send_users[]" ref="send_users" value={user.id} />
                                        <span className="checkmark"></span></label></li>
                                )}
                            </ul>
                            <div className="row">
                                <div className="col-md-9">
                                    <textarea rows="2" cols="25" ref="sendmsg"></textarea>
                                </div>
                                <div className="col-md-3">
                                    <button type="button" className="btn btn-primary" onClick={this.handleClickSendMsg.bind(this)}><i className="fa fa-send" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </section>
                        <section ref="receiveMsgSection">
                        <ul className="list-group list-group-flush">
                            {this.state.userMsgs.map(usermsg =>
                                <li key={usermsg.id} className="list-group-item">{usermsg.send_msg}</li>
                            )}
                         </ul>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}
export default UsersChat;