import React, { Component } from 'react';
import host from '../util/network.js'

class TruckTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            loading: true,
            trucks: [
                { id: '', name: '', description: '', rating: 0, subscribed: false }
            ],
            preferences: [
                {price: '', rating: '', type: ''}
            ],
            subs: []

        };

        this.getNearby = this.getNearby.bind(this);
        this.sub = this.sub.bind(this);
    }

    async getTrucks() {

        console.log("getting trucks");

        await fetch(host + 'trucks')
            .then(res => res.json())
            .then(trucks => this.state.trucks = trucks);

       /* await fetch(host + 'trucks', {mode: 'no-cors'})
            .then(res => {console.log(res);return res.json();})
            .then(trucks => this.state.trucks = trucks);*/

        //{console.log(res);return res.json();}

        let fetchData = {method: 'post', body: this.state.user.id};



        console.log("getting preferences");
        await fetch(host + 'dashboard/getpreferences', fetchData)
            .then(res => {console.log(res);return res.json();})
            .then(function(preferences) {
                console.log(preferences);
                let list = preferences.split(';');
                this.state.preferences[0] = list[0];
                this.state.preferences[1] = list[1];
                this.state.preferences[2] = list[2];
                console.log(list);
            }).catch(error => console.log(error));


        let temptrucks = [];
        if(this.preferences !== undefined && this.preferences.length > 0) {
            this.state.trucks.forEach(function (truck) {
                if (this.preferences.includes(truck.price) && this.preferences.includes(truck.rating)) {
                    temptrucks.unshift(truck);
                } else if (this.preferences.includes(truck.price)) {
                    temptrucks.push(truck);
                } else if (this.preferences.includes(truck.rating)) {
                    temptrucks.push(truck);
                }
            });
            this.state.trucks.forEach(function (truck) {
                if (!temptrucks.includes(truck)) {
                    temptrucks.unshift(truck);
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
        return this.state.trucks.map((truck) => {
            const { id, name, description, rating } = truck;
            const url = 'truckDetails?id=' + id;

            return (
                <tr key={id}>
                    <td><a href={url}>{name}</a></td>
                    <td><a href={url}>{description}</a></td>
                    <td><a href={url}>{rating}</a></td>
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
