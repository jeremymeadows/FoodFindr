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
            search: "",
        };
        this.searchTrucks = this.searchTrucks.bind(this);
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
        return this.state.trucks.map((truck) => {
            const { id, name, description, rating } = truck;
            const url = 'truckDetails?id=' + id;

            if (name.toLowerCase().includes(this.state.search.toLowerCase())) {
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
                    <input id="searchtruckname" type="text" onKeyUp={this.searchTrucks} placeholder="Truck Name"/><br/>
                    <p style={{display: 'inline', color: 'red'}} id="truck_found_result"><br/></p>
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
