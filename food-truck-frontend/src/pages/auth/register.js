import React from 'react';
import Link from '@material-ui/core/Link';
import {useRouter} from "next/router";
import sha256 from 'js-sha256';
import NavMenu from "../navmenu";
import user from '../utils/user';
import { useCookies } from 'react-cookie';

require('dotenv').config();

function Register() {
    const [cookies, setCookie] = useCookies(['sessionUser']);

    function register() {
        var email = document.getElementById("email").value;
        var uname = document.getElementById("uname").value;
        var truck_owner = document.getElementById("truck").checked;

        if (document.getElementById("passw").value !== document.getElementById("conf").value) {
            document.getElementById("login_result").innerHTML = "password doesn't match";
            return;
        }
        var passw = sha256(email + document.getElementById("passw").value);
        var owner = document.getElementById("owner").value;

        var login_cred = email + ';' + uname + ';' + passw + ';' + truck_owner;
        console.log(login_cred);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/register', true);

        xhr.onloadend = function() {
            var res = document.getElementById("login_result");
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("could not create account");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not create account";
                } else {
                    console.log("login success");
                    res.style = "color: green, display: inline;";
                    res.innerHTML = xhr.responseText + " was created successfully";
                    window.location = "../dashboard";

                    setCookie('sessionUser', xhr.responseText.split('_')[0]);
                    user.id = xhr.responseText;
                    console.log(cookies.sessionUser);
                }
            } else {
                console.log("could not connect to server");
                res.style = "color: red; display: block;";
                res.innerHTML = "could not connect to server";
            }
        };
        xhr.send(login_cred);
    };

    return (
        <div>
            <div>
                <NavMenu></NavMenu>
            </div>
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <h1>Food Truck Finder</h1>

                <input id="email" type="text" placeholder="email"/><br/>
                <input id="uname" type="text" placeholder="username"/><br/>
                <br/>
                <input id="passw" type="password" placeholder="password"/><br/>
                <input id="conf" type="password" placeholder="confirm password"/><br/>

                <input id="owner" type="checkbox"/>
                <label htmlFor="owner">owner account</label><br/>

                {/* <input id="remember" type="checkbox"/>
                <label htmlFor="remember">remember me</label><br/> */}

                <input id="truck" type="checkbox"/>
                <label for="truck">I am a truck owner</label><br/>

                <p style={{display: 'inline', color: 'red'}} id="login_result"><br/></p>
                <button onClick={register}>create account</button>
            </div>
        </div>
    )
}

export default Register
