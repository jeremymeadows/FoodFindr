import React from 'react';
import Link from '@material-ui/core/Link';
import {useRouter} from "next/router";
import { useHistory } from 'react-router-dom';
import NavMenu from "./navmenu";
import user from './utils/user.js';
import { useCookies } from 'react-cookie';

require('dotenv').config();

function Manageaccount() {



    return (
        <div>
            <NavMenu></NavMenu>

        </div>
    )
}

export default Manageaccount;