import React, { Component } from 'react';
import sha256 from 'js-sha256';
import NavMenu from "../../components/navmenu";
import PrimeReact from 'primereact/utils';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Checkbox } from 'primereact/checkbox';
import host from '../../util/network';

PrimeReact.ripple = true;

class Login extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            remember: false
        }

        this.login = this.login.bind(this);
        this.create_acc = this.create_acc.bind(this);
    }


    componentDidMount() {
        if (JSON.parse(localStorage.getItem('user')) !== null) {
            window.location = '../dashboard';
        }
    }

    login() {
        var email = document.getElementById("email").value;
        var passw = sha256(email + document.getElementById("passw").value);

        var login_cred = email + ';' + passw;
        console.log(login_cred);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', host + 'login', true);

        xhr.onloadend = function() {
            var res = document.getElementById("login_result");
            if (xhr.status === 200) {
                if (xhr.responseText === "") {
                    console.log("invalid email or password");
                    res.style = "color: red; display: block;";
                    res.innerHTML = "invalid email or password";
                } else {
                    console.log("login success");
                    res.style = "color: green, display: inline;";
                    res.innerHTML = xhr.responseText + " was logged in successfully";
                    window.location = "../dashboard";

                    var ustr = xhr.responseText.split(';');
                    var user = {
                        name: ustr[0],
                        email: ustr[1],
                        id: ustr[2],
                        owner: ustr[3] == '0' ? false : true
                    };
                    console.log(user);
                    localStorage.setItem('user', JSON.stringify(user));
                }
            } else {
                console.log("could not connect to server");
                res.style = "color: red; display: block;";
                res.innerHTML = "could not connect to server";
            }
        };
        xhr.send(login_cred);
    };

    create_acc() {
        window.location = "register";
    }

    render() {
        return (
            <div>
                <NavMenu></NavMenu>

                <div style={{textAlign: 'center', marginTop: '30vh'}}>
                    <h1>Food Truck Finder</h1>

                    <InputText value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} id="email" type="text" placeholder="Email"/><br/>
                    <InputText value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} id="passw" type="password" placeholder="Password"/><br/>

                    <Checkbox inputId="binary" checked={this.state.remember} onChange={e => this.setState({ remember: e.checked })} id="remember"/>
                    <label htmlFor="remember">Remember Me</label><br/>

                    <p style={{display: 'inline', color: 'red'}} id="login_result"><br/></p>
                    <Button className="p-button-text" onClick={this.login}>Login</Button><br/>
                    <Button className="p-button-text" onClick={this.create_acc}>Create Account</Button>
                </div>
            </div>
        );
    }
}

export default Login
