import React, { Component } from 'react';
import NavMenu from "../components/navmenu";

class Dashboard extends Component {
    constructor() {
        super();

        this.state = {
            user: null
        }
        this.get_info = this.get_info.bind(this);
        this.get_message = this.get_info.bind(this);
        this.send_message = this.send_message.bind(this);
    }

    componentDidMount() {
        this.state.user = JSON.parse(localStorage.getItem('user'));
        if (this.state.user === null) {
            window.location = 'auth/login';
        }
        this.forceUpdate();
    }

    get_info() {
    }

    get_message() {
        var name = cookies.sessionUser;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/dashboard/messages', true);

        xhr.onloadend = function(){
            var res = document.getElementById("message_result");
            if(xhr.responseText == "") {
                console.log("user's email not found in database");
                res.style = "color: black; display: block;";
                res.innerHTML = "email not found in database";
            } else {
                var owner = xhr.responseText.split(';');
                console.log(xhr.responseText)

                res.innerHTML = "";
                for(var i = 0; i < xhr.responseText.split(';').length-1; i++) {
                    res.innerHTML += xhr.responseText.split(';')[i]
                        + "<br />";
                }
            }
        };
        xhr.send(name);
    }

    send_message() {
        var message = document.getElementById("message").value;
        var id = document.getElementById("truck_id_message").value;

        var owner_message = message + ';' + id;
        console.log(owner_message);

        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', 'http://localhost:8080/dashboard/message', true);

        xhr.onloadend = function() {
            var res = document.getElementById("send_message_result");
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("could not send message");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not send message";
                } else {
                    console.log("send message success");
                    res.style = "color: green, display: inline;";
                    res.innerHTML = xhr.responseText + " was sent successfully";
                    window.location = "../dashboard";
                }
            } else {
                if (res === null) {
                    console.log("Res returned NULL");
                }
                else {
                    console.log("could not connect to server");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not connect to server";
                }
            }
        };
        xhr.send(owner_message);
    }

<<<<<<< HEAD
    function is_truck_owner() {
        var name = cookies.sessionUser;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/dashboard/ownercheck', true);

        xhr.onloadend=function(){
            var res = document.getElementById("owner_result");
            if(xhr.status == 200){
                if(xhr.responseText === ""){
                    console.log("user's email not found in database");
                    res.style = "color: black; display: block;";
                    res.innerHTML = "email not found in database";
                } else {
                    console.log("information found");
                    res.style = "color: black, display: inline;";
                    user.username = name;

                    var owner = xhr.responseText, is_owner;
                    if(owner == 1) is_owner = "yes";
                    else is_owner = "no";
                    return is_owner;
                }
            }
        };
        xhr.send(name);
    }

    return (
        <div>
            <NavMenu></NavMenu>
            <h2 style={{textAlign: 'center'}}>This is { cookies.sessionUser }'s dashboard!</h2>

            <p style={{display: 'inline', color: 'black'}} id="info_result"><br/></p>
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <button onClick={get_info}>View Profile</button>
            </div>

            <p style={{display: 'inline', color: 'black'}} id="message_result"><br/></p>
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <button onClick={get_messages}>Get Messages</button>
            </div>
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <input id="message" type="text" placeholder="Type your message here."/><br/>
                <input id="truck_id_message" type="text" placeholder="Truck ID of subscribers you want to message."/><br/>
                <p style={{display: 'inline', color: 'red'}} id="send_message_result"><br/></p>
                <button onClick={send_message}>Send Message</button>
=======
    render() {
        const user = this.state.user;

        return (
            <div>
                <NavMenu></NavMenu>
                { user !== null && <div>
                    <h2 style={{textAlign: 'center'}}>Welcome, { user.name }!</h2>

                    <p>
                        username: { user.name }<br/>
                        email: { user.email }<br/>
                        id: { user.id }<br/>
                        owner: { user.owner ? 'true' : 'false' }<br/>
                    </p>
                    { user.owner && <div>
                        <h3>My Trucks:(TODO)</h3>
                    </div> }

    				<p style={{display: 'inline', color: 'black'}} id="info_result"><br/></p>
    				<div style={{textAlign: 'center', marginTop: '20px'}}>
    					<button onClick={this.get_info}>View Profile</button>
    				</div>
    				<div style={{textAlign: 'center', marginTop: '20px'}}>
    					<p style={{display: 'inline', color: 'red'}} id="get_message_result"><br/></p>
    					<button onClick={this.get_message}>View Messages</button>
    				</div>
                    { user.owner && <div style={{textAlign: 'center', marginTop: '20px'}}>
                        <input id="message" type="text" placeholder="Type your message here."/><br/>
                        <input id="truck_id_message" type="text" placeholder="Truck ID of subscribers you want to message."/><br/>
                        <p style={{display: 'inline', color: 'red'}} id="send_message_result"><br/></p>
                        <button onClick={this.send_message}>Send Message</button>
                    </div> }
                </div> }
>>>>>>> master
            </div>
        );
    }
}

export default Dashboard
