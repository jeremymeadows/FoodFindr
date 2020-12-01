import React, { Component } from 'react';
import { Button } from 'primereact/button';
import NavMenu from "../components/navmenu";
import RecTrucks from '../components/recommendedTruckTable';
import PrimeReact from 'primereact/utils';
import { SelectButton } from 'primereact/selectbutton';
import { Rating } from 'primereact/rating';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
import host from '../util/network.js'

PrimeReact.ripple = true;

class Dashboard extends Component {
    constructor() {
        super();

        this.state = {
            user: null,
            price: null,
            rtg: null,
            food: null,
            message: null,
            truck: null,
            unread: 0,
            isOwner: 0
        }
        this.get_info = this.get_info.bind(this);
        this.send_message = this.send_message.bind(this);
        this.update_preferences = this.update_preferences.bind(this);
        this.createFoodTruck = this.createFoodTruck.bind(this);
        this.manageTruck = this.manageTruck.bind(this);
        this.manageSchedule = this.manageSchedule.bind(this);
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

    get_info() {
        var email = this.state.user.email;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', host + 'dashboard', true);

        xhr.onloadend = function(){
            var res = document.getElementById("info_result");
            if(xhr.responseText == "") {
                console.log("No info to display");
                res.style = "color: black; display: block;";
                res.innerHTML = "No info to display";
            } else {
                console.log(xhr.responseText)
                //username + ';' + email_address + ';' + owner;

                var HTML = "<center><table style=\"background-color: #E5E5E5;\" border=\"0\"><tr><th>Profile</th></tr>";

                for(var i = 0; i < xhr.responseText.split(';').length-1; i++) {
                    if(i==0) {
                        HTML += "<tr><td>" + "Username: " + xhr.responseText.split(';')[i] + "</td></tr>";
                    } else {
                        HTML += "<tr><td>" + "Email: " + xhr.responseText.split(';')[i] + "</td></tr>";
                    }
                }
                if (xhr.responseText.split(';')[2] === 1) {
                    HTML += "<tr><td>" + "User is an Owner" + "</td></tr>";
                }
            }
        };
        xhr.send(email);
    }

    get_message() {
        var name = this.state.user.name;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', host + 'dashboard/messages', true);

        xhr.onloadend = function(){
            var res = document.getElementById("message_result");
            if(xhr.responseText == "") {
                console.log("No messages to display");
                res.style = "color: black; display: block;";
                res.innerHTML = "No messages to display";
            } else {
                var owner = xhr.responseText.split(';');
                console.log(xhr.responseText)
                HTML += "</table></center>";

                res.innerHTML = HTML;
            }
        };
        xhr.send(email);
    }

    send_message() {
        var message = this.state.message;
        var id = this.state.truck;

        var owner_message = message + ';' + id;
        console.log(owner_message);

        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', host + 'dashboard/message', true);

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

    delete_message() {
        var user_id = this.state.user.id;
        const xhr = new XMLHttpRequest();

        xhr.open('POST', host + 'dashboard/delete');
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
                    window.location = "../dashboard";
                }
            }
        }
        xhr.send(user_id);
    }

    createFoodTruck() {
        var name = document.getElementById("truckname").value;
        var description = document.getElementById("truckdescription").value;
        var rating = document.getElementById("rating").value;

        var truck_cred = name + ';' + description + ';' + rating;
        console.log(truck_cred);

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', host + 'trucks/create', true);

        xhr.onloadend = function () {
            var res = document.getElementById("create_truck_result");
            //Since POST return for create is 201, wouldn't we want the status to be 201?
            console.log(xhr.status);
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("could not create truck");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not create truck";
                } else {
                    console.log("create truck success");
                    res.style = "color: green, display: inline;";
                    res.innerHTML = xhr.responseText + " was created successfully";
                    window.location = "../trucks";
                }
            } else {
                if (res === null) {
                    console.log("Res returned NULL");
                } else {
                    console.log("could not connect to server");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not connect to server";
                }
            }
        };
        xhr.send(truck_cred);
    };

    manageTruck() {
        var name = document.getElementById("oldtruckname").value;
        var description = document.getElementById("oldtruckdescription").value;
        var rating = document.getElementById("oldrating").value;
        var id = document.getElementById("truckid").value;

        var truck_cred = name + ';' + description + ';' + rating + ';' + id;
        console.log(truck_cred);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', host + 'trucks/manage', true);

        xhr.onloadend = function () {
            var res = document.getElementById("manage_truck_result");
            //Since POST return for create is 201, wouldn't we want the status to be 201?
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("could not update truck");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not update truck";
                } else {
                    console.log("update truck success");
                    res.style = "color: green, display: inline;";
                    res.innerHTML = xhr.responseText + " was updated successfully";
                    window.location = "../trucks";
                }
            } else {
                if (res === null) {
                    console.log("Res returned NULL");
                } else {
                    console.log("could not connect to server");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not connect to server";
                }
            }
        };
        xhr.send(truck_cred);
    };

    manageSchedule() {
        var id = document.getElementById("truck_id").value;
        var schedule = document.getElementById("schedule").value;

        var truck_cred = id + ';' + schedule;
        console.log(truck_cred);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', host + 'trucks/schedule', true);

        xhr.onloadend = function () {
            var res = document.getElementById("schedule_truck_result");
            //Since POST return for create is 201, wouldn't we want the status to be 201?
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("could not update truck schedule");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not update truck schedule";
                } else {
                    console.log("update truck success");
                    res.style = "color: green, display: inline;";
                    res.innerHTML = xhr.responseText + " was updated successfully";
                    window.location = "../trucks";
                }
            } else {
                if (res === null) {
                    console.log("Res returned NULL");
                } else {
                    console.log("could not connect to server");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not connect to server";
                }
            }
        };
        xhr.send(truck_cred);
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
        const user = this.state.user;

        return (
            <div style={{marginBottom: '60px'}}>
                <NavMenu></NavMenu>

                { user !== null && <div>
                    <h2 style={{textAlign: 'center'}}>Welcome, { user.name }!</h2>

                    { user.owner && <div>
                        <h3>My Trucks:(TODO)</h3>
                    </div> }


                    <p style={{display: 'inline', color: 'black'}} id="info_result"><br/></p>
                    <div style={{textAlign: 'center', marginTop: '20px'}}>
                        <Button onClick={this.get_info} label="View Profile" className="p-button-text"/>
                    </div>
                    { user.owner && <div style={{textAlign: 'center', marginTop: '20px'}}>
                        <h2>Send Messages to My Trucks</h2>
                        <InputText id="truck_id_message" type="text" value={this.state.truck} onChange={(e) => this.setState({truck: e.target.value})} placeholder="Truck ID"/><br/>
                        <p style={{display: 'inline', color: 'red'}} id="send_message_result"><br/></p>
                        <InputTextarea placeholder="Message" value={this.state.message} onChange={(e) => this.setState({message: e.target.value})} rows={1} cols={30} autoResize />
                        <br/>
                        <Button className="p-button-text" onClick={this.send_message}>Send Message</Button>
                    </div> }

                    <div style={{textAlign: 'center', marginTop: '10vh'}}>
                        <h2>Manage My Trucks</h2>
                        { this.state.user.owner && <div>
                            <InputTextarea id="truckname" type="text" placeholder="Truck Name"/><br/>
                            <InputTextarea id="truckdescription" type="text" placeholder="Truck Description"/><br/>
                            <InputTextarea id="rating" type="text" placeholder="Rating"/><br/>
                            <p style={{display: 'inline', color: 'red'}} id="create_truck_result"><br/></p>
                            <Button onClick={this.createFoodTruck}>Create Food Truck</Button><br/>
                        </div> }
                    </div>
                    <div style={{textAlign: 'center', marginTop: '10vh'}}>
                        { this.state.user.owner && <div>
                            <InputTextarea id="oldtruckname" type="text" placeholder="Truck Name"/><br/>
                            <InputTextarea id="oldtruckdescription" type="text" placeholder="Truck Description"/><br/>
                            <InputTextarea id="oldrating" type="text" placeholder="Rating"/><br/>
                            <InputTextarea id="truckid" type="text" placeholder="Truck ID"/><br/>
                            <p style={{display: 'inline', color: 'red'}} id="manage_truck_result"><br/></p>
                            <Button onClick={this.manageTruck}>Edit Food Truck</Button><br/>
                        </div> }
                    </div>
                    <div style={{textAlign: 'center', marginTop: '10vh'}}>
                        { this.state.user.owner && <div>
                            <InputTextarea id="truck_id" type="text" placeholder="Truck ID"/><br/>
                            <InputTextarea id="schedule" type="text" placeholder="Truck Schedule"/><br/>
                            <p style={{display: 'inline', color: 'red'}} id="schedule_truck_result"><br/></p>
                            <Button onClick={this.manageSchedule}>Edit Food Truck Schedule</Button><br/>
                        </div> }
                    </div>

                    <div className="card" style={{textAlign: 'center', marginTop: '20px'}}>
                        <h2>Recommended Trucks</h2>
                        <RecTrucks></RecTrucks>
                    </div>
                </div> }
            </div>
        );
    }
}

export default Dashboard
