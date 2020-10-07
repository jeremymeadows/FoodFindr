import React from 'react';
import Link from '@material-ui/core/Link';
import {useRouter} from "next/router";
import NavMenu from "./navmenu";
import db from "Docker/sql_dump.sql";
//import FoodTruckApplication from "food-truck-api/src/main/java/food.truck.api/FoodTruckApplication";

require('dotenv').config();

function Dashboard() {

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

    return (
        <div>
            <NavMenu></NavMenu>
            <h2>This is the dashboard!</h2>
            <button onClick={getTruckInfo}>Truck Info</button><br/>
        </div>
    )
}

export default Dashboard