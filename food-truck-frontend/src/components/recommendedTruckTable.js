import React, { Component } from 'react';

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

    }

    async getTrucks() {

            console.log("getting trucks");

            await fetch('http://localhost:8080/trucks')
                .then(res => {console.log(res);return res.json();})
                .then(trucks => this.state.trucks = trucks);

        console.log("getting preferences");
        await fetch('http://localhost:8080/dashboard/getpreferences')
            .then(res => {console.log(res);return res.json();})
            .then(function(preferences) {
                let list = res.split(';');
                this.state.preferences[0] = list[0];
                this.state.preferences[1] = list[1];
                this.state.preferences[2] = list[2];
                console.log(list);
            });


        let temptrucks = [];
        this.state.trucks.forEach(function(truck) {
            if(this.preferences.includes(truck.price)) {
                temptrucks.push(truck);
            }
        });
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

    renderTableData() {
        return this.state.trucks.map((truck) => {
            const { id, name, description, rating } = truck;
            const url = 'truckDetails?id=' + id;

            return (
                <tr key={id}>
                    <td><a href={url}>{name}</a></td>
                    <td><a href={url}>{description}</a></td>
                    <td><a href={url}>{rating}</a></td>
                    {this.state.user !== null && <td><a href={url}>{truck.subscribed ? '♥' : '-️'}</a></td>}
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
        return (
            <div>

                    { /* loaging gif, probably want a different one later */ }
                    {this.state.loading && <img id='loading' src="http://i.stack.imgur.com/SBv4T.gif" alt="loading..." width='250'></img>}

                    <table id='trucks'>
                        <thead>
                        <tr>{!this.state.loading && this.renderTableHeader()}</tr>
                        </thead>
                        <tbody id='table'>
                        {!this.state.loading && this.renderTableData()}
                        </tbody>
                    </table>

            </div>
        );
    }
}

export default TruckTable
