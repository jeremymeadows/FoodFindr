import React from 'react';
import {useRouter} from "next/router";
import Link from 'next/link';
import user from './utils/user.js';
import { useCookies } from 'react-cookie';

function NavMenu() {
    const router = useRouter();
    const [cookies, setCookie] = useCookies(['sessionUser']);
    var sess = cookies.sessionUser === undefined;

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
    )
}

export default NavMenu
