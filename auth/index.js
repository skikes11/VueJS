import api from "../src/api/apiServices.ts";
import apiFormData from "../src/api/apiFormdata.ts"
import axios from "axios";
export default {
    loggedIn: false,
    user: null,
    check_and_setHeaderToken() {
        if (localStorage.getItem('userToken') !== null) {
            api.defaults.headers.common['token'] = 'Bearer ' + localStorage.getItem('userToken')
            apiFormData.defaults.headers.common['token'] = 'Bearer ' + localStorage.getItem('userToken')
            axios.defaults.headers.common['token'] = 'Bearer ' + localStorage.getItem('userToken')
            this.loggedIn = true
        }
    }
}
