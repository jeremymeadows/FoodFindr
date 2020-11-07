import React from 'react';
import NavMenu from "../../components/navmenu";

function Logout() {
    localStorage.removeItem('user');

    return (
        <div>
            <NavMenu></NavMenu>
            <div style={{textAlign: 'center', marginTop: '10vh'}}>
            <h1>You have successfully logged out.</h1>
            <a href='/'>return to the home page</a>
            </div>
        </div>
    );
}

export default Logout
