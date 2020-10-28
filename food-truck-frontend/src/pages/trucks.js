//package food-truck-api/src/main/java/food/truck/api/truck;

import React from 'react';
import {useRouter} from "next/router";
import NavMenu from "../components/navmenu";
import { useCookies } from 'react-cookie';
import TruckTable from '../components/truckTable';
import user from "./utils/user";

require('dotenv').config();

function Trucks() {
    const [cookies, setCookie] = useCookies(['sessionUser']);

    if (cookies.sessionUser === undefined) {
        // console.log('redirecting');
    }

    function createFoodTruck() {
        var name = document.getElementById("truckname").value;
        var description = document.getElementById("truckdescription").value;
        var rating = document.getElementById("rating").value;

        var truck_cred = name + ';' + description + ';' + rating;
        console.log(truck_cred);
        //var id = Integer.toHexString(truck_cred.hashCode()).substring(0, 8);

        //var truck = new Truck(id, name, description, rating);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/trucks/create', true);

        xhr.onloadend = function() {
            var res = document.getElementById("create_truck_result");
            //Since POST return for create is 201, wouldn't we want the status to be 201?
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

                    setCookie('sessionUser', xhr.responseText.split('_')[0]);
                    user.id = xhr.responseText;
                    console.log(cookies.sessionUser);
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

    function manageTruck() {
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

                    setCookie('sessionUser', xhr.responseText.split('_')[0]);
                    user.id = xhr.responseText;
                    console.log(cookies.sessionUser);
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

    function manageSchedule() {
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

                    setCookie('sessionUser', xhr.responseText.split('_')[0]);
                    user.id = xhr.responseText;
                    console.log(cookies.sessionUser);
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

    return (
        <div>
            <NavMenu></NavMenu>
            <h2 style={{textAlign: 'center'}}>Trucks</h2>
            <TruckTable></TruckTable>

            <div style={{textAlign: 'center', marginTop: '10vh'}}>
                <input id="truckname" type="text" placeholder="Truck Name"/><br/>
                <input id="truckdescription" type="text" placeholder="Truck Description"/><br/>
                <input id="rating" type="text" placeholder="Rating"/><br/>
                <p style={{display: 'inline', color: 'red'}} id="create_truck_result"><br/></p>
                <button onClick={createFoodTruck}>Create Food Truck</button><br/>
            </div>
            <div style={{textAlign: 'center', marginTop: '10vh'}}>
                <input id="oldtruckname" type="text" placeholder="Truck Name"/><br/>
                <input id="oldtruckdescription" type="text" placeholder="Truck Description"/><br/>
                <input id="oldrating" type="text" placeholder="Rating"/><br/>
                <input id="truckid" type="text" placeholder="Truck ID"/><br/>
                <p style={{display: 'inline', color: 'red'}} id="manage_truck_result"><br/></p>
                <button onClick={manageTruck}>Edit Food Truck</button><br/>
            </div>
            <div style={{textAlign: 'center', marginTop: '10vh'}}>
                <input id="truck_id" type="text" placeholder="Truck ID"/><br/>
                <input id="schedule" type="text" placeholder="Truck Schedule"/><br/>
                <p style={{display: 'inline', color: 'red'}} id="schedule_truck_result"><br/></p>
                <button onClick={manageSchedule}>Edit Food Truck Schedule</button><br/>
            </div>


        </div>
    )
}



export default Trucks
