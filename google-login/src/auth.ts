class Auth {
    isAuthenticated: boolean
    constructor(){
        this.isAuthenticated = false;
    }

login(){
    this.isAuthenticated= true;
}

logout(){
    this.isAuthenticated = false;
}

isLoggedIn(){
    return this.isAuthenticated;
}

}
export default Auth;