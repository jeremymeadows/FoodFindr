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
            search: 0,
        };

    }

    async getTrucks() {
        if (this.search === 0) {
            await fetch('http://localhost:8080/trucks')
                .then(res => res.json())
                .then(trucks => this.state.trucks = trucks);
        } else {
            let name = document.getElementById("searchtruckname").value;
            await fetch('http://localhost:8080/trucks/' + name)
                .then(res => res.json())
                .then(trucks => this.state.trucks = trucks);
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
        if (this.search === 0) {
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
        this.state.search = 1;
    }



    render() {
        let searched = this.search;
        return (
            <div>
                <div style={{textAlign: 'center'}}>
                    <input id="searchtruckname" type="text" placeholder="Truck Name"/><br/>


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
