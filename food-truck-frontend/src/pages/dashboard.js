import React from 'react';
import Link from '@material-ui/core/Link';
import {useRouter} from "next/router";
import { useHistory } from 'react-router-dom';
import NavMenu from "./navmenu";
import user from './utils/user.js';
import { useCookies } from 'react-cookie';

require('dotenv').config();

function Dashboard() {
    const router = useRouter();
    const [cookies, setCookie] = useCookies(['sessionUser']);

    console.log(cookies.sessionUser);
    if (cookies.sessionUser === undefined) {
        console.log('redirecting');
    }

    function get_info(){
        var name = cookies.sessionUser;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/dashboard', true);

        xhr.onloadend=function(){
            var res = document.getElementById("info_result");
            if(xhr.status == 200){
                if(xhr.responseText === ""){
                    console.log("user's email not found in database");
                    res.style = "color: black; display: block;";
                    res.innerHTML = "email not found in database";
                } else {
                    console.log("information found");
                    res.style = "color: black, display: inline;";
                    user.username = name;

                    var owner = xhr.responseText.split(';')[2], is_owner;
                    if(owner == 1) is_owner = "yes";
                    else is_owner = "no";

                    res.innerHTML = "username: " + xhr.responseText.split(';')[0]
                    + "<br />" + "email: " + xhr.responseText.split(';')[1] +
                        "<br />" + "truck owner: " + is_owner;
                }
            }
        };
        xhr.send(name);

    }

    function send_message() {
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

                    /**
                    setCookie('sessionUser', xhr.responseText.split('_')[0]);
                    user.id = xhr.responseText;
                    console.log(cookies.sessionUser);
                     **/
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

    function is_truck_owner() {
        var name = cookies.sessionUser;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/dashboard/ownercheck', true);

        xhr.onloadend=function(){
            var res = document.getElementById("owner_result");
            if(xhr.status == 200){
                if(xhr.responseText === ""){
                    console.log("user's email not found in database");
                    res.style = "color: black; display: block;";
                    res.innerHTML = "email not found in database";
                } else {
                    console.log("information found");
                    res.style = "color: black, display: inline;";
                    user.username = name;

                    var owner = xhr.responseText, is_owner;
                    if(owner == 1) is_owner = "yes";
                    else is_owner = "no";
                    return is_owner;
                }
            }
        };
        xhr.send(name);
    }

    function get_message(){

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/dashboard/getmessage', true);

        xhr.onloadend=function(){
            var res = document.getElementById("get_message_result");
            if(xhr.status == 200){
                if(xhr.responseText === ""){
                    console.log("user's email not found in database");
                    res.style = "color: black; display: block;";
                    res.innerHTML = "email not found in database";
                } else {
                    console.log("information found");
                    res.style = "color: black, display: inline;";
                    user.username = name;

                    while (xhr.responseText.split(';')) {
                        res.innerHTML = "message: " + xhr.responseText.split(';') + "<br />";
                    }
                }
            }
        };
        xhr.send();

    }

    return (
        <div>
            <NavMenu></NavMenu>
            <h2 style={{textAlign: 'center'}}>This is { cookies.sessionUser }'s dashboard!</h2>

            <p style={{display: 'inline', color: 'black'}} id="info_result"><br/></p>
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <button onClick={get_info}>View Profile</button>
            </div>
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <p style={{display: 'inline', color: 'red'}} id="get_message_result"><br/></p>
                <button onClick={get_message}>View Messages</button>
            </div>
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <input id="message" type="text" placeholder="Type your message here."/><br/>
                <input id="truck_id_message" type="text" placeholder="Truck ID of subscribers you want to message."/><br/>
                <p style={{display: 'inline', color: 'red'}} id="send_message_result"><br/></p>
                <button onClick={send_message}>Send Message</button>
            </div>
        </div>
    )
}



export default Dashboard
