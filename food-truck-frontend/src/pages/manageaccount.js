import React from 'react';
import Link from '@material-ui/core/Link';
import {useRouter} from "next/router";
import { useHistory } from 'react-router-dom';
import NavMenu from "./navmenu";
import user from './utils/user.js';
import { useCookies } from 'react-cookie';
import sha256 from "js-sha256";

require('dotenv').config();

function Manageaccount() {
    const [cookies, setCookie] = useCookies(['sessionUser']);

    function editPassword() {
        var email = cookies.sessionUser;

        if (document.getElementById("oldpassword").value === document.getElementById("newpassword").value) {
            document.getElementById("login_result").innerHTML = "password didn't change";
            return;
        }

        var oldPassword = sha256(email + document.getElementById("oldpassword").value);
        var newPassword = sha256(email + document.getElementById("newpassword").value);



        var new_login = email + ';' + newPassword + ';' + oldPassword;
        console.log(new_login);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/manageaccount', true);

        xhr.onload = function() {
            var res = document.getElementById("login_result");
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("invalid email or password");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "invalid email or password";
                } else {
                    console.log("old password is correct");
                    res.style = "color: green, display: inline;";
                    user.username = email;
                    res.innerHTML = xhr.responseText + " changing password";
                    window.location = "../manageaccount";

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
        xhr.send(new_login);
    };

    function editUsername() {
        var email = cookies.sessionUser;

        if (document.getElementById("oldusername").value === document.getElementById("newusername").value) {
            document.getElementById("user_result").innerHTML = "username didn't change";
            return;
        }

        var newUsername = document.getElementById("newusername").value;

        var new_username = email + ';' + newUsername;
        console.log(new_username);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/manageaccount/username', true);

        xhr.onload = function() {
            var res = document.getElementById("user_result");
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("invalid email or username");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "invalid email or username";
                } else {
                    console.log("changing username");
                    res.style = "color: green, display: inline;";
                    user.username = email;
                    res.innerHTML = xhr.responseText + " changing username";
                    window.location = "../manageaccount/username";

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
        xhr.send(new_username);
    };


    return (
        <div>
            <div>
                <NavMenu></NavMenu>

                <h2 style={{textAlign: 'center'}}>Manage Account Data</h2>
                <h3 style={{textAlign: 'center'}}>You can edit your username and password here.</h3>
            </div>
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <input id="oldusername" type="text" placeholder="Old Username"/><br/>
                <input id="newusername" type="text" placeholder="New Username"/><br/>
                <p style={{display: 'inline', color: 'red'}} id="user_result"><br/></p>
                <button onClick={editUsername}>Edit Username</button><br/>

            </div>
            <div style={{textAlign: 'center', marginTop: '10vh'}}>
                <input id="oldpassword" type="text" placeholder="Old Password"/><br/>
                <input id="newpassword" type="text" placeholder="New Password"/><br/>
                <p style={{display: 'inline', color: 'red'}} id="login_result"><br/></p>
                <button onClick={editPassword}>Edit Password</button><br/>

            </div>
        </div>
    )
}

export default Manageaccount;