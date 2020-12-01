import React from 'react';
import NavMenu from "../components/navmenu";

function HomePage() {
    return (
        <div>
            <NavMenu></NavMenu>
            <div style={{textAlign: 'center', marginTop: '10vh'}}>
                <h1>Food Truck Finder</h1>
                <h2>Welcome to the Home Page!</h2>
            </div>
            <div>
                <center>
                    <h3>About Us</h3>
                    <p>Food Truck Finder was created in the fall of 2020 to make finding food trucks fast,</p>
                    <p>efficient and effortless. Its founders are Jeremy Meadows, John Harrison, Matthew Morrison </p>
                    <p>and Katie Wokoek. We hope that our site makes
                    finding food trucks a fun and pleasant experience!</p>
                </center>
            </div>
        </div>
    );
}

export default HomePage;
