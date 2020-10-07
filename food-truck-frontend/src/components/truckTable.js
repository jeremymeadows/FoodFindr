import React, { Component } from 'react';
// import styles from './truckTable.module.css';

class TruckTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trucks: [
                { id: 1, name: 'truck1' },
                { id: 2, name: 'truck2' },
            ]
        }
    }

    renderTableHeader() {
        let header = Object.keys(this.state.trucks[0]);
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        return this.state.trucks.map((truck, index) => {
            const { id, name } = truck;
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                </tr>
            )
        })
    }

    render() {
        return (
            <div>
                <h1>truckTable</h1>
                <table id='trucks'>
                    <thead>{this.renderTableHeader()}</thead>
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default TruckTable