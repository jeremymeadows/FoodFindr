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
        this.review = this.review.bind(this);
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

        await fetch('http://localhost:8080/user/' + this.state.user.id)
            .then(res => res.json())
            .then(json => this.state.truck.sub = json.includes(this.state.truck.id));

        if (this.state.user === null) {
            window.location = 'auth/login';
        }
        this.forceUpdate();
    }

    review() {
        var user_id = this.state.user.id;
        var truck_id = this.state.truck.id;
        var rating = document.getElementById("rating").value;
        var review = document.getElementById("review").value;

        var review_cred = user_id + ';' + truck_id + ';' + rating + ';' + review;
        console.log(review_cred);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8080/trucks/review', true);

        xhr.onloadend = function() {
            var res = document.getElementById("review_result");
            if (xhr.responseText === "") {
                console.log("could not write review");
                res.style = "color: red; display: block;";
                res.innerHTML = "could not write review";
            } else {
                console.log("create truck success");
                res.style = "color: green, display: inline;";
                res.innerHTML = "Rating for " + xhr.responseText + " was written successfully";
                window.location = "../trucks";
            }
        };
        xhr.send(review_cred);
    };

    render() {
        const user = this.state.user;
        const truck = this.state.truck;

        return (
            <div>
                <NavMenu></NavMenu>
                { truck !== null && <div>
                    <h2 style={{textAlign: 'center'}}>{truck.name}</h2>
                    <h3 style={{textAlign: 'center'}}>{truck.description}</h3>

                    { truck.sub && <div style={{textAlign: 'center'}}>
                        <button onClick={this.unsub}>unsubscribe</button>
                    </div> }
                    { !truck.sub && <div style={{textAlign: 'center'}}>
                        <button onClick={this.sub}>subscribe</button>
                    </div>}

                    { user !== null && <div>
                        <p>Todo:
                        map, menu, schedule
                        </p>
                    </div> }

                    {!this.state.user.owner &&
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
