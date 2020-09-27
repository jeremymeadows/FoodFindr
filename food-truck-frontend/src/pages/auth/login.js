import React from 'react';
import Link from '@material-ui/core/Link';
import {useRouter} from "next/router";
import sha256 from 'js-sha256';
import NavMenu from "../navmenu";

require('dotenv').config();

function Login() {
    function login() {
        var email = document.getElementById("email").value;
        var passw = sha256(email + document.getElementById("passw").value);
        
        var login_cred = email + ';' + passw;
        console.log(login_cred);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/login', true);

        xhr.onloadend = function() {
            var res = document.getElementById("login_result");
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("invalid email or password");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "invalid email or password";
                } else {
                    console.log("login success");
                    res.style = "color: green, display: inline;";
                    res.innerHTML = xhr.responseText + " was logged in successfully";
                    window.location = "../dashboard";

                    if (document.getElementById("remember").checked) {
                        var d = new Date();
                        document.cookie = "session=" + passw + ';' + (d.getTime() + (14 * 24 * 60 * 60 * 1000)) + ';';
                    } else {
                        document.cookie = "session=" + xhr.responseText + ';';
                    }
                }
            } else {
                console.log("could not connect to server");
                res.style = "color: red; display: block;";
                res.innerHTML = "could not connect to server";
            }
        };
        xhr.send(login_cred);
    };

    function create_acc() {
        window.location = "register";
    }

    return (
        <div>
            <div>
                <NavMenu></NavMenu>
            </div>
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <h1>Food Truck Finder</h1>

                <input id="email" type="text" placeholder="email"/><br/>
                <input id="passw" type="password" placeholder="password"/><br/>

                <input id="remember" type="checkbox"/>
                <label for="remember">remember me</label><br/>
                
                <p style={{display: 'inline', color: 'red'}} id="login_result"><br/></p>
                <button onClick={login}>login</button><br/>
                or<br/>
                <button onClick={create_acc}>create account</button>
            </div>
        </div>
    )
}

export default Login
