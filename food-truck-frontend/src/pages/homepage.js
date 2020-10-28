import React from 'react';
import Link from '@material-ui/core/Link';
import { useRouter } from 'next/router'
import NavMenu from "../components/navmenu";

require('dotenv').config();

function HomePage() {
    //const router = useRouter();
    return (
        <div>
            <NavMenu></NavMenu>
            <Link href={"/"}><a>Index</a></Link>
            <h2>This is the home page!</h2>
        </div>
    )
}

export default HomePage