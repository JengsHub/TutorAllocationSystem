import React from 'react';
import GoogleBtn from './GoogleBtn';
import './App.css';

function App() {
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
      </header>
    </div>
  );
}

export default App;
