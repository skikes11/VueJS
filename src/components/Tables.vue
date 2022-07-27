<template>
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
      <tr v-for="user in users" :key= "user._id">
        <td>
          <div class="d-flex align-items-center">
            <img
              src="https://mdbootstrap.com/img/new/avatars/7.jpg"
              class="rounded-circle"
              alt=""
              style="width: 45px; height: 45px"
            />
            <div class="ms-3">
              <p class="fw-bold mb-1"> {{user.name}}</p>
              <p class="text-muted mb-0"> {{user.email}} </p>
            </div>
          </div>
        </td>
        <td>
          <p class="fw-normal mb-1">Designer</p>
          <p class="text-muted mb-0">UI/UX</p>
        </td>
        <td>
          <span class="badge badge-warning rounded-pill d-inline"
            >Awaiting</span
          >
        </td>
        <td>Senior</td>
        <td>
          <button
            type="button"
            class="btn btn-outline-primary" 
            data-mdb-ripple-color="dark">
            Edit
          </button>

          <button
            type="button"
           class="btn btn-outline-danger"
            data-mdb-ripple-color="dark">
            Delete
          </button>

        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref } from 'vue'
import api from '../api/apiServices.ts'
//import axios from "axios";
export default {
  name: 'Users',
  setup() {
    const users = ref([])

    const getAllUser = async () => {
      try {
      
      const res = await api.get('/api/admin/users',{
        headers : { 
          token : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyY2JmNmNjYWY2ZWE2ODMyODc2MDk2MCIsInJvbGUiOnsiX2lkIjoiNjJjNjljNDFmNTg5ZDY5YTk5YjYzNmRhIiwibmFtZSI6ImFkbWluIn0sImlhdCI6MTY1ODkwNTMwNSwiZXhwIjoxNjU4OTkxNzA1fQ.kgcjIbIF8v7MoFbUcGs8m0nwgmK4yV8x47JJlnctz1A"
        }
      })


      // const res = await axios
      // .get(`http://localhost:8000/api/admin/users`, {
      //   headers: {
      //     token:
      //       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyY2JmNmNjYWY2ZWE2ODMyODc2MDk2MCIsInJvbGUiOnsiX2lkIjoiNjJjNjljNDFmNTg5ZDY5YTk5YjYzNmRhIiwibmFtZSI6ImFkbWluIn0sImlhdCI6MTY1ODkwNTMwNSwiZXhwIjoxNjU4OTkxNzA1fQ.kgcjIbIF8v7MoFbUcGs8m0nwgmK4yV8x47JJlnctz1A"
      //   }
      // })

        console.log(res.data)
        users.value = res.data
      } catch (error) {
       console.log(error)
      }
    }

    getAllUser()

    return { 
      users
    }
  }
}

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
