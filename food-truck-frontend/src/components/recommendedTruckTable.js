import React, { Component } from 'react';

class TruckTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            loading: true,
            trucks: [
                { id: '', name: '', description: '', rating: 0, subscribed: false, price: 0 }
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

        await fetch('http://localhost:8080/trucks')
            .then(res => res.json())
            .then(trucks => {
                console.log("got the trucks");
                if (trucks.length > 0) {
                    this.state.trucks = trucks;
                }
            });
        console.log("OUT");

        let fetchData = {method: 'post', body: this.state.user.id};

        console.log("getting preferences");
        await fetch('http://localhost:8080/dashboard/getpreferences', fetchData)
            .then(res => res.json())
            .then(pref => {
                let temp = JSON.stringify(pref);
                let list = temp.split(",");
                console.log("PREF: " + list);

                if (list.length === 3) {
                    let size = list[0].length - 1;
                    console.log("PR:" + list[0][size] + ":THIS");
                    this.state.preferences[0].price = parseInt(list[0][size]);
                    console.log("PR:" + this.state.preferences[0].price + ":THIS");
                    size = list[1].length - 1;
                    console.log("B: " + list[1][size]);
                    console.log("B: " + list[2]);
                    this.state.preferences[0].rating = parseInt(list[1][size]);
                    let i = 0;
                    while (list[2][i] != ':') {
                        i++;
                    }
                    i = i + 2;
                    size = list[2].length - 3;
                    this.state.preferences[0].type = list[2].substring(i, size);
                    console.log("TYPE: " + this.state.preferences[0].type);
                }

                if (list.length > 0) {
                    console.log("price found??: " + list[0]);
                    console.log("price found??: " + this.state.preferences[0].price);
                }
            }).catch(error => console.log(error));

        console.log("Rec algorithm ");
        let temptrucks = [];
        let cost = this.state.preferences[0].price;
        let rate = this.state.preferences[0].rating;
        let type = this.state.preferences[0].type;
        console.log("PRICE: " + this.state.preferences[0].price);
        if(this.state.preferences) {
            console.log("ALG");
            this.state.trucks.forEach(function (truck) {
                console.log("cost inside for: " + cost);
                console.log("TRUCK PRICE: " + truck.price + " RATING: " + truck.rating);
                if (cost === truck.price && rate === truck.rating) {
                    console.log("ONE");
                    temptrucks.unshift(truck);
                } else if (cost === truck.price) {
                    console.log("TWO");
                    temptrucks.push(truck);
                }
                /*else if (this.state.preferences.includes(truck.rating)) {
                    temptrucks.push(truck);
                }*/
            });
            this.state.trucks.forEach(function (truck) {
                if (!temptrucks.includes(truck)) {
                    temptrucks.push(truck);
                }
            });
        } else {
            this.state.trucks.forEach(function (truck) {
                temptrucks.push(truck);

            });
        }
        this.setState({trucks: temptrucks});
        this.forceUpdate();


    }

    async getSubscriptions() {
        if (this.state.user !== null) {
            await fetch('http://localhost:8080/user/' + this.state.user.id)
                .then(res => res.json())
                .then(subs => this.state.subs = subs);
        }
    }

    renderTableHeader() {
        let header = Object.keys(this.state.trucks[0]).filter(key => key !== 'id');
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
            await fetch('http://localhost:8080/subscribe', options)
                .then(res => this.state.subs.push(target.id))
                .then(() => this.forceUpdate());
        } else {
            await fetch('http://localhost:8080/unsubscribe', options)
                .then(res => this.state.subs = this.state.subs.filter(function(id) {return id !== target.id}))
                .then(() => this.forceUpdate());
        }
    }

    renderTableData() {
        return this.state.trucks.map((truck) => {
            const { id, name, description, rating, price } = truck;
            const url = 'truckDetails?id=' + id;

            return (
                <tr key={id}>
                    <td><a href={url}>{name}</a></td>
                    <td><a href={url}>{description}</a></td>
                    <td><a href={url}>{rating}</a></td>
                    <td><a href={url}>{price}</a></td>
                    {this.state.user !== null && <td>
                        <input type="checkbox" id={id} onChange={this.sub} checked={this.state.subs.includes(id)}/>
                    </td> }
                </tr>
            );
        });
    }

    getNearby(){
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
                truckLocReq.open('GET', 'http://localhost:8080/trucks/locations', true);

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
    }

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

                <table id='trucks'>
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
