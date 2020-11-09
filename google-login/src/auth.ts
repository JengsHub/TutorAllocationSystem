/**
 * This class IS SUPPOSED to hold information whether the user is logged in or not
 * Current Problem: being a class, it must be instantaied in each file that needs to use it
 * thus, it will always be reconstrcuted whenever it is in another page, making isAuthenticated always false
 */
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
const auth = new Auth();
export default auth;