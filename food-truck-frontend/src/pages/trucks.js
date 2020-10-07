import React from 'react';
import Link from '@material-ui/core/Link';
import {useRouter} from "next/router";
import { useHistory } from 'react-router-dom';
import NavMenu from "./navmenu";
import user from './utils/user.js';
import { useCookies } from 'react-cookie';
import TruckTable from './truckTable';

require('dotenv').config();

function Trucks() {
    const router = useRouter();
    const [cookies, setCookie] = useCookies(['sessionUser']);

    if (cookies.sessionUser === undefined) {
        // console.log('redirecting');
    }

    // function getTruckData() {
    //     var trucks;
    //     const xhr = new XMLHttpRequest();
    //     xhr.open('GET', 'http://localhost:8080/trucks', true);

    //     xhr.onloadend = function() {
    //         if (xhr.status === 200) {
    //             if (xhr.responseText === "") {
    //                 console.log("could not get trucks");
    //             } else {
    //                 console.log("got trucks");
    //                 trucks = JSON.parse(xhr.responseText);
    //             }
    //         } else {
    //             console.log("could not connect to server");
    //         }
    //     };
    //     xhr.send();
    // }

    // getTruckData();
    return (
        <div>
            <NavMenu></NavMenu>
            <h2 style={{textAlign: 'center'}}>Trucks</h2>

            <TruckTable></TruckTable>
        </div>
    )
}



export default Trucks
