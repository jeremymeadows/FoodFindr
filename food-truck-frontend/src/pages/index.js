import React from 'react';
import Link from '@material-ui/core/Link';

require('dotenv').config();

function HomePage() {    
    function login() {
        var uname = document.getElementById("uname").value;
        var passw = document.getElementById("passw").value;
        var r = '{"uname":"' + uname + '","passw":"' + passw + '"}';
        console.log(r);
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://127.0.0.1:8080/ping', true);
        
        xhr.onloadend = function() {
            console.log(xhr);
            return;
        };
        xhr.send(r);
    };
    
    return (
        <div style={{textAlign: 'center', marginTop: '30vh'}}>
            <h1>This is the home page!</h1>
            
            <input id="uname" type="text" placeholder="username"/><br/>
            <input id="passw" type="password" placeholder="password"/><br/>
            <button onClick={login}>submit</button>
        </div>
    )
}

export default HomePage
