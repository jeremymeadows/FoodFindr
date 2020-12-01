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
            unread: 0
        }
        this.get_info = this.get_info.bind(this);
        this.send_message = this.send_message.bind(this);
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

    get_info() {
        var email = this.state.user.email;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/dashboard', true);

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
        var price = this.state.price;
        var rating = this.state.rtg;
        var foodtype = this.state.food;

        var sendMessage = id_passed + ';' + price + ';' + rating + ';' + foodtype;
        console.log("updating price with " + price + "\nrating with " + rating
            + "food type with " + foodtype + "\nfor user: " + id_passed);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/dashboard/preferences', true);

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
            <div>
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
                        <InputText id="truck_id_message" type="text" value={this.state.truck} onChange={(e) => this.setState({truck: e.target.value})} placeholder="Truck ID"/><br/>
                        <p style={{display: 'inline', color: 'red'}} id="send_message_result"><br/></p>
                        <InputTextarea placeholder="Message" value={this.state.message} onChange={(e) => this.setState({message: e.target.value})} rows={1} cols={30} autoResize />
                        <br/>
                        <Button className="p-button-text" onClick={this.send_message}>Send Message</Button>
                    </div> }
                    { !user.owner && <div className="card" style={{textAlign: 'center', marginTop: '20px'}}>
                        <p style={{display: 'inline', color: 'red', marginTop: '10px'}} id="pref_result"><br/></p>
                        <SelectButton style={{marginTop: '10px'}} value={this.state.price} optionLabel="name" options={this.priceSelect} onChange={(e) => this.setState({price: e.value })}/>
                        <Rating style={{marginTop: '10px'}} value={this.state.rtg} onChange={(e) => this.setState({rtg: e.value})}/>
                        <InputText style={{marginTop: '10px'}} placeholder="Favorite Food" id="food_type" value={this.state.food} onChange={(e) => this.setState({food: e.target.value})} />
                        <p style={{display: 'inline', color: 'red'}} id="update_preferences_result"><br/></p>
                        <Button className="p-button-text" style={{marginTop: '10px'}} onClick={this.update_preferences}>Update Preferences</Button><br/><br/>
                        <RecTrucks></RecTrucks>
                    </div> }
                </div> }
            </div>
        );
    }
}

export default Dashboard
