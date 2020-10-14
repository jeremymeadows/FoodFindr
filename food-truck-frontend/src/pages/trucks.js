//package food-truck-api/src/main/java/food/truck/api/truck;

import React from 'react';
import {useRouter} from "next/router";
import NavMenu from "./navmenu";
import { useCookies } from 'react-cookie';
import TruckTable from '../components/truckTable';
import user from "./utils/user";
//import Truck from "../../../food-truck-api/src/main/java/food/truck/api/truck/Truck.java";

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
        var name = document.getElementById("truckname").value;
        var description = document.getElementById("truckdescription").value;
        var rating = document.getElementById("rating").value;
        var id = document.getElementById("id").value;

        var truck_cred = name + ';' + description + ';' + rating + ';' + id;
        console.log(truck_cred);
        //var id = Integer.toHexString(truck_cred.hashCode()).substring(0, 8);

        //var truck = new Truck(id, name, description, rating);
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', 'http://localhost:8080/trucks/managetruck', true);

        xhr.onloadend = function() {
            var res = document.getElementById("manage_truck_result");
            //Since POST return for create is 201, wouldn't we want the status to be 201?
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("could not update truck");
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

    var isOwner = "1";

    function findOwnership() {
        // Find out if the user navigating the page is a truck owner
        const ownerRequest = new XMLHttpRequest();
        ownerRequest.open('POST', 'http://localhost:8080/getOwnership/');
        ownerRequest.onloadend = function () {
            console.log(ownerRequest.status);
            if (ownerRequest.status == 200) {
                if (ownerRequest.responseText == "") {
                    console.log("Could not find the current user");
                } else {
                    console.log("Found user status: " + ownerRequest.responseText);
                    isOwner = ownerRequest.responseText;
                }
            }
        };
        ownerRequest.send("johnr.harrison@att.net");

        if(isOwner === "1"){return 1;}
        return 0;
    }

    return (
        <div>
            <NavMenu></NavMenu>
            <h2 style={{textAlign: 'center'}}>Trucks</h2>
            <TruckTable></TruckTable>

            <div style={{textAlign: 'center', marginTop: '10vh'}}>
                { findOwnership() &&
                    <>
                    <input id="truckname" type="text" placeholder="Truck Name"/><br/>
                    <input id="truckdescription" type="text" placeholder="Truck Description"/><br/>
                    <input id="rating" type="text" placeholder="Rating"/><br/>
                    <p style={{display: 'inline', color: 'red'}} id="create_truck_result"><br/></p>
                    <button onClick={createFoodTruck}>Create Food Truck</button><br/>
                    </>
                }
            </div>
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <input id="truckname" type="text" placeholder="Truck Name"/><br/>
                <input id="truckdescription" type="text" placeholder="Truck Description"/><br/>
                <input id="rating" type="text" placeholder="Rating"/><br/>
                <input id="id" type="text" placeholder="Truck ID"/><br/>
                <p style={{display: 'inline', color: 'red'}} id="manage_truck_result"><br/></p>
                <button onClick={manageTruck}>Edit Food Truck</button><br/>
            </div>


        </div>
    )
}



export default Trucks
