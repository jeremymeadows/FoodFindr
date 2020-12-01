import React, { Component } from 'react';
import sha256 from "js-sha256";
import NavMenu from "../components/navmenu";
import host from '../util/network.js'
import {SelectButton} from "primereact/selectbutton";
import {Rating} from "primereact/rating";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import RecTrucks from "../components/recommendedTruckTable";

class ManageAccount extends Component {
    constructor() {
        super();

        this.state = {
            user: null,
            price: null,
            rtg: null,
            food: null
        };
        this.editPassword = this.editPassword.bind(this);
        this.editUsername = this.editUsername.bind(this);
        this.update_preferences = this.update_preferences.bind(this);
        this.priceSelect = [
            {name: '$', value: 1},
            {name: '$$', value: 2},
            {name: '$$$', value: 3}
        ];
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

    update_preferences(){
        var id_passed = this.state.user.id;
        var price = this.state.price;
        var rating = this.state.rtg;
        var foodtype = this.state.food;

        var sendMessage = id_passed + ';' + price + ';' + rating + ';' + foodtype;
        console.log("updating price with " + price + "\nrating with " + rating
            + "food type with " + foodtype + "\nfor user: " + id_passed);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', host + 'dashboard/preferences', true);

        xhr.onloadend = function() {
            var res = document.getElementById("update_preferences_result");
            if(xhr.status == 200) {
                if(xhr.responseText == "") {
                    console.log("could not update preferences");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not update preferences";
                } else {
                    console.log("preferences updated successfully");
                    res.style = "color: green; display: block;";
                    res.innerHTML = "preferences updated successfully";
                }
            }
            console.log("status returned: " + xhr.status);
        };
        xhr.send(sendMessage);
    }

    render() {
        return (
            <div>
                <div>
                    <NavMenu></NavMenu>
                    <h2 style={{textAlign: 'center'}}>Manage Account</h2>
                </div>
                <div className="card" style={{textAlign: 'center', marginTop: '20px'}}>
                    <p style={{display: 'inline', color: 'red', marginTop: '10px'}} id="pref_result"><br/></p>
                    <SelectButton style={{marginTop: '10px'}} value={this.state.price} optionLabel="name" options={this.priceSelect} onChange={(e) => this.setState({price: e.value })}/>
                    <Rating style={{marginTop: '10px'}} value={this.state.rtg} onChange={(e) => this.setState({rtg: e.value})}/>
                    <InputText style={{marginTop: '10px'}} placeholder="Favorite Food" id="food_type" value={this.state.food} onChange={(e) => this.setState({food: e.target.value})} />
                    <p style={{display: 'inline', color: 'red'}} id="update_preferences_result"><br/></p>
                    <Button className="p-button-text" style={{marginTop: '10px'}} onClick={this.update_preferences}>Update Preferences</Button><br/><br/>
                </div>
                <div className="card" style={{textAlign: 'center', marginTop: '20px'}}>
                    <InputText style={{marginTop: '10px'}}  id="oldusername" type="text" placeholder="Old Username"/><br/>
                    <InputText style={{marginTop: '10px'}}  id="newusername" type="text" placeholder="New Username"/><br/>
                    <p style={{display: 'inline', color: 'red'}} id="user_result"><br/></p>
                    <Button className="p-button-text" style={{marginTop: '5px'}} onClick={this.editUsername}>Edit Username</Button><br/>
                </div>
                <div className="card" style={{textAlign: 'center', marginTop: '20px'}}>
                    <InputText style={{marginTop: '10px'}} id="oldpassword" type="text" placeholder="Old Password"/><br/>
                    <InputText style={{marginTop: '10px'}} id="newpassword" type="text" placeholder="New Password"/><br/>
                    <p style={{display: 'inline', color: 'red'}} id="login_result"><br/></p>
                    <Button className="p-button-text" style={{marginTop: '5px'}} onClick={this.editPassword}>Edit Password</Button><br/>
                </div>
            </div>
        );
    }
}

export default ManageAccount
