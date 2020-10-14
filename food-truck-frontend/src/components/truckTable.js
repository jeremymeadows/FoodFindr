import React, { Component } from 'react';

require('dotenv').config();

class TruckTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            trucks: [
                { id: '', name: '', description: '', rating: 0 }
            ]
        }
    }

    async populateData() {
        await fetch('http://localhost:8080/trucks')
            .then(res => res.json())
            .then(trucks => this.state.trucks = trucks);
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
            const url = 'localhost:8080/truck/' + id;

            return (
                <tr key={id}>
                    <td><a href={url}>{name}</a></td>
                    <td><a href={url}>{description}</a></td>
                    <td><a href={url}>{rating}</a></td>
                </tr>
            )
        })
    }

    componentDidMount() {
        this.populateData().then(() => {
            this.state.loading = false;
            this.forceUpdate();
        });
    }

    render() {
        return (
            <div>
                { /* loaging gif, probably want a different one later */ }
                {this.state.loading && <img id='loading' src="http://i.stack.imgur.com/SBv4T.gif" alt="this slowpoke moves" width='250'></img>}
                
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