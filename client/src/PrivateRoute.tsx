import * as React from "react";
import {
    Redirect,
    Route,
    RouteComponentProps,
    RouteProps
} from "react-router-dom";

interface PrivateRouteProps extends RouteProps {
  isAuthenticated: boolean;
}

export class PrivateRoute extends Route<PrivateRouteProps> {
  // Private route that restricts client-side access to pages
  // https://www.codegrepper.com/code-examples/typescript/react+protected+routes+typescript
  render() {
    return (
      <Route
        render={(props: RouteComponentProps) => {
          if (!this.props.isAuthenticated) {
            return <Redirect to="/login" />;
          }
          if (this.props.component) {
            return React.createElement(this.props.component);
          }
          if (this.props.render) {
            return this.props.render(props);
          }
        }}
      />
    );
  }
}
export default PrivateRoute;
