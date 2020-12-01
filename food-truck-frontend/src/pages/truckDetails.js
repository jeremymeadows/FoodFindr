import React, { Component } from 'react';
import NavMenu from '../components/navmenu';
import PrimeReact from 'primereact/utils';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Checkbox } from 'primereact/checkbox';
import {InputTextarea} from "primereact/inputtextarea";
import host from '../util/network.js'

class TruckDetails extends Component {
    constructor() {
        super();

        this.state = {
            user: null,
            truck: null,
            map: null
        };
        this.sub = this.sub.bind(this);
        this.unsub = this.unsub.bind(this);
        this.getMap = this.getMap.bind(this);
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

    async getMap() {
        // Store the key to the mapquest api
        const key = 'HvhBy6rdLPqZkmPnsEa4fMS95IDRRo2K';
        // Initialize the url
        let url = "https://www.mapquestapi.com/staticmap/v5/map?key=" + key
        let center_and_truck_loc = "&center="

        await fetch('http://localhost:8080/truck/location/'
            + window.location.href.split('?')[1].split('=')[1])
            .then( res => res.text())
            .then( function(text){
                    let address = text.replaceAll(" ","");
                    center_and_truck_loc += address;
                    center_and_truck_loc += '&locations=';
                    center_and_truck_loc += address;
            })

        url = url + center_and_truck_loc;
        console.log(url);
        return url;
    }

    async componentDidMount() {
        this.state.user = JSON.parse(localStorage.getItem('user'));

        await fetch(host + 'truck/' + window.location.href.split('?')[1].split('=')[1])
            .then(res => res.json())
            .then(json => this.state.truck = json);

        console.log(this.state.truck);

        if (this.state.user !== null) {
            await fetch(host + 'user/' + this.state.user.id)
                .then(res => res.json())
                .then(json => this.state.truck.sub = json.includes(this.state.truck.id));
        }

        await(this.getMap())
            .then(url => this.state.map = url);

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
        const map = this.state.map;

        return (
            <div style={{marginBottom: '60px'}}>
                <NavMenu></NavMenu>
                <img src={map} width={"400px"} height={"400px"}/>
                { truck !== null && <div>
                    <h2 style={{textAlign: 'center'}}>{truck.name}</h2>
                    <h3 style={{textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', maxWidth: '1000px'}}>{truck.description}</h3>

                    { user !== null && <span>
                        { truck.sub && <div style={{textAlign: 'center'}}>
                            <Button onClick={this.unsub}>Unsubscribe</Button>
                        </div> }
                        { !truck.sub && <div style={{textAlign: 'center'}}>
                            <Button className="p-button-outlined" onClick={this.sub}>Subscribe</Button>
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
                        <InputTextarea autoResize style={{marginTop: '10px'}} id="review" placeholder="Write your review here" rows="4" cols="50">
                        </InputTextarea>
                        <p style={{display: 'inline', color: 'red'}} id="review_result"><br/></p>
                        <Button className="p-button-text" onClick={this.review}>Post Review</Button>
                        <br/>
                    </div> }
                </div> }
            </div>
        );
    }
}

export default TruckDetails
