import React, { Component } from "react";
import axios from 'axios';
//import Tabs from 'react-responsive-tabs';
//import 'react-responsive-tabs/styles.css';
//<Tabs items={this.getTabs()} />
class UsersChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otherUsers: [],
            userMsgs: [],
            selectedUserMsgs: []
        }
    }
    componentDidMount = () => {
        this.getAllUsers();
        this.getAllUserMsgs();
    }
    getAllUsers = () => {
        const _this = this;
        const users = [];
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
        const userMsgs = [];
        const _this = this;
        const userID = this.props.states.userRowIndex;
        axios.get('/api/userMessages', {
            params: {
                user: userID,
                type: "all"
            }
        }).then(function (response) {
            const responsedata = response.data.data;
            const usersData = _this.state.otherUsers;
           // const allMsgedUsers = [];
           const sendUsers = [];
           const receiveUsers = [];
            responsedata.map(function (item, i) {
                const rec_uid = item.receiveduser_id;
                const send_uid = item.senduser_id;
                const loggedUser = localStorage.getItem('loggedUserName');
                let recName,sendName = '';
                let lastMsgBy = '';
                let msgType = '';
                
                if (receiveUsers.indexOf(rec_uid) === -1 || sendUsers.indexOf(send_uid) === -1) {
                    if(parseInt(rec_uid)!==parseInt(userID)){
                        const findUserRowIndex = usersData.map(function (e) { return e.id; }).indexOf(rec_uid);
                        recName = usersData[findUserRowIndex].name;
                        sendName = loggedUser ;
                        lastMsgBy = "You:";
                        msgType  = "send";
                    }else{
                        recName   = localStorage.getItem('loggedUserName');
                        const findUserRowIndex = usersData.map(function (e) { return e.id; }).indexOf(send_uid);
                        if(usersData[findUserRowIndex]!==undefined){
                            sendName = usersData[findUserRowIndex].name;
                        }
                        msgType  = "receive";
                    }
                        userMsgs.push({ "send_msg": lastMsgBy + " " + item.send_msg, "receiver_id": rec_uid,"sender_id": send_uid, "msg_rec_name": recName,"msg_send_name":sendName, "id": item.id,"msg_type":msgType });
                }
                // allMsgedUsers.push(rec_uid);
                sendUsers.push(send_uid);
                receiveUsers.push(rec_uid);
               
            });
            _this.setState({ userMsgs: userMsgs });
            console.log(_this.state.userMsgs);
        })
            .catch(function (error) {
                console.log(error);
            });
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
        const userMsgSection = this.refs.userMsgSection;
        const receiveMsgSection = this.refs.receiveMsgSection;
        const puserMsgSection = this.refs.puserMsgSection;
        if (sendli !== undefined && inboxli !== undefined) {
            puserMsgSection.style.display = "none";
            if (clickTab === "send") {
                sendli.classList.add('active');
                inboxli.classList.remove('active');
                userMsgSection.style.display = "block";
                receiveMsgSection.style.display = "none";
                this.getAllUsers();
            } else {
                sendli.classList.remove('active');
                inboxli.classList.add('active');
                userMsgSection.style.display = "none";
                receiveMsgSection.style.display = "block";
                this.getAllUserMsgs();
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
    handleClickReplyMsg = async () => {
        const msg = this.refs.user_sendmsg.value.trim();
        if (msg !== "") {
            const userId = this.props.states.userRowIndex;
            const dateTime = this.props.states.datetime2;
            const receiveUser = this.refs.selected_user_id.getAttribute("data-ruser");
            const lastMsgType = this.refs.selected_user_id.getAttribute("data-last-msg-status");
            let type = "reply";
            if(parseInt(lastMsgType)===0){
                    type = "send";
            }
            const response = await fetch('/api/replyMessage',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        msg: msg,
                        rec_user: receiveUser,
                        user: userId,
                        replied_at: dateTime,
                        type: type
                    }),
                    headers: { "Content-Type": "application/json" }
                });
            const body = await response.json();
            if (response.status !== 200) throw Error(body.message);
            if (body.status === "OK") {
                this.refs.user_sendmsg.value = '';
            }
            else {
                alert("Error Occured Try again later");
            }
        }
    }
    handleClickUserMsg = async (recid,sendid) => {
        const userMsgs = [];
        const _this = this;
        axios.get('/api/userMessages', {
            params: {
                rec_user: recid,
                send_user: sendid,
                type: "single"
            }
        }).then(function (response) {
            const responsedata = response.data.data;
            const usersData = _this.state.otherUsers;
            const allMsgedUsers = [];
            responsedata.map(function (item, i) {
                const rec_uid = item.receiveduser_id;
                const send_uid = item.senduser_id;
                let recName,sendName = "",msgType,receiverID;
                const userID = _this.props.states.userRowIndex;
                const loggedUser = localStorage.getItem('loggedUserName');
                if(parseInt(rec_uid)!==parseInt(userID) ){
                    const findUserRowIndex = usersData.map(function (e) { return e.id; }).indexOf(rec_uid);
                    recName = usersData[findUserRowIndex].name;
                    sendName = loggedUser ;
                    msgType  = "send";
                    receiverID = rec_uid;

                }else{
                    recName   = localStorage.getItem('loggedUserName');
                    const findUserRowIndex = usersData.map(function (e) { return e.id; }).indexOf(send_uid);
                    if(usersData[findUserRowIndex]!==undefined){
                        sendName = usersData[findUserRowIndex].name;
                    }
                    msgType  = "receive";
                    receiverID = send_uid ;
                }
                const msgStatus = item.msg_status;
                userMsgs.push({ "send_msg": item.send_msg, "reply_msg": item.reply_msg, "receiver_id": receiverID, "msg_rec_name": recName,"msg_send_name":sendName,"id": item.id, "msg_status": msgStatus, "send_at": item.created_at,"msg_type":msgType });
                allMsgedUsers.push(receiverID);
            });
            _this.setState({ selectedUserMsgs: userMsgs });
            const receiveMsgSection = _this.refs.receiveMsgSection;
            const puserMsgSection = _this.refs.puserMsgSection;
            const userMsgSection = _this.refs.userMsgSection;
            receiveMsgSection.style.display = "none";
            userMsgSection.style.display = "none";
            puserMsgSection.style.display = "block";
        })
            .catch(function (error) {
                console.log(error);
            });
    }
    handleSelectedUser = () => {
        const userMsgs = this.state.selectedUserMsgs;
        if (userMsgs.length > 0) {
            this.refs.selected_user_id.setAttribute('data-ruser', userMsgs[0].receiver_id);
            this.refs.selected_user_id.setAttribute('data-last-msg-status', userMsgs[userMsgs.length-1].msg_status);
            return userMsgs[0].msger_name;
        }
    }
    checkEmptyMsg = (msg,type) => {
        if (msg !== "") {
            return <p className={type+"_message"}>{msg}</p>;
        }
    }
    checkMsgedUser = (checkmsgType,senderName,receiverName)=>{
        let displayUser,addClass ;
        if(checkmsgType==="send"){
            displayUser = receiverName;
            addClass  = "sender";
        }else{
            displayUser = senderName;
            addClass   ="receiver"
        }
        return   <p className={addClass+" username"}>{displayUser}</p>;
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
                            <li className="send active" ref="send" onClick={this.handleClickTab.bind(this, 'send')}><span className="tab"><i className="fa fa-envelope" aria-hidden="true"></i> Users</span></li>
                            <li className="receive" ref="inbox" onClick={this.handleClickTab.bind(this, 'inbox')}><span className="tab" ><i className="fa fa-envelope-open" aria-hidden="true"></i> Messages</span></li>
                        </ul>
                    </div>
                    <div className="tabs_content" >
                        <section ref="userMsgSection">
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
                            <ul className="list-group list-group-flush msg_lists">
                                {this.state.userMsgs.map(usermsg =>
                                    <li key={usermsg.id}  className={usermsg.msg_type+ " list-group-item"}  data-send-id={usermsg.sender_id} data-receive-id={usermsg.receiver_id} onClick={() => this.handleClickUserMsg(usermsg.receiver_id,usermsg.sender_id)}>
                                     {this.checkMsgedUser(usermsg.msg_type,usermsg.msg_send_name,usermsg.msg_rec_name)}
                                    <span className="usermsg">{usermsg.send_msg}</span></li>
                                )}
                            </ul>
                        </section>
                        <section ref="puserMsgSection" id="puserMsgSection">
                            <ul className="list-group list-group-flush user_msgs">
                                <li className="list-group-item" ref="selected_user_id">{this.handleSelectedUser()}</li>
                                {this.state.selectedUserMsgs.map(usermsg =>
                                    <li key={usermsg.id}  className="list-group-item">
                                        {this.checkEmptyMsg(usermsg.send_msg,usermsg.msg_type)}
                                        {this.checkEmptyMsg(usermsg.reply_msg,usermsg.msg_type)}
                                    </li>
                                )}
                            </ul>
                            <div className="row">
                                <div className="col-md-9">
                                    <textarea rows="2" cols="25" ref="user_sendmsg"></textarea>
                                </div>
                                <div className="col-md-3">
                                    <button type="button" className="btn btn-primary" onClick={this.handleClickReplyMsg.bind(this)}><i className="fa fa-send" aria-hidden="true"></i></button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}
export default UsersChat;