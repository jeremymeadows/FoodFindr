import React from 'react';
import sha256 from 'js-sha256';
import NavMenu from "../../components/navmenu";
import host from '../../util/network';

function Register() {
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
        xhr.open('POST', host.login, true);

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

                    var ustr = xhr.responseText.split(';');
                    var user = {
                        name: ustr[0],
                        email: ustr[1],
                        id: ustr[2],
                        owner: ustr[3] == '0' ? false : true
                    };
                    console.log(user);
                    localStorage.setItem('user', JSON.stringify(user));
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

                {/* <input id="remember" type="checkbox"/>
                <label htmlFor="remember">remember me</label><br/> */}

                <input id="owner" type="checkbox"/>
                <label htmlFor="owner">I am a truck owner</label><br/>

                <p style={{display: 'inline', color: 'red'}} id="login_result"><br/></p>
                <button onClick={register}>create account</button>
            </div>
        </div>
    );
}

export default Register
