import React from 'react';
import GoogleBtn from './GoogleBtn';
import './LoginPage.css';
import auth from './auth';

const LoginPage = (props:any) => {
  const myProp = props;
  return (
    //title of website
    //subtitle message
    //import the googleBtn module to this app page
    // refer to 'GoogleBtn.tsx"
    <div className="App">
      <header className="App-header">
        <h1> Monash Tutor Allocation Demo</h1> 

        <p>
          Welcome, Login with Google to Continue
        </p>
        <GoogleBtn/>
        <br></br>

          
      </header>
    </div>
  );
}

export default LoginPage;
