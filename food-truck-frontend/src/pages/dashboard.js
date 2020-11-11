import React, { Component } from 'react';
import NavMenu from "../components/navmenu";

class Dashboard extends Component {
    constructor() {
        super();

        this.state = {
            user: null
        }
        this.get_info = this.get_info.bind(this);
        this.get_message = this.get_message.bind(this);
        this.send_message = this.send_message.bind(this);
        this.update_preferences = this.update_preferences.bind(this);
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
        var name = this.state.user.name;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/dashboard/messages', true);

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

    update_preferences(){
        var id_passed = this.state.user.id;
        var price = document.getElementById("cost").value;
        var rating = document.getElementById("rating").value;
        var foodtype = document.getElementById("food_type").value;

        var sendMessage = id_passed + ';' + price + ';' + rating + ';' + foodtype;
        console.log("updating price with " + price + "\nrating with " + rating
            + "food type with " + foodtype + "\nfor user: " + id_passed);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/dashboard/preferences', true);

        xhr.onloadend = function() {
            var res = document.getElementById("update_preferences_result");
            console.log("status returned: " + xhr.status);
        };
        xhr.send(sendMessage);
    }

    render() {
        const user = this.state.user;

        return (
            <div>
                <NavMenu></NavMenu>
                { user !== null && <div>
                    <h2 style={{textAlign: 'center'}}>Welcome, { user.name }!</h2>

                    { user.owner && <div>
                        <h3>My Trucks:(TODO)</h3>
                    </div> }

    				<p style={{display: 'inline', color: 'black'}} id="info_result"><br/></p>
    				<div style={{textAlign: 'center', marginTop: '20px'}}>
    					<button onClick={this.get_info}>View Profile</button>
    				</div>
    				<div style={{textAlign: 'center', marginTop: '20px'}}>
    					<p style={{display: 'inline', color: 'black'}} id="message_result"><br/></p>
    					<button onClick={this.get_message}>View Messages</button>
    				</div>
                    { user.owner && <div style={{textAlign: 'center', marginTop: '20px'}}>
                        <input id="message" type="text" placeholder="Type your message here."/><br/>
                        <input id="truck_id_message" type="text" placeholder="Truck ID of subscribers you want to message."/><br/>
                        <p style={{display: 'inline', color: 'red'}} id="send_message_result"><br/></p>
                        <button onClick={this.send_message}>Send Message</button>
                    </div> }
                    { !user.owner && <div style={{textAlign: 'center', marginTop: '20px'}}>
                        <p style={{display: 'inline', color: 'red'}} id="pref_result"><br/></p>
                        <label htmlFor="cost">Choose a price: </label>
                        <select id="cost" name="cost">
                            <option value="nopref">None</option>
                            <option value="1">$</option>
                            <option value="2">$$</option>
                            <option value="3">$$$</option>
                        </select><br />
                        <label htmlFor="rating">Choose a star rating: </label>
                        <select id="rating" name="rating">
                            <option value="nopref">None</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select><br />
                        <label htmlFor="food_type">Choose a food type: </label>
                        <input id="food_type" type="text" placeholder="preferred food type here"/><br/>
                        <p style={{display: 'inline', color: 'red'}} id="update_preferences_result"><br/></p>
                        <button onClick={this.update_preferences}>Update Preferences</button>
                    </div> }
                </div> }
            </div>
        );
    }
}

export default Dashboard
