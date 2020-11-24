import React, { Component } from 'react';
import NavMenu from '../components/navmenu';

class TruckDetails extends Component {
    constructor() {
        super();

        this.state = {
            user: null,
            truck: null
        };
        this.sub = this.sub.bind(this);
        this.unsub = this.unsub.bind(this);
    }

    async sub() {
        const options = {
            method: 'POST',
            body: this.state.user.id + ';' + this.state.truck.id,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        await fetch('http://localhost:8080/subscribe', options)
            .then(res => this.state.truck.sub = true)
            .then(() => this.forceUpdate());
    }

    async unsub() {
        const options = {
            method: 'POST',
            body: this.state.user.id + ';' + this.state.truck.id,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        await fetch('http://localhost:8080/unsubscribe', options)
            .then(res => this.state.truck.sub = false)
            .then(() => this.forceUpdate());
    }

    async componentDidMount() {
        this.state.user = JSON.parse(localStorage.getItem('user'));

        await fetch('http://localhost:8080/truck/' + window.location.href.split('?')[1].split('=')[1])
            .then(res => res.json())
            .then(json => this.state.truck = json);

        if (this.state.user !== null) {
            await fetch('http://localhost:8080/user/' + this.state.user.id)
                .then(res => res.json())
                .then(json => this.state.truck.sub = json.includes(this.state.truck.id));
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
                    { user !== null && <span>
                        { truck.sub && <div style={{textAlign: 'center'}}>
                            <button onClick={this.unsub}>unsubscribe</button>
                        </div> }
                        { !truck.sub && <div style={{textAlign: 'center'}}>
                            <button onClick={this.sub}>subscribe</button>
                        </div>}
                    </span> }

                    <p>Todo:
                    map, menu, schedule
                    </p>

                    { user !== null && !user.owner &&
                        <div style={{textAlign: 'center', marginTop: '10vh'}}>
                        <p style={{display: 'inline', color: 'red'}} id="rtg"><br/></p>
                        <label htmlFor="cost">Rating: </label>
                        <select id="rating" name="cost">
                            <option value="nopref">None</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select><br/>
                        <textarea id="review" placeholder="Write your review here" rows="4" cols="50">
                        </textarea>
                        <p style={{display: 'inline', color: 'red'}} id="review_result"><br/></p>
                        <button onClick={this.review}>Post Review</button>
                        <br/>
                    </div> }
                </div> }
            </div>
        );
    }
}

export default TruckDetails
