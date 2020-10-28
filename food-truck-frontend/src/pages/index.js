import React from 'react';
import ReactDOM from 'react-dom';
import Link from '@material-ui/core/Link';
import NavMenu from "../components/navmenu";
import {useRouter} from "next/router";

require('dotenv').config();

function HomePage() {
    return (
        <div>
            <NavMenu></NavMenu>
            <div style={{textAlign: 'center', marginTop: '10vh'}}>
            <h1>Food Truck Finder</h1>
            Welcome to the Home Page!
            </div>
        </div>
    )
}

export default HomePage;

//ReactDOM.render(<HomePage />, document.getElementById('root'));
