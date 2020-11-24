import React, { Component } from 'react';
import NavMenu from "../../components/navmenu";
import Link from 'next/link';

class Logout extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        localStorage.removeItem('user');
    }

    render() {
        return (
            <div>
                <NavMenu></NavMenu>
                <div style={{textAlign: 'center', marginTop: '10vh'}}>
                <h1>You have successfully logged out.</h1>
                <Link href='/'><a>return to the home page</a></Link>
                </div>
            </div>
        );
    }
}

export default Logout
