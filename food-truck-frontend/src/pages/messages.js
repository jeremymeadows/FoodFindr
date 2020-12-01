import React, { Component } from 'react';
import { Button } from 'primereact/button';
import NavMenu from "../components/navmenu";
import RecTrucks from '../components/recommendedTruckTable';
import PrimeReact from 'primereact/utils';
import { SelectButton } from 'primereact/selectbutton';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';

PrimeReact.ripple = true;

class Messages extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            unread: null
        }
        this.get_message = this.get_message.bind(this);
        this.delete_message = this.delete_message.bind(this);
        this.get_unread_count = this.get_unread_count.bind(this);
    }

    componentDidMount() {
        this.state.user = JSON.parse(localStorage.getItem('user'));
        if (this.state.user === null) {
            window.location = 'messages';
        }
        this.get_unread_count();
        this.forceUpdate();
    }

    get_message() {
        var name = this.state.user.name;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/messages', true);

        xhr.onloadend = function(){
            var res = document.getElementById("message_result");
            if(xhr.responseText == "") {
                console.log("No messages to display");
                res.style = "color: black; display: block;";
                res.innerHTML = "No messages to display";
            } else {
                var owner = xhr.responseText.split(';');
                console.log(xhr.responseText)

                res.innerHTML = "";
                for(var i = 0; i < xhr.responseText.split(';').length-1; i++) {
                    res.innerHTML += xhr.responseText.split(';')[i]
                        + "<br /><br />";
                }
            }
        };
        xhr.send(name);
    }

    delete_message() {
        var user_id = this.state.user.id;
        const xhr = new XMLHttpRequest();

        xhr.open('POST', 'http://localhost:8080/messages/delete');
        xhr.onloadend = function() {
            var res = document.getElementById("delete_result");
            if(xhr.status == 200) {
                if(xhr.responseText == "") {
                    console.log("could not delete messages");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not delete messages";
                } else {
                    console.log("delete message success");
                    res.style = "color: green, display: inline;";
                    res.innerHTML = "messages were deleted successfully";
                    window.location = "../messages";
                }
            }
        }
        xhr.send(user_id);
    }

    get_unread_count() {
        var id = this.state.user.id;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/messages/unread', true);
        xhr.onloadend = function() {
            if(xhr.status == 200) {
                if(xhr.responseText == "") {
                    console.log("could not retrieve message count");
                } else {
                    console.log("messages found: " + xhr.responseText);
                }
            }
        }
        xhr.send(id);
    }

    render() {
        const user = this.state.user;

        return (
            <div>
                <NavMenu></NavMenu>

                { user !== null && <div>
                    <h2 style={{textAlign: 'center'}}>Welcome, { user.name }!</h2>

                    <div style={{textAlign: 'center', marginTop: '20px'}}>
                        <p style={{display: 'inline', color: 'black'}} id="message_result"><br/></p>
                        <Button onClick={this.get_message} label="View Messages" className="p-button-text"/>
                    </div>
                    <div style={{textAlign: 'center', marginTop: '0px'}}>
                        <p style={{display: 'inline', color: 'black'}} id="delete_result"><br/></p>
                        <Button onClick={this.delete_message} label="Delete Read Messages" className="p-button-text"/>
                    </div>
                </div> }
            </div>
        );
    }
}

export default Messages