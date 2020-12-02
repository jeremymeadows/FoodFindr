import React from 'react';

import Head from 'next/head';
import { CssBaseline } from '@material-ui/core';
import { FoodTruckThemeProvider } from '../util/theme';

import '../util/style.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

let initialState = {};

const FoodTruckApp = ({ Component, pageProps }) => {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    return (
        <div>
        {/*<Provider store={ store }>*/}
            <Head>
                <title>My page</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>

            <FoodTruckThemeProvider>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Component {...pageProps} />
            </FoodTruckThemeProvider>
        </div>
    );
};

export default FoodTruckApp
