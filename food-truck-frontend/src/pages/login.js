import React from 'react';
import Link from '@material-ui/core/Link';
import {useRouter} from "next/router";
import NavMenu from "./navmenu";

require('dotenv').config();

function Login() {
    const router = useRouter();
    return (
        <div>
            <NavMenu></NavMenu>
            <h2>This is the login screen!</h2>
        </div>
    )
}

export default Login