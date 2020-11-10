import React, { Component } from 'react';
import { useLocation } from "react-router-dom";
import NavMenu from '../components/navmenu';

class TruckDetails extends Component {
    constructor() {
        super();

        this.state = {
            user: null,
            truck: null
        };
    }

    async componentDidMount() {
        this.state.user = JSON.parse(localStorage.getItem('user'));

        await fetch('http://localhost:8080/truck/' + window.location.href.split('?')[1].split('=')[1])
            .then(res => res.json())
            .then(json => this.state.truck = json);

        if (this.state.user === null) {
            window.location = 'auth/login';
        }
        this.forceUpdate();
    }

    render() {
        const user = this.state.user;
        const truck = this.state.truck;

        return (
            <div>
                <NavMenu></NavMenu>
                { truck !== null && <div>
                    <h2 style={{textAlign: 'center'}}>{truck.name}</h2>
                    <h3 style={{textAlign: 'center'}}>{truck.description}</h3>
                    { user !== null && <div>
                        <p>Todo:
                        map, menu, schedule
                        </p>
                    </div> }
                </div> }
            </div>
        );
    }
}

export default TruckDetails
