import React from 'react';
import './App.css';
import { Route, BrowserRouter} from 'react-router-dom';
import Page2 from "./Page2";
import LoginPage from "./LoginPage";
import ProtectedRoute from './protectedRoute';

function App() {
  return (
    //title of website
    //subtitle message
    //import the googleBtn module to this app page
    // refer to 'GoogleBtn.tsx"
    <div className="App">
      <BrowserRouter>
      <Route exact path = "/" component={LoginPage} />
      <ProtectedRoute path = "/page2" component={Page2} />
      </BrowserRouter>
    </div>
  );
}

export default App;
