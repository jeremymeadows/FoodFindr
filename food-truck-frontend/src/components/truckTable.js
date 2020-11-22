import React, { Component } from 'react';

class TruckTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            loading: true,
            updateUsingNearby: false,
            trucks: [
                { id: '', name: '', description: '', rating: 0, distance: -1, subscribed: false }
            ],
            subs: [],
            search: '',
        };

        this.searchTrucks = this.searchTrucks.bind(this);
        this.sortTrucks = this.sortTrucks.bind(this);
        this.filterTrucks = this.filterTrucks.bind(this);
        this.enableLocation = this.enableLocation.bind(this);
        this.getNearby = this.getNearby.bind(this);
        this.sub = this.sub.bind(this);
    }

    async getTrucks() {
        await fetch('http://localhost:8080/trucks')
            .then(res => res.json())
            .then(trucks => {
                if (trucks.length > 0) {
                    this.state.trucks = trucks;
                }
                this.state.trucks.forEach((truck, _) => {
                    truck.distance = -1;
                });
            })
            .then(() => this.sortTrucks());
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
            if ((key !== "subscribed" || this.state.user !== null) && (key !== "distance" || this.state.updateUsingNearby)) {
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
        };

        if (target.checked) {
            await fetch('http://localhost:8080/subscribe', options)
                .then(res => this.state.subs.push(target.id))
                .then(() => this.forceUpdate());
        } else {
            await fetch('http://localhost:8080/unsubscribe', options)
                .then(res => this.state.subs = this.state.subs.filter(function(id) { return id !== target.id }))
                .then(() => this.forceUpdate());
        }
    }

    renderTableData() {
        return this.state.trucks.map((truck) => {
            const { id, name, description, rating, distance } = truck;
            const url = 'truckDetails?id=' + id;

            if (name.toLowerCase().includes(this.state.search.toLowerCase())) {
                return (
                    <tr key={id}>
                        <td><a href={url}>{name}</a></td>
                        <td><a href={url}>{description}</a></td>
                        <td><a href={url}>{rating}</a></td>
                        { this.state.updateUsingNearby && <td>
                            { distance > 0 &&
    							<a href={url}>{distance}</a>
                            }
                            { distance < 0 &&
                                <a href={url}>no location provided</a>
                            }
						</td> }
                        { this.state.user !== null && <td>
							<input type="checkbox" id={id} onChange={this.sub} checked={this.state.subs.includes(id)}/>
						</td> }
                    </tr>
                );
            }
        });
    }

    async getNearby() {
        let realThis = this;
        // Attempt to get current position, if it is got it is sent to evaluatePosition
        navigator.geolocation.getCurrentPosition(function(position) {
            evaluatePosition(position, realThis.state);
        });

        // Function evaluating based on current position
        async function evaluatePosition(position, state) {
            // Store the user's coordinates and the key value to access mapquest's API,
            // as well as the web address reached by the xmlhttp request
            const user_coord = position.coords.latitude + ',' + position.coords.longitude;

            const keyVal = 'HvhBy6rdLPqZkmPnsEa4fMS95IDRRo2K';
            const url = 'http://open.mapquestapi.com/geocoding/v1/reverse?key=' + keyVal +
              '&location=' + user_coord;
            let physicalAddress = '';

            // Launch a new XMLHttp request which returns a json object
            // const userLocReq = new XMLHttpRequest();
            // userLocReq.responseType = 'json';

            await fetch(url).then(res => res.json())
                .then(res => {
                    let loc = res.results[0].locations[0];
                    let address = loc.street + ', ' + loc.adminArea5 + ' ' + loc.adminArea3 + ', ' + loc.postalCode;
                    console.log(address);

                    return fetch('http://localhost:8080/trucks/locations').then(res => {console.log('hi'); return res.json()})
                        .then(res => res.forEach(truck => {
                            return fetch('http://open.mapquestapi.com/geocoding/v1/address?key=' + keyVal +
                              '&location=' + truck.loc.trim()).then(res => res.json())
                                .then(res => {
                                    let ll = res.results[0].locations[0].latLng;
                                    return fetch('http://www.mapquestapi.com/directions/v2/route?key=' + keyVal +
                                      '&from=' + user_coord + '&to=' + ll.lat + ',' + ll.lng).then(res => res.json())
                                        .then(res => {
                                            console.log(truck.id);
                                            console.log(state.trucks);
                                            state.trucks.find(t => t.id === truck.id).distance = res.route.distance;
                                            console.log(state.trucks);
                                            console.log(res.route.distance);
                                            return 'hi';
                                        });
                                });
                        }));
                })
                .then(() => {
                    console.log(realThis.state.trucks);

                    realThis.sortTrucks();
                    realThis.forceUpdate();
                });

            // Get from the mapquest API the address of the user
            // userLocReq.open('GET', url, true);

            // After getting the address of the user
            // userLocReq.onloadend = function() {
            //     // Store the user's address
            //     let userAddress = userLocReq.response.results[0].locations[0];
            //     physicalAddress = userAddress.street + ", " + userAddress.adminArea5 + ' '
            //         + userAddress.adminArea3 + ", " + userAddress.postalCode;
            //
            //     // Launch an XMLHttp request which returns every truck whose location isn't null
            //     const truckLocReq = new XMLHttpRequest();
            //     truckLocReq.open('GET', 'http://localhost:8080/trucks/locations', true);
            //
            //     truckLocReq.onloadend = function() {
            //         // Get the pairs of truck id's and addresses returned
            //         let res = JSON.parse(truckLocReq.response);
            //         if (res) {
            //             // For every pair returned
            //             let i = 0;
            //             let truckID = "", truckLoc = "";
            //             res.forEach(function(value) {
            //                 if (i%2 === 0) {
            //                     truckID = value;
            //                 }
            //                 else {
            //                     truckLoc = value;
            //
            //                     // Find the coordinates for the truck's address
            //                     const truckCoordReq = new XMLHttpRequest();
            //
            //                     truckCoordReq.open('GET', 'http://open.mapquestapi.com/geocoding/v1/address?key=' +
            //                         keyVal + '&location=' + truckLoc.trim(), false);
            //                     truckCoordReq.send();
            //                     let result = JSON.parse(truckCoordReq.response);
            //                     let truckLatCoord = result.results[0].locations[0].latLng.lat.toString();
            //                     let truckLngCoord = result.results[0].locations[0].latLng.lng.toString();
            //
            //                     let distanceReq = new XMLHttpRequest();
            //                     distanceReq.open('GET', 'http://www.mapquestapi.com/directions/v2/route?key='
            //                         + keyVal + '&from=' + user_coord + '&to=' + truckLatCoord + ',' + truckLngCoord, false);
            //                     distanceReq.send();
            //                     let distanceResult = JSON.parse(distanceReq.response);
            //                     let distanceVal = distanceResult.route.distance;
            //
            //                     // console.log("truckID: " + truckID +
            //                     //     "\n\tlatitude: " + truckLatCoord +
            //                     //     "\n\tlongitude: " + truckLngCoord +
            //                     //     "\n\tdistance: " + distanceVal
            //                     // );
            //
            //                     // sets distance of truck
            //                     realThis.state.trucks.find(truck => truck.id === truckID).distance = distanceVal;
            //                 }
            //                 i++;
            //             });
            //             realThis.sortTrucks();
            //             realThis.forceUpdate();
            //         }
            //     }
            //     truckLocReq.send();
            // }
            // userLocReq.send();
        }
    }

    async componentDidMount() {
        let json = localStorage.getItem('user');
        if (json !== null) {
            this.state.user = JSON.parse(localStorage.getItem('user'));
        }

        this.getTrucks().then(() => {
            this.getSubscriptions().then(() => {
                this.state.trucks.forEach(truck => truck.subscribed = this.state.subs.includes(truck.id));
                this.state.loading = false;
                this.forceUpdate();
            });
        });
    }

    searchTrucks() {
        this.state.search = document.getElementById("search").value;
        this.forceUpdate();
    };

    sortTrucks() {
        switch (document.getElementById('sort').value) {
            case 'rating_d':
                this.state.trucks.sort(function(a, b) { return a.rating < b.rating });
                break;
            case 'dist_a':
                this.state.trucks.sort(function(a, b) {
                    if (a.distance < 0) { return a.distance < b.distance; }  // puts -1 at the bottom
                    return a.distance > b.distance;
                });
                break;
            case 'name_d':
                this.state.trucks.sort(function(a, b) { return a.name.toLowerCase() > b.name.toLowerCase() });
                break;
            case 'name_a':
                this.state.trucks.sort(function(a, b) { return a.name.toLowerCase() < b.name.toLowerCase() });
                break;
            case 'rating_a':
                this.state.trucks.sort(function(a, b) { return a.rating > b.rating });
                break;
            case 'dist_d':
                this.state.trucks.sort(function(a, b) { return a.distance < b.distance });
                break;
        }
        this.forceUpdate();
    }

    filterTrucks() {
    }

    enableLocation() {
        let checked = document.getElementById('nearby').checked;
        this.state.updateUsingNearby = checked;
        document.getElementById('sort').value = checked ? 'dist_a' : 'rating_d';
        if (checked) {
            this.getNearby();
        }
        this.forceUpdate();
    }

    render() {
        let loading = this.state.loading;
        let empty = this.state.trucks[0].id === '';

        return (
            <div>
                <div style={{textAlign: 'center'}}>
                    <input id="search" type="text" onInput={this.searchTrucks} placeholder="Search Truck Name"/><br/><br/>
                    <label>Sort by: </label>
                    <select id="sort" defaultValue="rating_d" onChange={this.sortTrucks}>
                        <option value="rating_d">rating ▼</option>
                        <option value="dist_a">distance ▲</option>
                        <option value="name_d">name ▼</option>
                        <option value="name_a">name ▲</option>
                        <option value="rating_a">rating ▲</option>
                        <option value="dist_d">distance ▼</option>
                    </select><br/><br/>
                    <label>Filter by: </label>
                    <select id="filter" defaultValue="none" onChange={this.filterTrucks}>
                        <option value="none">*todo*</option>
                        { /* add price, rating, and distance options */ }
                        { /* a dropdown might not be the best for this and maybe we do something else */ }
                    </select><br/><br/>
                    <label>Use location? </label>
					<input type="checkbox" id="nearby" onChange={this.enableLocation}/>
                    <p id="locationError" style={{color: 'red'}}></p>
                </div>
                { /* loaging gif */ }
                { loading && <img id='loading' src="http://i.stack.imgur.com/SBv4T.gif" alt="loading..." width='250'></img> }

                <table id='trucks'>
                    <thead>
                        <tr>{ !loading && this.renderTableHeader() }</tr>
                    </thead>
                    <tbody id='table'>
                        { !loading && empty && <tr><td colSpan={3 + (this.state.user === null) + this.state.updateUsingNearby}>no trucks found</td></tr> }
                        { !loading && !empty && this.renderTableData() }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TruckTable
