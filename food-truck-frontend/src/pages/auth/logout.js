import React from 'react';
import Link from '@material-ui/core/Link';
import {useRouter} from "next/router";
import sha256 from 'js-sha256';
import NavMenu from "../../components/navmenu";
import user from '../utils/user';
import { useCookies, Cookies } from 'react-cookie';
import HomePage from '../homepage';

require('dotenv').config();

function Logout() {
    const [cookies, setCookie, removeCookie] = useCookies(['sessionUser']);
    setCookie('sessionUser', "");
    removeCookie('sessionUser');
    user.id = "";
    
    return (
        <div>
            <NavMenu></NavMenu>
            <div style={{textAlign: 'center', marginTop: '10vh'}}>
            <h1>You have successfully logged out.</h1>
            <a href='/'>return to the home page</a>
            </div>
        </div>
    )
}

export default Logout
