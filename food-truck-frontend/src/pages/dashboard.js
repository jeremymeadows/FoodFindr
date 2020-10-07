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

    return (
        <div>
            <NavMenu></NavMenu>
            <h2 style={{textAlign: 'center'}}>This is { cookies.sessionUser }'s dashboard!</h2>
        </div>
    )
}



export default Dashboard
