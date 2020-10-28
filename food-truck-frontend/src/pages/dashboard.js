import React from 'react';
import Link from '@material-ui/core/Link';
import {useRouter} from "next/router";
import { useHistory } from 'react-router-dom';
import NavMenu from "../components/navmenu";
import user from './utils/user.js';
import { useCookies } from 'react-cookie';

import host from './utils/network';

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
        xhr.open('POST', host.dashboard, true);

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
    
    return (
        <div>
            <NavMenu></NavMenu>
            <h2 style={{textAlign: 'center'}}>This is { cookies.sessionUser }'s dashboard!</h2>

            <p style={{display: 'inline', color: 'black'}} id="info_result"><br/></p>
            <div style={{textAlign: 'center', marginTop: '30vh'}}>
                <button onClick={get_info}>View Profile</button>
            </div>
        </div>
    )
}



export default Dashboard
