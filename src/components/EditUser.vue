<template>
  <div class="flexible-content">
    <SlideBar />
    <h2 class="title">Edit User</h2>
    <div class="flex">
      <div class="img_block">
        <h4 style="text-align: center; margin: 20px">User avatar</h4>
        <img class="img" v-if="url" :src="url" alt="IMG" />
        <input accept="image/*" type="file" id="avatar" name="avatar" ref="file" @change="onFileChange" />
      </div>

      <form class="form-input">
        <h5 style="color:red;text-align:center" v-if ="msg"> {{msg}}</h5>
        <label for="name"> User Name </label>
        <input type="text" id="fname" name="fname" v-model="name" />
        <label for="lname"> Email </label>
        <input type="text" id="lname" name="lname" v-model="email" />

        <label for="fname">Password</label>
        <input type="text" id="fname" name="fname" v-model="password" />

        <label for="fname">Re Enter Password </label>
        <input type="text" id="fname" name="fname" v-model="rePassword" />

        <label for="lname">Phone</label>
        <input type="text" id="lname" name="lname" v-model="phone" />

        <label for="lname">Role: {{ role.name }} </label>
        <select class="option-control"  :required="true" v-model="role">
          <option v-for="role in roles"  :value="role._id" v-bind:key="role._id" :selected="role == 'user'">
            {{ role.name }}
          </option>
        </select>

        <label for="lname">Activate: {{ active }} </label>
        <select class="option-control" :required="true" v-model="active">
          <option value="true">true</option>
          <option value="false">false</option>
        </select>


        <div class="fm-btn flex">
          <button type="button" class="btn btn-primary" v-on:click="editUser()">Save</button>
          <button type="button" class="btn btn-secondary">Close</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
//import { ref } from "vue";
import api from "../api/apiServices.ts";
import SlideBar from "./SlideBar.vue";
//import AddUserDiaLog from "./AddUserDiaLog.vue"
//import axios from "axios";
export default {
  name: "Products",
  components: {
    SlideBar,
    // AddUserDiaLog
  },

  data() {
    return {
      url: null,
      roles: [],
      name: "",
      email: "",
      password: "",
      rePassword: "",
      role: "",
      phone: "",
      avatar: "",
      active: "",
      msg: null,
      url_vue : process.env.VUE_APP_URL
    }
  },
  created() {
    console.warn("params", this.$route.params.id)
    this.getAllRoles();
    this.getUserByID();

  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);

    },
    getAllRoles() {
      api.get("/api/admin/roles").then(res => {
        console.log(res.data);
        this.roles = res.data.data;

      })
    },
    getUserByID() {
      api.get(`/api/admin/users/${this.$route.params.id}`).then(res => {
        console.log(res.data);

        const user = res.data.data

        this.name = user.name
        this.email = user.email
        this.password = user.password
        this.rePassword = user.rePassword
        this.role = user.role._id
        this.phone = user.phone
        this.active = user.active

        if(user.avatar){
        this.url = this.url_vue + user.avatar
        }

        console.log(this.role)
        


      })
    },
    editUser() {

      let formData = new FormData();
      this.avatar = this.$refs.file.files[0]

      formData.append('name', this.name)
      formData.append('email', this.email)
      formData.append('password', this.password)
      formData.append('rePassword', this.rePassword)
      formData.append('role', this.role)
      formData.append('phone', this.phone)
      formData.append('avatar', this.avatar)
      formData.append('active', this.active)
      console.log("this name ", this.name)
      console.log(formData)

    
      api.post(`/api/admin/users/${this.$route.params.id}`,formData).then(res=>{
                    console.log(res.data)
                    if(res.data.success){
                    this.$router.push({name: "Users"});
                    }else{
                      this.msg = res.data.message
                      this.$route.go();
                    }
                
            }).catch(err=>{
                console.log(err)
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

.option-control {
  width: 100%;
  padding: 6px 13px;
  margin: 5px 0;
  box-sizing: border-box;
}

.form-input {
  margin: auto;
  width: 40%;

  padding: 10px;
  margin-top: 30px;
}

.title {
  text-align: center;
  text-shadow: 2em;
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
