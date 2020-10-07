import React, { Component } from 'react';
import Link from '@material-ui/core/Link';
import {useRouter} from "next/router";
import sha256 from 'js-sha256';
import { useCookies } from 'react-cookie';
// import styles from './truckTable.module.css';
require('dotenv').config();

class TruckTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trucks: []
        }
    }

    populateData() {
        // var trucks;
        // const xhr = new XMLHttpRequest();
        // xhr.open('GET', 'http://localhost:8080/trucks', true);

        // xhr.onloadend = function() {
        //     if (xhr.status === 200) {
        //         if (xhr.responseText === "") {
        //             console.log("could not get trucks");
        //         } else {
        //             console.log("got trucks");
        //             trucks = JSON.parse(xhr.responseText);
        //         }
        //     } else {
        //         console.log("could not connect to server");
        //     }
        // };
        // xhr.send();

        // this.state.trucks.push(
        //     trucks
        // );
    }

    // renderTableHeader() {
    //     let header = Object.keys(this.state.trucks[0]);
    //     return header.map((key, index) => {
    //         return <th key={index}>{key.toUpperCase()}</th>
    //     })
    // }

    renderTableData() {
        this.populateData();
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
                    {/* <thead>{this.renderTableHeader()}</thead> */}
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default TruckTable