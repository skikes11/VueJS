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
        <tr v-for="role in roles" :key="role._id">
          <td>
            <p class="fw-bold mb-1" style="font-size: 20px;">{{ role.name }} </p>

          </td>

          <td>
            <p class="fw-normal mb-1" style="font-size: 20px;">{{ role.description }} </p>

          </td>

          <td>
            <p class="fw-normal mb-1"  v-for="permission in role.permission" v-bind:key="permission._id">
              endpoint: {{ permission.endpoint }}, method: {{ permission.method }}       
            </p>
            

          </td>

          <td>
            <button type="button" class="btn btn-outline-primary" data-mdb-ripple-color="dark" v-on:click="addRole()">
              Edit
            </button>

            <button type="button" class="btn btn-outline-danger" data-mdb-ripple-color="dark">
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
      url_vue: process.env.VUE_APP_URL,
      roles: [],
      permission: null
    }
  },
  async created() {
    await this.getAllRoles();
    console.log(this.roles)
    this.fillPermission();
  },
  methods: {
    addRole() {
      this.$router.push({ name: "addRole"})
    },
    getAllRoles() {
      return api.get("/api/admin/roles").then(res => {
        console.log(res.data);
        this.roles = res.data.data;
      })
    },

    getPermissionByRoleID(id) {
      return api.get(`/api/admin/permissions/${id}`).then((res) => {
        this.permission = res.data.data
      })
    },

    async fillPermission() {
      console.log("rolesLength: ", this.roles.length)
      for (let i = 0; i < this.roles.length; i++) {
        await this.getPermissionByRoleID(this.roles[i]._id)
        this.roles[i].permission = this.permission
        console.log("permission: ", this.getPermissionByRoleID(this.roles[i]._id))
      }

      console.log("roles filled", this.roles)

    }

  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";

@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap";

@import "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/4.3.0/mdb.min.css";




.card.card-cascade .view.gradient-card-header {
  padding: 1rem 1rem;
  text-align: center;
}

.card.card-cascade h3,
.card.card-cascade h4 {
  margin-bottom: 0;
}
</style>
