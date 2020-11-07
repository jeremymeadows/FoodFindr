import React from 'react';
import NavMenu from "../components/navmenu";

function HomePage() {
    return (
        <div>
            <NavMenu></NavMenu>
            <div style={{textAlign: 'center', marginTop: '10vh'}}>
                <h1>Food Truck Finder</h1>
                Welcome to the Home Page!
            </div>
        </div>
    );
}

export default HomePage;
