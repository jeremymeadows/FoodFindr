import React, { Component } from 'react';
import NavMenu from "../components/navmenu";
import TruckTable from '../components/truckTable';

class Trucks extends Component {
    constructor() {
        super();

        this.state = {
            user: null
        };
        this.createFoodTruck = this.createFoodTruck.bind(this);
        this.manageTruck = this.manageTruck.bind(this);
        this.manageSchedule = this.manageSchedule.bind(this);
    }

    componentDidMount() {
        this.state.user = JSON.parse(localStorage.getItem('user'));
        if (this.state.user === null) {
            window.location = 'auth/login';
        }
        this.forceUpdate();
    }

    createFoodTruck() {
        var name = document.getElementById("truckname").value;
        var description = document.getElementById("truckdescription").value;
        var rating = document.getElementById("rating").value;

        var truck_cred = name + ';' + description + ';' + rating;
        console.log(truck_cred);
        //var id = Integer.toHexString(truck_cred.hashCode()).substring(0, 8);

        //var truck = new Truck(id, name, description, rating);
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', 'http://localhost:8080/trucks/create', true);

        xhr.onloadend = function() {
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
                }
                else {
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
        //var id = Integer.toHexString(truck_cred.hashCode()).substring(0, 8);

        //var truck = new Truck(id, name, description, rating);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/trucks/manage', true);

        xhr.onloadend = function() {
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
                }
                else {
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
        //var id = Integer.toHexString(truck_cred.hashCode()).substring(0, 8);

        //var truck = new Truck(id, name, description, rating);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/trucks/schedule', true);

        xhr.onloadend = function() {
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
                }
                else {
                    console.log("could not connect to server");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not connect to server";
                }
            }
        };
        xhr.send(truck_cred);
    };

    function subscribe() {
        var truck_id = document.getElementById("truckid").value;

        console.log(subInfo);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/subscribe');
        xhr.onloadend = function() {
            console.log(xhr.status);
            if(xhr.status == 200) {
                if(xhr.responseText == "") {
                    console.log("could not subscribe to truck");
                } else {
                    console.log("Subscribed to truck " + xhr.responseText);
                }
            }
        }
        xhr.send(truck_id);
    }

    render() {
        const user = this.state.user;

        return (
            <div>
                <NavMenu></NavMenu>
                <h2 style={{textAlign: 'center'}}>Trucks</h2>
                <TruckTable></TruckTable>

                { user !== null && <div>
                    <div style={{textAlign: 'center', marginTop: '10vh'}}>
                        { this.state.user.owner &&
                            <>
                            <input id="truckname" type="text" placeholder="Truck Name"/><br/>
                            <input id="truckdescription" type="text" placeholder="Truck Description"/><br/>
                            <input id="rating" type="text" placeholder="Rating"/><br/>
                            <p style={{display: 'inline', color: 'red'}} id="create_truck_result"><br/></p>
                            <button onClick={this.createFoodTruck}>Create Food Truck</button><br/>
                            </>
                        }
                    </div>
                    <div style={{textAlign: 'center', marginTop: '10vh'}}>
                        <input id="oldtruckname" type="text" placeholder="Truck Name"/><br/>
                        <input id="oldtruckdescription" type="text" placeholder="Truck Description"/><br/>
                        <input id="oldrating" type="text" placeholder="Rating"/><br/>
                        <input id="truckid" type="text" placeholder="Truck ID"/><br/>
                        <p style={{display: 'inline', color: 'red'}} id="manage_truck_result"><br/></p>
                        <button onClick={this.manageTruck}>Edit Food Truck</button><br/>
                    </div>
                    <div style={{textAlign: 'center', marginTop: '10vh'}}>
                        <input id="truck_id" type="text" placeholder="Truck ID"/><br/>
                        <input id="schedule" type="text" placeholder="Truck Schedule"/><br/>
                        <p style={{display: 'inline', color: 'red'}} id="schedule_truck_result"><br/></p>
                        <button onClick={this.manageSchedule}>Edit Food Truck Schedule</button><br/>
                    </div>
                </div> }
            </div>
        );
    }
}

export default Trucks
