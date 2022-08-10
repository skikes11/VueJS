<template>
  <div>
   
    
      <form class="form-input">
        <h2 class="title" >Login</h2>
        <h5 style="color:red;text-align:center" v-if ="msg"> {{msg}}</h5>
        <label for="lname"> Email </label>
        <input type="email" required="true" id="lname" name="lname" v-model="email" />

        <label for="fname">Password</label>
        <input type="text" id="fname" name="fname" v-model="password" />
      
        <div class="fm-btn flex pos_right" >
          <button type="button" class="btn btn-primary " v-on:click="login()">Login</button>
        </div>
      </form>
  </div>
</template>

<script>
//import { ref } from "vue";
import api from "../api/apiServices.ts";
//import axios from "axios";
export default {
  name: "Products",
  components: {

  },

  data() {
    return {
      email: "",
      password: "",
      msg: null
    }
  },
  methods: {
    login() {
    
      api.post(`/api/auth/login`,{
        email: this.email,
        password: this.password
      }).then(async(res)=>{

                    if(res.data.success){
                    await localStorage.setItem("userToken", res.data.userToken);
                    this.$router.push({name: "Dashboard"});
                    }else{
                      console.log( "aa", res.data.message)
                      this.msg = res.data.message
                      
                    }
            }).catch(err=>{
              console.log("err",err.response.data.message)
              this.msg = err.response.data.message       
                
             
            })
    }

  },



};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";

@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap";

@import "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/4.3.0/mdb.min.css";

input[type="text"] {
  width: 100%;
  padding: 6px 13px;
  margin: 5px 0;
  box-sizing: border-box;
}
input[type="email"] {
  width: 100%;
  padding: 6px 13px;
  margin: 5px 0;
  box-sizing: border-box;
}



.option-control {
  width: 100%;
  padding: 6px 13px;
  margin: 5px 0;
  box-sizing: border-box;
}

.form-input {
  margin: auto;
  width: 30%;
  background-color: gainsboro;
  padding: 40px;
  margin-top: 30px;
}

.pos_right {
  position: relative;
  left: 80%;
  top: 10px;

}
.title {
  text-align: center;
  text-shadow: 2em;
  margin-bottom: 10px;
}

.flex {
  display: inline-flex;
}

.img {
  width: 220px;
  margin: auto;
  margin-bottom: 20px;
}

.img_block {
  margin-left: 180px;
}
</style>
