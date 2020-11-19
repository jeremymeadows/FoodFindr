import React, { Component } from 'react';

class TruckTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            loading: true,
            updateUsingNearby: false,
            nearby: [],
            trucks: [
                { id: '', name: '', description: '', rating: 0, subscribed: false }
            ],
            subs: [],
            search: "",
        };
        this.searchTrucks = this.searchTrucks.bind(this);
        this.getNearby = this.getNearby.bind(this);
    }

    async getTrucks() {
        await fetch('http://localhost:8080/trucks')
            .then(res => res.json())
            .then(trucks => this.state.trucks = trucks);
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
        if(this.state.updateUsingNearby){
            this.state.updateUsingNearby = false;
            return this.state.trucks.map((truck) => {
                const { id, name, description, rating } = truck;
                const url = 'truckDetails?id=' + id;

                if( this.state.nearby.includes(id) ){
                    return (
                        <tr key={id}>
                            <td><a href={url}>{name}</a></td>
                            <td><a href={url}>{description}</a></td>
                            <td><a href={url}>{rating}</a></td>
                            {this.state.user !== null && <td><a href={url}>{truck.subscribed ? '♥' : '-️'}</a></td>}
                        </tr>
                    );
                }
            });
        }

        else {
            return this.state.trucks.map((truck) => {
                const {id, name, description, rating} = truck;
                const url = 'truckDetails?id=' + id;

                if (name.toLowerCase().includes(this.state.search.toLowerCase())) {
                    return (
                        <tr key={id}>
                            <td>
                                <a href={url}>{name}</a>
                            </td>
                            <td>
                                <a href={url}>{description}</a>
                            </td>
                            <td>
                                <a href={url}>{rating}</a>
                            </td>
                            {this.state.user !== null && <td>
                                <a href={url}>{truck.subscribed ? '♥' : '-️'}</a>
                            </td>}
                        </tr>
                    );
                }
            });
        }
    }

    getNearby(){

        let realThis = this;
        // Attempt to get current position, if it is got it is sent to evaluatePosition
        navigator.geolocation.getCurrentPosition(function(position){
            evaluatePosition(position, realThis);
        });

        // Function evaluating based on current position
        function evaluatePosition(position, state) {
            // Store the user's coordinates and the key value to access mapquest's API,
            // as well as the web address reached by the xmlhttp request
            let user_coord = position.coords.latitude + ',' + position.coords.longitude;
            let keyVal = "HvhBy6rdLPqZkmPnsEa4fMS95IDRRo2K";
            let url = 'http://open.mapquestapi.com/geocoding/v1/reverse?key=' + keyVal
                + '&location=' + user_coord;

            let physicalAddress = "";
            let nearbyArray = [];

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

                // Launch an XMLHttp request which returns every truck whose location isn't null
                const truckLocReq = new XMLHttpRequest();
                truckLocReq.open('GET', 'http://localhost:8080/trucks/locations', true);

                truckLocReq.onloadend = function(){
                    // Get the pairs of truck id's and addresses returned
                    let res = JSON.parse(truckLocReq.response);
                    if(res) {
                        // For every pair returned
                        let i = 0;
                        let truckID = "", truckLoc = "";
                        res.forEach(function(value){
                            if(i%2 === 0){
                                truckID = value;
                            }
                            else{
                                truckLoc = value;

                                // Find the coordinates for the truck's address
                                const truckCoordReq = new XMLHttpRequest();

                                truckCoordReq.open('GET', 'http://open.mapquestapi.com/geocoding/v1/address?key=' +
                                    keyVal + '&location=' + truckLoc.trim(), false);
                                truckCoordReq.send();
                                let result = JSON.parse(truckCoordReq.response);
                                let truckLatCoord = result.results[0].locations[0].latLng.lat.toString();
                                let truckLngCoord = result.results[0].locations[0].latLng.lng.toString();

                                console.log("truckID: " + truckID + "\n\tlatitude: " + truckLatCoord
                                                + "\n\tlongitude: " + truckLngCoord);

                                let distanceReq = new XMLHttpRequest();
                                distanceReq.open('GET', 'http://www.mapquestapi.com/directions/v2/route?key='
                                    + keyVal + '&from=' + user_coord + '&to=' + truckLatCoord + ',' + truckLngCoord, false);
                                distanceReq.send();
                                let distanceResult = JSON.parse(distanceReq.response);
                                let distanceVal = distanceResult.route.distance;

                                console.log("distance: " + distanceVal);
                                // If the distance is within 10 km
                                if(distanceVal < 10){
                                    // Add the truck's ID to the list of nearby trucks
                                    nearbyArray.push(truckID);
                                }
                            }
                            i++;
                        });

                        // AT THIS POINT WE HAVE THE FULL ARRAY OF NEARBY TRUCKS,
                        // YOU CAN UPDATE THE TRUCK TABLE AND EXIT OUT OF THE FUNCTION
                        realThis.state.updateUsingNearby = true;
                        nearbyArray.forEach( truckIDval => realThis.state.nearby.push(truckIDval) );
                        realThis.forceUpdate();
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

    searchTrucks() {
        this.state.search = document.getElementById("searchtruckname").value;
        this.forceUpdate();
    };

    render() {
        return (
            <div>
                <div style={{textAlign: 'center'}}>
                    <input id="searchtruckname" type="text" onInput={this.searchTrucks}  placeholder="Search Truck Name"/><br/><br/>
                    <button onClick={this.getNearby}>Get Nearby</button><br/>
                </div>
                { true && <div>
                { /* loaging gif, probably want a different one later */ }
                { this.state.loading && <img id='loading' src="http://i.stack.imgur.com/SBv4T.gif" alt="loading..." width='250'></img> }

                <table id='trucks'>
                    <thead>
                        <tr>{ !this.state.loading && this.renderTableHeader() }</tr>
                    </thead>
                    <tbody id='table'>
                        { !this.state.loading && this.renderTableData() }
                    </tbody>
                </table>
                </div> }
            </div>
        );
    }
}

export default TruckTable
