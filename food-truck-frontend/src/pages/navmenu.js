import React from 'react';
import {useRouter} from "next/router";
import Link from 'next/link';

function NavMenu() {
    const router = useRouter();
    return(
        <div style={{textAlign: 'left', margin: '20px'}}>
            <Link href={"/"}><a style={{marginLeft: 8, marginRight: 8, marginTop: 8,
                marginBottom: 8, width: '181px', height: '48px'}}>Home</a></Link>
            <Link href={"/login"}><a style={{marginLeft: 8, marginRight: 8, marginTop: 8,
                marginBottom: 8, width: '181px', height: '48px'}}>Login</a></Link>
            <Link href={"/dashboard"}><a style={{marginLeft: 8, marginRight: 8, marginTop: 8,
                marginBottom: 8, width: '181px', height: '48px'}}>Dashboard</a></Link>
        </div>
    )
}

export default NavMenu