import * as React from 'react';
import {Route, Router, Redirect, RouteProps} from 'react-router-dom';
import auth from './auth';

const ProtectedRoute: React.FC<RouteProps> = ({component: Component, ...rest}) => {
    if (!Component) return null;
    auth.login(); //i am manualy setting it to true because I dont know how to transfer the true value from GoogleBtn yet
    return (
        <div>
            <Route {...rest} render={props => (
                auth.isAuthenticated ?
                <Component {...props} />: 
                <Redirect to="/" />
            )} />
        </div>
    );
};

export default ProtectedRoute;

