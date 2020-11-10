import React, { Component } from 'react';

class TruckTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            loading: true,
            trucks: [
                { id: '', name: '', description: '', rating: 0, favourite: false }
            ],
            subs: [],
            search: false,
        };
    }

    async getTrucks() {
        if (this.state.search === false) {
            await fetch('http://localhost:8080/trucks')
                .then(res => res.json())
                .then(trucks => this.state.trucks = trucks);
        } else {

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
            const url = 'http://localhost:8080/truck/' + id;

            return (
                <tr key={id}>
                    <td><a href={url}>{name}</a></td>
                    <td><a href={url}>{description}</a></td>
                    <td><a href={url}>{rating}</a></td>
                    {this.state.user !== null && <td><a href={url}>{truck.favourite ? '♥' : '-️'}</a></td>}
                </tr>
            );
        });
    }

    async componentDidMount() {
        this.state.user = JSON.parse(localStorage.getItem('user'));
        if (this.state.seal === false) {
            this.getTrucks().then(() => {
                this.getSubscriptions().then(() => {
                    this.state.trucks.forEach(truck => truck.favourite = this.state.subs.includes(truck.id));
                    this.state.loading = false;
                    this.forceUpdate();
                })
            });
        } else {
            this.getTrucks().then(() => {
                this.getSubscriptions().then(() => {
                    this.state.trucks.forEach(truck => truck.favourite = this.state.subs.includes(truck.id));
                    this.state.loading = false;
                    this.forceUpdate();
                })
            });
        }
    }

    searchTrucks() {
        let truckSelect = document.getElementById("namesearch").checked;
        let rangeSelect = document.getElementById("rangesearch").checked;
        let truckName = document.getElementById("searchtruckname").value;
        let range = document.getElementById("range").value;

        if(truckSelect === null && rangeSelect === null) {
            console.log("No search parameters were entered.");
            return 1;
        }

        this.setState({search: true});
        let search_credentials = truckName + ";" + range;

        const xhr = new XMLHttpRequest();

        xhr.open('POST', 'http://localhost:8080/trucks/searchTrucks', true);

        xhr.onloadend = function() {
            var res = document.getElementById("schedule_truck_result");
            if (xhr.status === 200) {
                if (xhr.responseText === "]") {
                    console.log("could not find any trucks");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "could not find any trucks";
                } else {
                    console.log("found trucks");
                    res => res.json();
                    /*res.style = "color: green, display: inline;";
                    res.innerHTML = xhr.responseText + " found successfully";
                    window.location = "../trucks";*/

                }

            } else {
                if (res === null) {
                    console.log("Res returned NULL");
                }
                console.log(xhr.status);
                console.log("Could not connect to server");
                res.style = "color: red; display: block;";
                res.innerHTML = "Could not connect to server";
            }
        }

        xhr.send(search_credentials);

    }

    render() {
        const searched = this.state.search;
        return (
            <div>
                <div style={{textAlign: 'center'}}>
                    <input id="searchtruckname" type="text" placeholder="Truck Name"/><br/>
                    <input id="namesearch" type="checkbox"/>
                    <label htmlFor="namesearch">Searching by truck name</label><br/>
                    <input id="range" type="text" placeholder="Within -- Miles"/><br/>
                    <input id="rangesearch" type="checkbox"/>
                    <label htmlFor="rangesearch">Searching by range</label><br/>

                    <p style={{display: 'inline', color: 'red'}} id="schedule_truck_result"><br/></p>
                    <button onClick={this.searchTrucks}>Search</button>
                </div>
                {!searched && <div>
                { /* loaging gif, probably want a different one later */ }
                {this.state.loading && <img id='loading' src="http://i.stack.imgur.com/SBv4T.gif" alt="loading..." width='250'></img>}

                <table id='trucks'>
                    {!this.state.loading && this.renderTableHeader()}
                    <tbody id='table'>
                        {!this.state.loading && this.renderTableData()}
                    </tbody>
                </table>
                </div>}
            </div>
        );
    }
}

export default TruckTable
