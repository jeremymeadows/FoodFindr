import React, { Component } from 'react';
import sha256 from "js-sha256";
import NavMenu from "../components/navmenu";
import { Button } from 'primereact/button';
import PrimeReact from 'primereact/utils';
import { SelectButton } from 'primereact/selectbutton';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import host from '../util/network.js'

class ManageAccount extends Component {
    constructor() {
        super();

        this.state = {
            user: null
        };
        this.editPassword = this.editPassword.bind(this);
        this.editUsername = this.editUsername.bind(this);
    }

    componentDidMount() {
        this.state.user = JSON.parse(localStorage.getItem('user'));
        if (this.state.user === null) {
            window.location = 'auth/login';
        }
        this.forceUpdate();
    }

    editPassword() {
        if (document.getElementById("oldpassword").value === document.getElementById("newpassword").value) {
            document.getElementById("login_result").innerHTML = "password didn't change";
            return;
        }

        var oldPassword = sha256(email + document.getElementById("oldpassword").value);
        var newPassword = sha256(email + document.getElementById("newpassword").value);

        var new_login = email + ';' + newPassword + ';' + oldPassword;
        console.log(new_login);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', host + 'manageaccount', true);

        xhr.onload = function() {
            var res = document.getElementById("login_result");
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("invalid email or password");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "invalid email or password";
                } else {
                    console.log("old password is correct");
                    res.style = "color: green, display: inline;";
                    user.username = email;
                    res.innerHTML = xhr.responseText + " changing password";
                    window.location = "../manageaccount";
                }
            } else {
                console.log("could not connect to server");
                res.style = "color: red; display: block;";
                res.innerHTML = "could not connect to server";
            }
        };
        xhr.send(new_login);
    };

    editUsername() {
        if (document.getElementById("oldusername").value === document.getElementById("newusername").value) {
            document.getElementById("user_result").innerHTML = "username didn't change";
            return;
        }

        var email = this.state.user.email;
        var newUsername = document.getElementById("newusername").value;

        var new_username = email + ';' + newUsername;
        console.log(new_username);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', host + 'manageaccount/username', true);

        xhr.onload = function() {
            var res = document.getElementById("user_result");
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("invalid email or username");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "invalid email or username";
                } else {
                    console.log("changing username");
                    res.style = "color: green, display: inline;";
                    res.innerHTML = xhr.responseText + " changing username";
                    window.location = "../manageaccount";

                    var ustr = xhr.responseText.split(';');
                    var user = {
                        name: ustr[0],
                        email: ustr[1],
                        id: ustr[2],
                        owner: ustr[3] == '0' ? false : true
                    };
                    console.log(user);
                    localStorage.setItem('user', JSON.stringify(user));
                }
            } else {
                console.log("could not connect to server");
                res.style = "color: red; display: block;";
                res.innerHTML = "could not connect to server";
            }
        };
        xhr.send(new_username);
    };

    render() {
        return (
            <div>
                <div>
                    <NavMenu></NavMenu>
                    <h2 style={{textAlign: 'center'}}>Manage Account Data</h2>
                    <h3 style={{textAlign: 'center'}}>You can edit your username and password here.</h3>
                </div>
                <div style={{textAlign: 'center', marginTop: '30vh'}}>
                    <InputText id="oldusername" type="text" placeholder="Old Username"/><br/>
                    <InputText id="newusername" type="text" placeholder="New Username"/><br/>
                    <p style={{display: 'inline', color: 'red'}} id="user_result"><br/></p>
                    <Button className="p-button-text" onClick={this.editUsername}>Edit Username</Button><br/>
                </div>
                <div style={{textAlign: 'center', marginTop: '10vh'}}>
                    <InputText id="oldpassword" type="text" placeholder="Old Password"/><br/>
                    <InputText id="newpassword" type="text" placeholder="New Password"/><br/>
                    <p style={{display: 'inline', color: 'red'}} id="login_result"><br/></p>
                    <Button className="p-button-text" onClick={this.editPassword}>Edit Password</Button><br/>
                </div>
            </div>
        );
    }
}

export default ManageAccount
