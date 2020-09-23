import React from 'react';
import {useRouter} from "next/router";

function NavMenu() {
    const router = useRouter();
    return(
        <div>
            <nav>
                <span onClick={() => router.push('/login')}>Login</span>
                <span onClick={() => router.push('/homepage')}>Home</span>
                <span onClick={() => router.push('/dashboard')}>Dashboard</span>
            </nav>
        </div>
    )
}

export default NavMenu