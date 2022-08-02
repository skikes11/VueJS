<template>
  <div class="flexible-content">
    <SlideBar />
    <p class="h3" style="text-align: center">Roles</p>
    <button
      type="button"
      class="btn btn-outline-success"
      data-mdb-ripple-color="dark"
      v-on:click="addUser()"
    >
      Add Role
    </button>

    <table class="table align-middle mb-0 bg-white">
      <thead class="bg-light" >
        <tr>
          <th>Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="role in roles" :key="role._id">
          <td>
                <p class="fw-bold mb-1" style="font-size: 20px;"  >{{ role.name }} </p>  
                
          </td>
          <td>
            <button
              type="button"
              class="btn btn-outline-primary"
              data-mdb-ripple-color="dark"
            >
              Edit
            </button>

            <button
              type="button"
              class="btn btn-outline-danger"
              data-mdb-ripple-color="dark"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref } from "vue";
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

  methods : {
    addUser() { 
    }
    
  },


  setup() {
    const roles = ref([]);

    const getAllRoles = async () => {
      try {
        const res = await api.get("/api/admin/roles");
        console.log(res.data);
        roles.value = res.data.data;
      } catch (error) {
        console.log(error);
      }
    };

    getAllRoles();

    return {
      roles,
    };
  },
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
