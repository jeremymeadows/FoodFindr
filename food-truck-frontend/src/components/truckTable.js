import React, { Component } from 'react';
import user from '../pages/utils/user';

require('dotenv').config();

class TruckTable extends Component {
    sessionUser = undefined;

    componentDidCatch() {
        const [cookies, setCookie] = useCookies(['sessionUser']);
        this.sessionUser = cookies.sessionUser;
    }

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            trucks: [
                { id: '', name: '', description: '', rating: 0, favourite: false }
            ],
            subs: [
                {userId: '', truckId: '' }
            ]
        }
    }

    async getTrucks() {
        await fetch('http://localhost:8080/trucks')
            .then(res => res.json())
            .then(trucks => this.state.trucks = trucks);
    }

    async getSubscriptions() {
        var fav = false;
        await fetch('http://localhost:8080/user/' + this.sessionUser)
            .then(res => res.json())
            .then(subs => console.log('subs: ' + subs));
    }

    renderTableHeader() {
        let header = Object.keys(this.state.trucks[0]).filter(key => key !== 'id');
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
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
                    {user.id === "" && <td><a href={url}>{truck.favourite ? 'yes' : 'no'}</a></td>}
                </tr>
            )
        })
    }

    async componentDidMount() {
        await this.getTrucks();//.then(() => {
            this.getSubscriptions().then(() => {
                console.log(this.sessionUser);
                this.state.trucks.forEach(truck => truck.favourite = this.state.subs.includes(truck.id))
                this.state.loading = false;
                this.forceUpdate();
            })
        //});
    }

    render() {
        return (
            <div>
                { /* loaging gif, probably want a different one later */ }
                {this.state.loading && <img id='loading' src="http://i.stack.imgur.com/SBv4T.gif" alt="loading..." width='250'></img>}
                
                <table id='trucks'>
                    {!this.state.loading && this.renderTableHeader()}
                    <tbody id='table'>
                        {!this.state.loading && this.renderTableData()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default TruckTable