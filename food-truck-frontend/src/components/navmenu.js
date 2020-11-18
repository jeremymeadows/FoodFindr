import React, { Component } from 'react';
import Link from 'next/link';
import { TabMenu } from 'primereact/tabmenu';

class NavMenu extends Component{
    constructor() {
        super();

        this.state = {
            user: null,
            items1: [
                {label: 'Home', icon: 'pi pi-fw pi-home', url: '/'},
                {label: 'Dashboard', icon: 'pi pi-fw pi-desktop', url: '/dashboard'},
                {label: 'Trucks', icon: 'pi pi-fw pi-star', url: '/trucks'},
                {label: 'Manage Account', icon: 'pi pi-fw pi-cog', url: '/manageaccount'},
                {label: 'Logout', icon: 'pi pi-fw pi-sign-out', url: '/auth/logout'}
            ],
            items2: [
                {label: 'Home', icon: 'pi pi-fw pi-home', url: '/'},
                {label: 'Create Account', icon: 'pi pi-fw pi-user-plus', url: '/auth/register'},
                {label: 'Login', icon: 'pi pi-fw pi-sign-in', url: '/auth/login'}
            ],
            item: null
        }
    }

    componentDidMount() {
        this.state.user = JSON.parse(localStorage.getItem('user'));
        this.forceUpdate();
    }

    render() {
        const sess = this.state.user === null;

        return (
            <div>
                {sess && <span style={{float: 'left', textAlign: 'left', margin: '20px'}}>
                <Link href={"/"}><a style={{marginLeft: 8, marginRight: 8, marginTop: 8,
                    marginBottom: 8, width: '181px', height: '48px'}}>Home</a></Link>
                </span>}
                {!sess && <span style={{float: 'left', textAlign: 'left', margin: '20px'}}>
                <Link href={"/"}><a style={{marginLeft: 8, marginRight: 8, marginTop: 8,
                    marginBottom: 8, width: '181px', height: '48px'}}>Home</a></Link>
                <Link href={"/dashboard"}><a style={{marginLeft: 8, marginRight: 8, marginTop: 8,
                    marginBottom: 8, width: '181px', height: '48px'}}>Dashboard</a></Link>
                    <Link href={"/trucks"}><a style={{marginLeft: 8, marginRight: 8, marginTop: 8,
                        marginBottom: 8, width: '181px', height: '48px'}}>Trucks</a></Link>
                </span>}
                {sess && <span style={{float: 'right', textAlign: 'right', margin: '20px'}}>
                <Link href={"/auth/login"}><a style={{marginLeft: 8, marginRight: 8, marginTop: 8,
                    marginBottom: 8, width: '181px', height: '48px'}}>Login</a></Link>
                <Link href={"/auth/register"}><a style={{marginLeft: 8, marginRight: 8, marginTop: 8,
                marginBottom: 8, width: '181px', height: '48px'}}>Create Account</a></Link>
                </span>}
                {!sess && <span style={{float: 'right', textAlign: 'right', margin: '20px'}}>
                    <Link href={"/manageaccount"}><a style={{marginLeft: 8, marginRight: 8, marginTop: 8,
                        marginBottom: 8, width: '181px', height: '48px'}}>Manage Account</a></Link>
                <Link href={"/auth/logout"}><a style={{marginLeft: 8, marginRight: 8, marginTop: 8,
                    marginBottom: 8, width: '181px', height: '48px'}}>Logout</a></Link>
                </span>}
                <div style={{clear: 'both'}}></div>
            </div>
        );
    }
}

export default NavMenu
