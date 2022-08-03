<template>
  <div class="flexible-content">
    <SlideBar />
    <p class="h3" style="text-align: center">Products</p>
    <button
      type="button"
      class="btn btn-outline-success"
      data-mdb-ripple-color="dark"
      v-on:click="addProduct()"
    >
      Add product
    </button>

    <table class="table align-middle mb-0 bg-white">
      <thead class="bg-light">
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Total quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product._id">
          <td>
            <div class="d-flex align-items-center">
              <img
                src="https://mdbootstrap.com/img/new/avatars/7.jpg"
                class="rounded-circle"
                alt=""
                style="width: 45px; height: 45px"
              />
              <div class="ms-3">
                <p class="fw-bold mb-1">{{ product.name }}</p>
              </div>
            </div>
          </td>
          <td>
            <p class="fw-normal mb-1">{{ product.price }}</p>
          </td>
          <td>
            <p class="fw-normal mb-1">{{ product.total_quantity }}</p>
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
              v-on:click="deleteProduct(product._id)"
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

  methods: {
    addProduct() {
      this.$dialog
        .confirm("Please confirm to continue")
        .then(function () {
          console.log("Clicked on proceed");
        })
        .catch(function () {
          console.log("Clicked on cancel");
        });
    },
    deleteProduct(id) {
      api.delete(`/api/admin/products/${id}`).then(() => {
        console.log("delete success");
        this.$router.go();
      });
    },
  },

  setup() {
    const products = ref([]);

    const getAllProduct = async () => {
      try {
        const res = await api.get("/api/admin/products");
        console.log(res.data);
        products.value = res.data;
      } catch (error) {
        console.log(error);
      }
    };

    getAllProduct();

    return {
      products,
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
