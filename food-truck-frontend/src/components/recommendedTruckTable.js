import React, { Component } from 'react';
import host from '../util/network.js'

class TruckTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            loading: true,
            trucks: [
                { id: '', name: '', description: '', rating: 0, subscribed: false, price: 0, type: '' }
            ],
            preferences: [
                {price: 0, rating: 0, type: ''}
            ],
            subs: []

        };
        this.getTrucks = this.getTrucks.bind(this);
        this.getNearby = this.getNearby.bind(this);
        this.sub = this.sub.bind(this);
    }

    async getTrucks() {
        console.log("getting trucks");

        await fetch(host + 'trucks')
            .then(res => res.json())
            .then(trucks => {
                console.log("got the trucks");
                if (trucks.length > 0) {
                    this.state.trucks = trucks;
                }
            });
        //console.log("OUT");

        console.log("getting subscriptions");
        let b = this.getSubscriptions().then(() => {
            this.forceUpdate();
        });
        let result = await b;

        /*this.getNearby().then(() => {
            this.forceUpdate();
        });*/

        let fetchData = {method: 'post', body: this.state.user.id};

        console.log("getting preferences");
        await fetch(host + '/dashboard/getpreferences', fetchData)
            .then(res => res.json())
            .then(pref => {
                let temp = JSON.stringify(pref);
                let list = temp.split(",");
                //console.log("PREF: " + list);

                if (list.length === 3) {
                    let size = list[0].length - 1;
                    //console.log("PR:" + list[0][size] + ":THIS");
                    this.state.preferences[0].price = parseInt(list[0][size]);
                    //console.log("PR:" + this.state.preferences[0].price + ":THIS");
                    size = list[1].length - 1;
                    //console.log("B: " + list[1][size]);
                    //console.log("B: " + list[2]);
                    this.state.preferences[0].rating = parseInt(list[1][size]);
                    let i = 0;
                    while (list[2][i] != ':') {
                        i++;
                    }
                    i = i + 2;
                    size = list[2].length - 3;
                    this.state.preferences[0].type = list[2].substring(i, size);
                    //console.log("TYPE: " + this.state.preferences[0].type);
                }
            }).catch(error => console.log(error));

        console.log("Rec algorithm ");
        let multipliers = [];
        let temptrucks = [];
        let alltrucks = []
        let cost = this.state.preferences[0].price;
        let rate = this.state.preferences[0].rating;
        let type = this.state.preferences[0].type;
        let iter = 0;
        //console.log("PRICE: " + this.state.preferences[0].price);
        if(this.state.preferences) {
            //console.log("Price Mult");
            this.state.trucks.forEach(function (truck) {
                //console.log("cost inside for: " + cost);
                //console.log("TRUCK PRICE: " + truck.price + " RATING: " + truck.rating);
                let multiplier = 4;
                let constval = 3;
                if (cost === truck.price) {
                    //console.log("ONE");
                    constval *= multiplier;
                    multipliers.push(constval);
                } else {
                    multiplier = 3;
                    if (truck.price === 3) {
                        constval = 1;
                        constval *= multiplier;
                        multipliers.push(constval);
                    }
                    else if (truck.price === 2) {
                        constval = 2;
                        constval *= multiplier;
                        multipliers.push(constval);
                    }
                    else {
                        constval = 3;
                        constval *= multiplier;
                        multipliers.push(constval);
                    }
                }
            });
            //console.log("MUL: " + multipliers);
            this.state.trucks.forEach(function (truck) {
                //console.log("rating inside for: " + rate);
                //console.log("RATING: " + truck.rating);
                let multiplier = 3;
                let constval = 5;
                if (rate === truck.rating) {
                    //console.log("ONE");
                    constval *= multiplier;
                    multipliers[iter] += constval;
                } else {
                    multiplier = 2;
                    if (truck.rating === 5) {
                        constval *= multiplier;
                        multipliers[iter] += constval;
                    } else if (truck.rating === 4) {
                        constval = 4;
                        constval *= multiplier;
                        multipliers[iter] += constval;
                    } else if (truck.rating === 3) {
                        constval = 3;
                        constval *= multiplier;
                        multipliers[iter] += constval;
                    } else if (truck.rating === 2) {
                        constval = 2;
                        constval *= multiplier;
                        multipliers[iter] += constval;
                    } else {
                        constval = 1;
                        constval *= multiplier;
                        multipliers[iter] += constval;
                    }
                }
                iter++;
            });
            iter = 0;
            let subscriptions = [];
            for (let i = 0; i < this.state.subs.length; i++) {
                //console.log("S: " + this.state.subs);
                subscriptions.push(this.state.subs[i]);
            }
            this.state.trucks.forEach(function (truck) {
                //console.log("SUBS: " + subscriptions);
                if (subscriptions.includes(truck.id)) {
                    console.log("Subscribed");
                    multipliers[iter] += 10;
                }
                iter++;
            });
            iter = 0;
            type = this.state.preferences[0].type;
            this.state.trucks.forEach(function (truck) {
                //console.log("TYPE: " + truck.type);
                if (type === truck.type) {
                    //console.log("type");
                    multipliers[iter] += 5;
                }
                iter++;
            });
            iter = 0;
            this.state.trucks.forEach(function (truck) {
                if (!temptrucks.includes(truck)) {
                    temptrucks.push(truck);
                }
            });
            while (iter < this.state.trucks.length) {
                let max = multipliers[0];
                let pos = 0;
                for (let i = 0; i < temptrucks.length; i++) {
                    if (multipliers[i] > max) {
                        max = multipliers[i];
                        pos = i;
                    }
                }
                alltrucks.push(temptrucks[pos]);
                multipliers[pos] = -1;
                iter++;
            }
        } else {
            this.state.trucks.forEach(function (truck) {
                alltrucks.push(truck);
            });
        }
        this.setState({trucks: alltrucks});
        this.forceUpdate();


    }

    async getSubscriptions() {
        console.log("Went to get subs");
        if (this.state.user !== null) {
            await fetch(host + 'user/' + this.state.user.id)
                .then(res => res.json())
                .then(subs => this.state.subs = subs);
        }
    }

    renderTableHeader() {
        let header = Object.keys(this.state.trucks[0]).filter(key => key !== 'id' && key !== 'menu');
        return header.map((key, index) => {
            if (key !== "favourite" || this.state.user !== null) {
                return <th key={index}>{key.toUpperCase()}</th>;
            }
        });
    }

    async sub(event) {
        const target = event.target;

        const options = {
            method: 'POST',
            body: this.state.user.id + ';' + target.id,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        if (target.checked) {
            await fetch(host + 'subscribe', options)
                .then(res => this.state.subs.push(target.id))
                .then(() => this.forceUpdate());
        } else {
            await fetch(host + 'unsubscribe', options)
                .then(res => this.state.subs = this.state.subs.filter(function(id) {return id !== target.id}))
                .then(() => this.forceUpdate());
        }
    }

    renderTableData() {
        return this.state.trucks.slice(0,5).map((truck) => {
            const { id, name, description, rating, price, type } = truck;
            const url = 'truckDetails?id=' + id;

            return (
                <tr key={id}>
                    <td><a href={url}>{name}</a></td>
                    <td><a href={url}>{description}</a></td>
                    <td><a href={url}>{rating}</a></td>
                    <td><a href={url}>{price}</a></td>
                    <td><a href={url}>{type}</a></td>
                    {this.state.user !== null && <td>
                        <input type="checkbox" id={id} onChange={this.sub} checked={this.state.subs.includes(id)}/>
                    </td> }
                </tr>
            );
        });
    }

    async getNearby() {
        let table = this;
        // Attempt to get current position, if it is got it is sent to evaluatePosition
        await navigator.geolocation.getCurrentPosition(async function(position) {
            await evaluatePosition(position, table.state);
        });

        // Function evaluating based on current position
        async function evaluatePosition(position, state) {
            // Store the key value to access MapQuest's API and the user's coordinates
            const key = 'HvhBy6rdLPqZkmPnsEa4fMS95IDRRo2K';
            const coords = position.coords.latitude + ',' + position.coords.longitude;
            console.log("COORDS: " + coords);
            await fetch('http://open.mapquestapi.com/geocoding/v1/reverse?key=' + key +
                '&location=' + coords).then(res => res.json())
                .then(res => {
                    // const loc = res.results[0].locations[0];
                    //const address = loc.street + ', ' + loc.adminArea5 + ' ' + loc.adminArea3 + ', ' + loc.postalCode;
                    console.log("stringify: " + JSON.stringify(res));
                    return fetch('http://localhost:8080/trucks/locations').then(res => res.json())
                        .then(async res => {
                            console.log("THE STR: " + JSON.stringify(res));
                            await Promise.all(res.map(truck => {
                                return fetch('http://open.mapquestapi.com/geocoding/v1/address?key=' + key +
                                    '&location=' + truck.loc.trim()).then(res => res.json())
                                    .then(res => {
                                        const ll = res.results[0].locations[0].latLng;
                                        return fetch('http://www.mapquestapi.com/directions/v2/route?key=' + key +
                                            '&from=' + coords + '&to=' + ll.lat + ',' + ll.lng).then(res => res.json())
                                            .then(res => {
                                                state.trucks.find(t => t.id === truck.id).distance = res.route.distance;
                                            });
                                    });
                            }));
                        });
                })
                .then(() => {
                    console.log("Nearby donewgelinwe weoifbeowigw eogi ieg weg iweogi wbeogibweogbw");
                });
        }
    }

    /*getNearby(){
        // If geolocation is supported
        if (navigator.geolocation) {
            // Attempt to get current position, if it is got it is sent to evaluatePosition
            navigator.geolocation.getCurrentPosition(evaluatePosition);
        } else {
            console.log("Geolocation not supported");
        }

        // Function evaluating based on current position
        function evaluatePosition(position) {
            // Store the user's coordinates and the key value to access mapquest's API,
            // as well as the web address reached by the xmlhttp request
            let user_coord = position.coords.latitude + ',' + position.coords.longitude;
            let keyVal = "HvhBy6rdLPqZkmPnsEa4fMS95IDRRo2K";
            let url = 'http://open.mapquestapi.com/geocoding/v1/reverse?key=' + keyVal
                + '&location=' + user_coord;

            let physicalAddress = "";

            // Launch a new XMLHttp request which returns a json object
            const userLocReq = new XMLHttpRequest();
            userLocReq.responseType = 'json';

            // Get from the mapquest API the address of the user
            userLocReq.open('GET', url, true);

            // After getting the address of the user
            userLocReq.onloadend = function(){
                // Store the user's address
                let userAddress = userLocReq.response.results[0].locations[0];
                physicalAddress = userAddress.street + ", " + userAddress.adminArea5 + ' '
                    + userAddress.adminArea3 + ", " + userAddress.postalCode;

                console.log(physicalAddress);

                // Launch an XMLHttp request which returns every truck whose location isn't null
                const truckLocReq = new XMLHttpRequest();
                truckLocReq.open('GET', host + 'trucks/locations', true);

                truckLocReq.onloadend = function(){
                    // Get the pairs of truck id's and addresses returned
                    let res = truckLocReq.response;
                    if(res) {
                        // For every pair returned
                        console.log(res);
                        let array = res.split(/(",")/);
                        console.log(array.length);
                        console.log(array);
                        array.forEach(function(pair){
                            console.log(pair);
                        });
                    }

                    else{
                        console.log("no trucks have locations");
                    }
                }
                truckLocReq.send();
            }
            userLocReq.send();
        }
    }*/

    async componentDidMount() {
        this.state.user = JSON.parse(localStorage.getItem('user'));

        this.getTrucks().then(() => {
            this.getSubscriptions().then(() => {
                this.state.trucks.forEach(truck => truck.subscribed = this.state.subs.includes(truck.id));
                this.state.loading = false;
                this.forceUpdate();
            });
        });
    }

    render() {
        let loading = this.state.loading;
        let empty = this.state.trucks[0].id === '';
        return (
            <div>

                { loading && <img id='loading' src="http://i.stack.imgur.com/SBv4T.gif" alt="loading..." width='250'></img> }

                <table id='trucks' style={{marginLeft: 'auto', marginRight: 'auto', maxWidth: '1000px'}}>
                    <thead>
                    <tr>{ !loading && this.renderTableHeader() }</tr>
                    </thead>
                    <tbody id='table'>
                    { !loading && empty && <tr><td colSpan={this.state.user === null ? 3 : 4}>no trucks found</td></tr> }
                    { !loading && !empty && this.renderTableData() }
                    </tbody>
                </table>

            </div>
        );
    }
}

export default TruckTable
