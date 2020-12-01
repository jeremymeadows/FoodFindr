import React, { Component } from 'react';
import NavMenu from '../components/navmenu';
import host from '../util/network.js'

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

        await fetch(host + 'subscribe', options)
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

        await fetch(host + 'unsubscribe', options)
            .then(res => this.state.truck.sub = false)
            .then(() => this.forceUpdate());
    }

    async componentDidMount() {
        this.state.user = JSON.parse(localStorage.getItem('user'));

        await fetch(host + 'truck/' + window.location.href.split('?')[1].split('=')[1])
            .then(res => res.json())
            .then(json => this.state.truck = json);

        if (this.state.user !== null) {
            await fetch(host + 'user/' + this.state.user.id)
                .then(res => res.json())
                .then(json => this.state.truck.sub = json.includes(this.state.truck.id));
        }

        this.forceUpdate();
    }

    review() {
        var user_id = this.state.user.id;
        var truck_id = this.state.truck.id;
        var rating = document.getElementById("rating").value;
        var review = btoa(document.getElementById("review").value);

        var review_cred = user_id + ';' + truck_id + ';' + rating + ';' + review;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', host + 'trucks/review', true);

        xhr.onloadend = function() {
            var res = document.getElementById("review_result");
            if (xhr.responseText === "") {
                console.log("could not write review");
                res.style = "color: red; display: block;";
                res.innerHTML = "could not write review";
            } else {
                console.log("review success");
                res.style = "color: green, display: inline;";
                res.innerHTML = "Rating for " + xhr.responseText + " was written successfully";
            }
        };
        xhr.send(review_cred);
    };

    render() {
        const user = this.state.user;
        const truck = this.state.truck;

        return (
            <div style={{marginBottom: '60px'}}>
                <NavMenu></NavMenu>
                { truck !== null && <div>
                    <h2 style={{textAlign: 'center'}}>{truck.name}</h2>
                    <h3 style={{textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', maxWidth: '1000px'}}>{truck.description}</h3>

                    { user !== null && <span>
                        { truck.sub && <div style={{textAlign: 'center'}}>
                            <button onClick={this.unsub}>unsubscribe</button>
                        </div> }
                        { !truck.sub && <div style={{textAlign: 'center'}}>
                            <button onClick={this.sub}>subscribe</button>
                        </div> }
                    </span> }

                    <p>Todo:
                    map, schedule
                    </p>
                    { truck.menu !== 'null' &&
                        <embed src={truck.menu} width="800px" height="800px"/>
                    }
                    { truck.menu === 'null' &&
                        <p>no menu provided</p>
                    }

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
