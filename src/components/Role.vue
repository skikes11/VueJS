<template>
  <div class="flexible-content">
    <SlideBar />
    <p class="h3" style="text-align: center">Roles</p>
    <button type="button" class="btn btn-outline-success" data-mdb-ripple-color="dark" v-on:click="addRole()">
      Add Role
    </button>

    <table class="table align-middle mb-0 bg-white">
      <thead class="bg-light">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Permission</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="role in this.roles" :key="role._id">
          <td>
            <p class="fw-bold mb-1" style="font-size: 20px;">{{ role.name }} </p>

          </td>

          <td>
            <p class="fw-normal mb-1" style="font-size: 15px;">{{ role.description }} </p>

          </td>

          <td>
            <perfect-scrollbar>
              <div class="fw-normal mb-1"  v-for="permission in role.permission" v-bind:key="permission._id">
                <!-- <p v-if="permission.endpoint && permission.method"> endpoint: {{ permission.endpoint }}, method: {{ permission.method }} </p> -->
                <p>endpoint: {{ permission.endpoint }}, method: {{ permission.method }} </p>
              </div> 
            </perfect-scrollbar>

          </td>

          <td>
            <button type="button" class="btn btn-outline-primary" data-mdb-ripple-color="dark" v-on:click="editRole(role._id)">
              Edit
            </button>

            <button type="button" class="btn btn-outline-danger" data-mdb-ripple-color="dark" v-on:click="deleteRole(role._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from "../api/apiServices.ts";
import SlideBar from "./SlideBar.vue";
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
//import AddUserDiaLog from "./AddUserDiaLog.vue"
//import axios from "axios";
export default {
  name: "Products",
  components: {
    SlideBar,
    PerfectScrollbar
    // AddUserDiaLog
  },
  data() {
    return {
      url: null,
      url_vue: process.env.VUE_APP_URL,
      roles1: [],
      roles: [],
      permission: []
    }
  },
  async created() {
    await this.getAllRoles();
    console.log("roles filled before 1", this.roles1)
    await this.getAllPermission();
    console.log("roles filled before", this.roles)
    await this.fillPermission();
    // console.log("rolesLength: ", this.roles.length)
    console.log("roles filled after", this.roles)
  },
  async beforeMount(){

  },
  methods: {
    addRole() {
      this.$router.push({ name: "addRole"})
    },
    editRole(idRole) {
      this.$router.push({
        name: "editRole",
        params: { id: idRole }
      });
    },
    deleteRole(id) {

      this.$dialog
        .confirm("Please confirm to continue delete user")
        .then(function () {
         api.delete(`/api/admin/roles/${id}`).then((res) => {
          console.log(res.data);
          window.location.reload();
          })      
        })
        .catch(function () {
          console.log("Clicked on cancel");
        });
    },
    getAllRoles() {
      return api.get("/api/admin/roles").then(res => {
        console.log('getAllRoles', res.data);
        this.roles1 = res.data.data.slice(0);
        console.log('getAllRoles roles1', this.roles1);
        // for(var i=0;i < this.roles.length; i++){
        //   this.roles[i].permission = [];
        // }
      })
    },
    getAllPermission(){
      return api.get("/api/admin/permissions").then(res => {
        console.log('getAllPermission', res.data);
        this.permission = res.data.data.slice(0);
      })
    },

    getAllPermissionByRoleID(id) {
      const permissions = []
      for(let i =0; i< this.permission.length; i++){
        if(this.permission[i].Role_ID == id){
          permissions.push(this.permission[i])
        }
      }
      return permissions
    },

    async fillPermission() {

      console.log("rolesLength: ", this.roles1.length)
      for (let i = 0; i < this.roles1.length; i++) {
        const id = this.roles1[i]._id
        const permissions = await this.getAllPermissionByRoleID(id)
        this.roles.push({
          permission: permissions,
          _id: this.roles1[i]._id,
          name: this.roles1[i].name
        })
        // this.roles[i].permission = permissions
      }

      console.log("role filled", this.roles)
  }
}};


</script>
<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"/>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";

@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap";

@import "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/4.3.0/mdb.min.css";



.ps{
  background-color: white;
  width: 100%;
  height: 150px;
  padding: 5px;
}
.card.card-cascade .view.gradient-card-header {
  padding: 1rem 1rem;
  text-align: center;
}

.card.card-cascade h3,
.card.card-cascade h4 {
  margin-bottom: 0;
}
</style>
