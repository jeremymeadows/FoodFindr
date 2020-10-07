import React from 'react';
import Link from '@material-ui/core/Link';
import {useRouter} from "next/router";
import { useHistory } from 'react-router-dom';
import NavMenu from "./navmenu";
import user from './utils/user.js';
import { useCookies } from 'react-cookie';

require('dotenv').config();

function Dashboard() {
<<<<<<< HEAD
    const router = useRouter();
    const [cookies, setCookie] = useCookies(['sessionUser']);


    console.log(cookies.sessionUser);
    if (cookies.sessionUser === undefined) {
        console.log('redirecting');
    }

    function getTruckInfo() {
        let db = openDatabase('food-truck-finder', '1.0', 'Trucks', 'sizeofdatabase');
        db.transaction(function(transaction) {
            //still can't find trucks?
            transaction.executeSql('SELECT * FROM trucks;', [],
                function(transaction, resultSet) {
                let length = resultSet.rows.length;
                let i;
                for (i = 0; i < length; i++) {
                    alert(results.rows.item(i).log);
                }
            }, errorHandler); //need some sort of error handling...
        });

    };
>>>>>>> 3ddfd3c68b1f13f4044828ea98406ecee4eab7a7

    return (
        <div>
            <NavMenu></NavMenu>
<<<<<<< HEAD
            <h2 style={{textAlign: 'center'}}>This is { cookies.sessionUser }'s dashboard!</h2>

            <button onClick={getTruckInfo}>Truck Info</button><br/>
>>>>>>> 3ddfd3c68b1f13f4044828ea98406ecee4eab7a7
        </div>
    )
}



export default Dashboard
