import React, { Component } from 'react';
import { Button } from 'primereact/button';
import NavMenu from "../components/navmenu";
import TruckTable from '../components/truckTable';
import {InputTextarea} from "primereact/inputtextarea";
import host from '../util/network.js'

class Trucks extends Component {
    constructor() {
        super();

        this.state = {
            user: null,
            isOwner: 0
        };
        this.createFoodTruck = this.createFoodTruck.bind(this);
        this.manageTruck = this.manageTruck.bind(this);
        this.manageSchedule = this.manageSchedule.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.review = this.review.bind(this);
    }

    componentDidMount() {
        let json = localStorage.getItem('user');
        if (json !== null) {
            this.state.user = JSON.parse(localStorage.getItem('user'));
            this.forceUpdate();
        }
    }

    subscribe() {
        var truck_id = document.getElementById("truck").value;
        var subInfo = this.state.user.id + ';' + truck_id;

        console.log(subInfo);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', host + 'subscribe');
        xhr.onloadend = function () {
            console.log(xhr.status);
            if (xhr.status == 200) {
                if (xhr.responseText == "") {
                    console.log("could not subscribe to truck");
                } else {
                    console.log("Subscribed to truck " + xhr.responseText);
                }
            }
        }
        xhr.send(subInfo);
    };

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

    review() {
        var user_id = this.state.user.id;
        var truck_name = document.getElementById("truck_name").value;
        var rating = document.getElementById("rating").value;
        var review = document.getElementById("review").value;

        var review_cred = user_id + ';' + truck_name + ';' + rating + ';' + review;
        console.log(review_cred);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', host + 'trucks/review', true);

        xhr.onloadend = function() {
            var res = document.getElementById("review_result");
            if (xhr.responseText === "") {
                console.log("could not write review");
                res.style = "color: red; display: block;";
                res.innerHTML = "could not write review";
            } else {
                console.log("create truck success");
                res.style = "color: green, display: inline;";
                res.innerHTML = "Rating for " + xhr.responseText + " was written successfully";
                window.location = "../trucks";
            }
        };
        xhr.send(review_cred);
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

    render() {
        const user = this.state.user;

        return (
            <div>
                <NavMenu></NavMenu>
                <h2 style={{textAlign: 'center'}}>Trucks</h2>
                <TruckTable></TruckTable>
            </div>
        );
    }
}

export default Trucks
