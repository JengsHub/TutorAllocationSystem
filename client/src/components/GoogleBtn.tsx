
import React, { Component } from 'react'; //for the component class
import { GoogleLogin, GoogleLogout} from 'react-google-login'; //for google login and log out function
import { Redirect , Link } from 'react-router-dom';
import { Route, BrowserRouter} from 'react-router-dom';
import LoginPage from "../pages/LoginPage"

/**
 * so to use google auth login you need a client ID
 * later when we deliver final product, Milad needs to create or use his/Monash own client ID
 * I made one from my accnt
 */
const CLIENT_ID = '840194914617-c2ilgpenlc2aml6n9cckpuitv0grq9ft.apps.googleusercontent.com';

class GoogleBtn extends Component <{}, {isLogined: boolean, userName: string}>{
  constructor(props: any) {
   super(props);

   //to track wheter user is logged in or out (this is an object with two attributes)
   this.state = {
     isLogined: false,
     userName: ''
   };

   //binding it, nothing fancy here
   this.login = this.login.bind(this);
   this.handleLoginFailure = this.handleLoginFailure.bind(this);
   this.logout = this.logout.bind(this);
   this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
 }

 refreshTokenSetup = (response: any) => {
   let timer: any;
   let refreshTiming = (response.tokenObj.expires_in || 3300); //time in seconds
   const refreshToken = async () => { //async process
     const newAuthRes = await response.reloadAuthResponse(); //reload the
     refreshTiming = (newAuthRes.expires_in || 3300); //time in seconds
     timer = setTimeout(refreshToken, refreshTiming);
   }
   timer = setTimeout(refreshToken,refreshTiming);

 }
 //this is the login function
 login (response: any) {
   /**yarn 
    * param: response from Google
    * output: none
    * desc:
    * sets the state isLogedin to true
    * set username from response.profileObj.givenName + familyName
    * 
    * Note: CAN BE MODIFIED to re-reoute to another page
    * but need to figure out how to carry the response information or the token to the other page
    */
   if(response.accessToken){
     this.setState(state => ({
       isLogined: true,
       userName: response.profileObj.givenName + ' ' + response.profileObj.familyName
     }));
     this.refreshTokenSetup(response);
     sessionStorage.setItem('isAuth','true'); //isAuth=true for system reference
   }
 }

 logout () {
    /**
    * param: none
    * output: none
    * desc:
    * sets the state isLogedin to false
    * set username tp ""
    * 
    * Note: CAN BE MODIFIED to re-reoute to this page
    * this function shud probably be in the other page which log in leads to
    * and once its back to login page, set the logined to false
    */
   this.setState(state => ({
     isLogined: false,
     userName: ''
   }));
   //TODO: kill async process

   sessionStorage.setItem('isAuth','false'); //set isAuth = false for system reference
 }


 handleLoginFailure () { //just a message
   alert('Failed to log in')
 }

 handleLogoutFailure () { //just a message
   alert('Failed to log out')
 }

 render() { //this is what is rendered (what users see) in the react web app pahge
   return (
   <div>
     { this.state.isLogined ? //if logged in, show log out option
       <GoogleLogout
       clientId = {CLIENT_ID} //the client id
       buttonText = 'Logout' //the button text
       onLogoutSuccess = {this.logout} //calls log out function on success click
       onFailure={this.handleLogoutFailure} //prints the message on failure
       >
       </GoogleLogout>: <GoogleLogin
         clientId={ CLIENT_ID } //clientid
         buttonText='Login' //button text
         onSuccess={ this.login} //success -> then call login function (the package automatically sends the response)
         isSignedIn={true} //keep user signed in till he/she logs out
         onFailure={ this.handleLoginFailure } //message
         cookiePolicy={ 'single_host_origin' } //cookie type, but honestly idk much abt cookies, just followed to docs
         responseType='code,token' //the type of the response sent is token which is used by login function
       />
     }
     { //if userName is not null, show the text and print the username and give link to page 2
     this.state.isLogined ? <span><h5>You are logged in as : <br/><br/> { this.state.userName }</h5> 
     {/* <a href="http://localhost:3000/home">Go to Page 2</a> */}
     <Redirect push to="/home"></Redirect> 
     </span>: <Redirect push to="/"></Redirect>
    //  <Link to="/" component={LoginPage} />
     }
   </div>
   )
 }
}
//export this module
export default GoogleBtn;

//old code(s):
//<Redirect push to="/page2"></Redirect> 