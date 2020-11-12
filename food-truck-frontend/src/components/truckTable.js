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
            subs: [],
            search: false,
        };
        this.searchTrucks = this.searchTrucks.bind(this);
        this.getNearby = this.getNearby.bind(this);

    }

    async getTrucks() {
        if (this.state.search === false) {
            console.log("false passed");

            await fetch('http://localhost:8080/trucks')
                .then(res => {console.log(res);return res.json();})
                .then(trucks => this.state.trucks = trucks);
            let res = document.getElementById("truck_found_result");
            res.innerHTML = "";

        } else {
            console.log("Passed through");
            let tname = document.getElementById("searchtruckname").value;
            const tempTrucks = this.state.trucks;
            let tempList = [];
            let res = document.getElementById("truck_found_result");
            tempTrucks.forEach(function(trucks){
                if (trucks.name === tname) {
                    tempList.push(trucks);
                }
            });
            if (tempList.length) {
                this.setState({trucks: tempList}, () => {
                    console.log(this.state.trucks);
                });
            } else {
                res.style = "color: red; display: block;";
                res.innerHTML = "could not find truck '" + tname + "'";
            }
            this.setState({search: false},
                () => console.log(this.state.search)
            );
        }
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
                        nearbyArray.forEach( truckIDval => console.log(truckIDval) );
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

        let name = document.getElementById("searchtruckname").value;

        if (name !== null) {
            this.setState({search: true}, () => {
                console.log(this.state.search);
            });
            this.setState({loading: true}, () => {
                console.log(this.state.loading);
            });

        console.log("got name: " + name);



            console.log("Went into searchtrucks");
            this.componentDidMount().then(() => {
                //this.renderTableHeader();
                //this.renderTableData();
                this.forceUpdate();
            });
        }

        this.state.search = document.getElementById("searchtruckname").value;
        this.forceUpdate();
    };



    render() {
        let searched = this.state.search;
        return (
            <div>
                <div style={{textAlign: 'center'}}>

                    <input id="searchtruckname" type="text" placeholder="Truck Name"/><br/>

                    <p style={{display: 'inline', color: 'red'}} id="truck_found_result"><br/></p>
                    <button onClick={this.searchTrucks}>Search</button><br/><br/>

                    <input id="searchtruckname" type="text" onInput={this.searchTrucks} placeholder="Truck Name"/><br/>

                    <button onClick={this.getNearby}>Get Nearby</button><br/>

                </div>
                {!this.state.search && <div>
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
                </div>}
                {this.state.search && <div>
                    {this.state.loading && <img id='loading' src="http://i.stack.imgur.com/SBv4T.gif" alt="loading..." width='250'></img>}

                    <table id='trucks'>
                        {!this.state.loading && this.renderTableHeader()}
                        <tbody id='table'>
                        {!this.state.loading && this.renderTableData()}
                        </tbody>
                    </table>
                </div>
                }
            </div>
        );
    }
}

export default TruckTable
