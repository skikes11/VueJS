<template>
  <div class="flexible-content">
    <SlideBar />
    <p class="h3" style="text-align: center">Users</p>

    
    <div style="display: inline-flex; padding: 10px;"> 
    <button type="button" class="btn btn-outline-success" data-mdb-ripple-color="dark" v-on:click="addUser()">
      Add user
    </button>

     <h6 style="padding: 10px; margin-left: 20px"> Sort By </h6>

      <select class="option-control" v-model="sortSelected" @change="onChange" :required="true">
        <option value="1">Newest</option>
        <option value="2">Oldest</option>
      </select>

    </div>  

    <table class="table align-middle mb-0 bg-white">
      <thead class="bg-light">
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Activate</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>
            <div class="d-flex align-items-center">
              <img :src="url_vue+user.avatar" class="rounded-circle" alt=""
                style="width: 45px; height: 45px" />
              <div class="ms-3">
                <p class="fw-bold mb-1" v-if="user.name"> {{ user.name }}</p>
                <p class="text-muted mb-0"  v-if="user.email" >{{ user.email }}</p>
              </div>
            </div>
          </td>
          <td>
            <p class="fw-normal mb-1" v-if="user.phone" >{{ user.phone }}</p>

          </td>
          <td>
            <span class="badge badge-warning rounded-pill d-inline" v-if="user.active" >{{ user.active }}</span>
          </td>
          <td>
            <p class="fw-normal mb-1"  v-if="user.role" >{{ user.role.name }}</p>
          </td>
          <td>
            <button type="button" class="btn btn-outline-primary" data-mdb-ripple-color="dark"
              v-on:click="editUser(user._id)">
              Edit
            </button>

            <button type="button" class="btn btn-outline-danger" data-mdb-ripple-color="dark"
              v-on:click="deleteUser(user._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
     <paginate :pageCount="pageCount" :containerClass="'pagination'"  :prev-text="'Prev'"
      :next-text="'Next'" :clickHandler="clickCallback">
      </paginate>

  </div>
</template>

<script>
import api from "../api/apiServices.ts";
import SlideBar from "./SlideBar.vue";

const customStyles = {
    ul: {
        border: '5px solid red'
    },
    li: {
        display: 'inline-block',
        border: '2px dotted green'
    },
    a: {
        color: 'blue'
    }
};
const customLabels = {
    first: '<<',
    last: '>>',
    previous: '<',
    next: '>'
};

//import axios from "axios";
export default {
  name: "Users",
  components: {
    SlideBar,
  },
  data() {
    return {
      users: [],
      url: [],
      url_vue : process.env.VUE_APP_URL,
      pageOfItems: [],
      customStyles,
      customLabels,
      pageCount: null,
      limit: 7,
      sortSelected: 1
    }
  },
  async created() {
    await this.getAllUser();
  },

  methods: {
    addUser() {
      this.$router.push("/users/add");
    },
    onChange() {
        api.get(`/api/admin/users/1/${this.limit}/${this.sortSelected}`).then(res => {
          console.log(res.data)
          if(res.data.success){
            this.users = res.data.data
          }
        })
    },
    deleteUser(id) {

      this.$dialog
        .confirm("Please confirm to continue delete user")
        .then(function () {
          api.delete(`/api/admin/users/${id}`).then((res) => {
          console.log(res.data);
          window.location.reload();
          })
          
          
        })
        .catch(function () {
          console.log("Clicked on cancel");
        });
        

    },
    editUser(idUser) {
      this.$router.push({
        name: "editUser",
        params: { id: idUser }
      });
    },
    clickCallback : async function(pageNum){

        api.get(`/api/admin/users/${pageNum}/${this.limit}/${this.sortSelected}`).then(res => {
          console.log(res.data)
          if(res.data.success){
            this.users = res.data.data
          }
        })

    },
     getAllUser() {
      try {
       return api.get(`/api/admin/users/1/${this.limit}/${this.sortSelected}`).then(async(res) => {
          console.log(res.data);
          this.users = res.data.data;
          this.pageCount = await Math.floor(res.data.userCount/this.limit) + 1
          
          console.log( "pageCount: ", this.pageCount)
        })

      } catch (error) {
        console.log(error);
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";

@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap";

@import "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/4.3.0/mdb.min.css";

@import "https://cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.css";
.card.card-cascade .view.gradient-card-header {
  padding: 1rem 1rem;
  text-align: center;
}

.card.card-cascade h3,
.card.card-cascade h4 {
  margin-bottom: 0;
}
.option-control{
  width: 150px;
}
</style>
