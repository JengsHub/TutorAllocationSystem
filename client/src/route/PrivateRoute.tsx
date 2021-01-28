import * as React from "react";
import { Route, RouteComponentProps, RouteProps } from "react-router-dom";
//private rout to prevent users from opening pages an dusing the app if they arent logged in

/**
 * Boolean prop specifying if user is authenticted or not
 */
interface PrivateRouteProps extends RouteProps {
  isAuthenticated: boolean;
}
/**
 * Specify app's authenticated and unauthenticated routes
 */
export class PrivateRoute extends Route<PrivateRouteProps> {
  // Private route that restricts client-side access to pages
  // https://www.codegrepper.com/code-examples/typescript/react+protected+routes+typescript
  render() {
    return (
      <Route
        render={(props: RouteComponentProps) => {
          if (!this.props.isAuthenticated) {
            // return <Redirect to="/profile" />;
            return;
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
