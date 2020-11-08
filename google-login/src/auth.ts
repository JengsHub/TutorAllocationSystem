class Auth {
    isAuthenticated: boolean
    constructor(){
        this.isAuthenticated = false;
        console.log('hello');
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
const auth = new Auth();
export default auth;