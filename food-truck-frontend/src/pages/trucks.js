import React from 'react';
import {useRouter} from "next/router";
import NavMenu from "./navmenu";
import { useCookies } from 'react-cookie';
import TruckTable from '../components/truckTable';

require('dotenv').config();

function Trucks() {
    const [cookies, setCookie] = useCookies(['sessionUser']);

    if (cookies.sessionUser === undefined) {
        // console.log('redirecting');
    }

    return (
        <div>
            <NavMenu></NavMenu>
            <h2 style={{textAlign: 'center'}}>Trucks</h2>

            <TruckTable></TruckTable>
        </div>
    )
}



export default Trucks
