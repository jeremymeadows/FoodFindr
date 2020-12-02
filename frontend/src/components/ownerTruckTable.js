import React, { Component } from 'react';
import Link from 'next/link';
import host from '../util/network.js'

class TruckTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            loading: true,
            updateUsingNearby: false,
            trucks: [
                { id: '', name: '', description: '', rating: 0, type: '', price: -1, distance: -1, subscribed: false }
            ],
            subs: [],
            search: '',
        };
    }

    async getTrucks() {

        await fetch(host + 'trucks')
            .then(res => res.json())
            .then(trucks => {
                if (trucks.length > 0) {
                    this.state.trucks = trucks;
                }
            });
        let ownerships = [];
        let fetchData = {method: 'post', body: this.state.user.id};
        /*await fetch(host + '/dashboard/getownerships', fetchData)
            .then(res => res.json())
            .then(owner => {
                let temp = JSON.stringify(owner);
                let list = temp.split(",");
                console.log(list);
                for (let i = 0; i < list.length; i++) {
                    if (i === 0) {
                        let end = list[i].length - 1;
                        ownerships.push(list[i].substring(2, end));
                    } else if ((i + 1) === list.length) {
                        let end = list[i].length - 2;
                        ownerships.push(list[i].substring(1, end));
                    }
                    else {
                        ownerships.push(list.substring());
                    }
                }
            });*/
/*
        let trucks = [];
        if (ownerships.length > 0) {
            this.state.trucks.forEach(function (truck) {
                if(ownerships.includes(truck.id)) {
                    trucks.push(truck);
                }
            });
            if (trucks.length <= 0) {
                this.state.trucks = [];
            } else {
                this.state.trucks = trucks;
            }
        } else {
            this.state.trucks = [];
        }*/
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
        };

        if (target.checked) {
            await fetch(host + 'subscribe', options)
                .then(res => this.state.subs.push(target.id))
                .then(() => this.forceUpdate());
        } else {
            await fetch(host + 'unsubscribe', options)
                .then(res => this.state.subs = this.state.subs.filter(function(id) { return id !== target.id }))
                .then(() => this.forceUpdate());
        }
    }

    renderTableData() {
        return this.state.trucks.map((truck) => {
            const { id, name, description, rating, type, price } = truck;
            const url = 'truckDetails?id=' + id;

            return (
                <tr key={id}>
                    <td><a href={url}>{name}</a></td>
                    <td><a href={url}>{description}</a></td>
                    <td><a href={url}>{rating}</a></td>
                    { type !== 'null' &&
                        <td>{type}</td>
                    }{ type === 'null' &&
                        <td>n/a</td>
                    }
                    <td>{'$'.repeat(price)}</td>
                    {this.state.user !== null && <td>
                        <input type="checkbox" id={id} onChange={this.sub} checked={this.state.subs.includes(id)}/>
                    </td> }
                </tr>
            );
        });
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

    render() {
        let loading = this.state.loading;
        let empty = this.state.trucks === '';
        console.log(empty);

        return (
            <div>
                { /* loaging gif */ }
                { loading && <img id='loading' src="http://i.stack.imgur.com/SBv4T.gif" alt="loading..." width='250'></img> }

                <table id='trucks' style={{marginLeft: 'auto', marginRight: 'auto', maxWidth: '1000px'}}>
                    <thead>
                    <tr>{ !loading && this.renderTableHeader() }</tr>
                    </thead>
                    <tbody id='table'>

                    { !loading && !empty && this.renderTableData() }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TruckTable
