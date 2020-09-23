import React from 'react';
import Link from '@material-ui/core/Link';
import HomePage from "./homepage";

require('dotenv').config();

<<<<<<< HEAD
ReactDOM.render(<HomePage />, document.getElementById('root'));
=======
function HomePage() {
    function login() {
        var email = document.getElementById("email").value;
        var passw = document.getElementById("passw").value;
        // TODO: has password for security
        var login_cred = email + ';' + passw;
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/login', true);
        
        xhr.onloadend = function() {
            var res = document.getElementById("login_result");
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("invalid email or password");
                    res.innerHTML = "invalid email or password";
                } else {
                    console.log("login success");
                    res.innerHTML = xhr.responseText + " was logged in successfully";
                }
            } else {
                console.log("could not connect to server");
                res.innerHTML = "could not connect to server";
            }
        };
        xhr.send(login_cred);
    };
    
    function create_acc() {
        console.log("TODO");
    }
    
    return (
        <div id="app">
            <div style={{textAlign: 'right', margin: '20px'}}>
                <button onClick={create_acc}>create account</button>
            </div>
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <h1>Food Truck Finder</h1>
                
                <input id="email" type="text" placeholder="email"/><br/>
                <input id="passw" type="password" placeholder="password"/><br/>
                <button onClick={login}>login</button>
                <p id="login_result"></p>
            </div>
        </div>
    )
}

export default HomePage
>>>>>>> 6167a5e874ef5b070203cc4ce898871ca32ef463
