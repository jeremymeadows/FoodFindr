import React, { Component } from 'react';
import NavMenu from "../components/navmenu";

class Dashboard extends Component {
    constructor() {
        super();

        this.state = {
            user: null
        }
    }

    componentDidMount() {
        this.state.user = JSON.parse(localStorage.getItem('user'));
        if (this.state.user === null) {
            window.location = 'auth/login';
        }
        this.forceUpdate();
    }

    render() {
        const user = this.state.user;

        return (
            <div>
                <NavMenu></NavMenu>
                { user !== null && <div>
                    <h2 style={{textAlign: 'center'}}>This is { user.name }'s dashboard!</h2>

                    <p>
                        username: { user.name }<br/>
                        email: { user.email }<br/>
                        id: { user.id }<br/>
                        owner: { user.owner ? 'true' : 'false' }<br/>
                    </p>
                    { user.owner && <div>
                        <h3>My Trucks:</h3>
                    </div> }
                </div> }
            </div>
        );
    }
}

export default Dashboard
