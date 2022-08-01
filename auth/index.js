import api from "../src/api/apiServices.ts";

export default {
    loggedIn: false,
    user: null,
    check_and_setHeaderToken() {
        if (localStorage.getItem('userToken') !== null) {
            api.defaults.headers.common['token'] = 'Bearer ' + localStorage.getItem('userToken')
            this.loggedIn = true
        }
    }
}
