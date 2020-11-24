import React, { Component } from 'react';
import Link from 'next/link';

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
        let header = Object.keys(this.state.trucks[0]).filter(key => key !== 'id' && key !== 'menu');
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
                    <Link href={url}><tr key={id} style={{cursor: 'pointer'}}>
                        <td style={{textAlign: 'center'}}>{name}</td>
                        <td>{description}</td>
                        <td>{rating}</td>
                        { this.state.updateUsingNearby && <td>
                            { distance > 0 &&
                                <a>{distance}</a>
                            }
                            { distance < 0 &&
                                <a>no location provided</a>
                            }
                        </td> }
                        { this.state.user !== null && <td>
                            <input type="checkbox" id={id} onChange={this.sub} checked={this.state.subs.includes(id)}/>
                        </td> }
                    </tr></Link>
                );
            }
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

            await fetch('http://open.mapquestapi.com/geocoding/v1/reverse?key=' + key +
              '&location=' + coords).then(res => res.json())
                .then(res => {
                    // const loc = res.results[0].locations[0];
                    //const address = loc.street + ', ' + loc.adminArea5 + ' ' + loc.adminArea3 + ', ' + loc.postalCode;

                    return fetch('http://localhost:8080/trucks/locations').then(res => res.json())
                        .then(async res => {
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
                    table.sortTrucks();
                });
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

                <table id='trucks' style={{marginLeft: 'auto', marginRight: 'auto', maxWidth: '1000px'}}>
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
