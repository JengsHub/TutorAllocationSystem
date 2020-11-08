import React from 'react';
import {GoogleLogout} from 'react-google-login';
import GoogleBtn from './GoogleBtn';
import './Page2.css';

const Page2 = () => {
    return (
        <div className="page2">
            <h1>
                Page 2
            </h1>
            <a style={{color:"black"}} href="http://localhost:3000/">Back</a>
        </div>
    )
}
export default Page2;