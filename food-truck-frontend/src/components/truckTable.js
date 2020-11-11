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
            search: false,
        };
        this.searchTrucks = this.searchTrucks.bind(this);

    }

    async getTrucks() {
        if (this.state.search === false) {
            console.log("false passed");

            await fetch('http://localhost:8080/trucks')
                .then(res => {console.log(res);return res.json();})
                .then(trucks => this.state.trucks = trucks);
            let res = document.getElementById("truck_found_result");
            res.innerHTML = "";

        } else {
            console.log("Passed through");
            let tname = document.getElementById("searchtruckname").value;
            const tempTrucks = this.state.trucks;
            let tempList = [];
            let res = document.getElementById("truck_found_result");
            tempTrucks.forEach(function(trucks){
                if (trucks.name === tname) {
                    tempList.push(trucks);
                }
            });
            if (tempList.length) {
                this.setState({trucks: tempList});
            } else {
                res.style = "color: red; display: block;";
                res.innerHTML = "could not find truck '" + tname + "'";
            }
            this.setState({search: false});
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
            const url = 'truckDetails?id=' + id;

            return (
                <tr key={id}>
                    <td><a href={url}>{name}</a></td>
                    <td><a href={url}>{description}</a></td>
                    <td><a href={url}>{rating}</a></td>
                    {this.state.user !== null && <td><a href={url}>{truck.subscribed ? '♥' : '-️'}</a></td>}
                </tr>
            );
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
        let name = document.getElementById("searchtruckname").value;
        if (name !== null) {
            this.setState({search: true});
            this.setState({loading: true});

            console.log("Went into searchtrucks");
            this.componentDidMount().then(() => {
                //this.renderTableHeader();
                //this.renderTableData();
                this.forceUpdate();
            });
        }
    };



    render() {
        let searched = this.state.search;
        return (
            <div>
                <div style={{textAlign: 'center'}}>
                    <input id="searchtruckname" type="text" placeholder="Truck Name"/><br/>
                    <p style={{display: 'inline', color: 'red'}} id="truck_found_result"><br/></p>
                    <button onClick={this.searchTrucks}>Search</button>
                </div>
                {!this.state.search && <div>
                { /* loaging gif, probably want a different one later */ }
                {this.state.loading && <img id='loading' src="http://i.stack.imgur.com/SBv4T.gif" alt="loading..." width='250'></img>}

                <table id='trucks'>
                    <thead>
                        <tr>{!this.state.loading && this.renderTableHeader()}</tr>
                    </thead>
                    <tbody id='table'>
                        {!this.state.loading && this.renderTableData()}
                    </tbody>
                </table>
                </div>}
                {this.state.search && <div>
                    {this.state.loading && <img id='loading' src="http://i.stack.imgur.com/SBv4T.gif" alt="loading..." width='250'></img>}

                    <table id='trucks'>
                        {!this.state.loading && this.renderTableHeader()}
                        <tbody id='table'>
                        {!this.state.loading && this.renderTableData()}
                        </tbody>
                    </table>
                </div>
                }
            </div>
        );
    }
}

export default TruckTable
