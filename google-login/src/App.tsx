import React from 'react';
import './App.css';
import { Route, BrowserRouter} from 'react-router-dom';
import Page2 from "./Page2";
import LoginPage from "./LoginPage";
import ProtectedRoute from './protectedRoute';

function App() {
  return (
    //just defening the routes here
    <div className="App">
      <BrowserRouter>
      <Route exact path = "/" component={LoginPage} />
      <ProtectedRoute path = "/page2" component={Page2} />
      </BrowserRouter>
    </div>
  );
}

export default App;
