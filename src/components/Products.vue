<template>
  <div class="flexible-content">
    <SlideBar />
    <p class="h3" style="text-align: center">Products</p>

      <div class="flex" > 

      <button type="button" class="btn btn-outline-success" data-mdb-ripple-color="dark" v-on:click="addProduct()">
        Add product
      </button>

      <h6 style="padding: 10px; margin-left: 20px"> Sort By </h6>

      <select class="option-control" v-model="sortSelected" @change="onChange" :required="true">
        <option value="1">Newest</option>
        <option value="2">Oldest</option>
        <option value="3">Price Up</option>
        <option value="4">Price Down</option>
      </select>

    </div>
    


    <table class="table align-middle mb-0 bg-white">
      <thead class="bg-light">
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Total quantity</th>
          <th>Brand</th>
          <th>Origin</th>
          <th>Description</th>

          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product._id">
          <td>
            <div class="d-flex align-items-center">
              <img :src="url_vue + product.image" class="rounded-circle" alt="" style="width: 45px; height: 45px" />
              <div class="ms-3">
                <p class="fw-bold mb-1" v-if="product.name">{{ product.name }}</p>
              </div>
            </div>
          </td>
          <td>
            <p class="fw-normal mb-1" v-if="product.price">{{ new Intl.NumberFormat('vi-VN', { style: 'currency',
            currency: 'VND' }).format(product.price) }}</p>
          </td>
          <td>
            <p class="fw-normal mb-1" v-if="product.total_quantity">{{ product.total_quantity }}</p>
          </td>
          <td>
            <p class="fw-normal mb-1" v-if="product.price">{{ product.brand }}</p>
          </td>
          <td>
            <p class="fw-normal mb-1" v-if="product.total_quantity">{{ product.origin }}</p>
          </td>
          <td>
            <p class="fw-normal mb-1" v-if="product.total_quantity">{{ product.description }}</p>
          </td>
          <td>


            <button type="button" class="btn btn-outline-primary" data-mdb-ripple-color="dark"
              v-on:click="editProduct(product._id)">
              Edit
            </button>

            <button type="button" class="btn btn-outline-danger" data-mdb-ripple-color="dark"
              v-on:click="deleteProduct(product._id)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <paginate :pageCount="pageCount" :containerClass="'pagination'"  :prev-text="'Prev'"
      :next-text="'Next'" :clickHandler="clickCallback">
      </paginate>
    </div>
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
      products: [],
      pageOfItems: [],
      customStyles,
      customLabels,
      pageCount: null,
      limit: 7,
      sortSelected: 1

    }
  },
  created() {
    this.getAllProduct();
  },
  methods: {
    addProduct() {
      this.$router.push({ name: "addProduct" })
    },
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    }, 
    clickCallback : async function(pageNum){

        api.get(`/api/admin/products/${pageNum}/${this.limit}/${this.sortSelected}`).then(res => {
          console.log(res.data)
          if(res.data.success){
            this.products = res.data.data
          }
        })
    },
    onChange() {

    api.get(`/api/admin/products/1/${this.limit}/${this.sortSelected}`).then(res => {
          console.log(res.data)
          if(res.data.success){
            this.products = res.data.data
          }
        })
       
    },
    deleteProduct(id) {
      this.$dialog
        .confirm("Please confirm to continue delete user")
        .then(function () {
          api.delete(`/api/admin/products/${id}`).then((res) => {
            console.log(res.data);
            window.location.reload();
          })
        })
        .catch(function () {
          console.log("Clicked on cancel");
        });

    },
    editProduct(idProduct) {
      this.$router.push({
        name: "editProduct",
        params: { id: idProduct }
      });
    },
    getAllProduct() {
      api.get(`/api/admin/products/1/${this.limit}/1`).then(res => {
        console.log(res.data)
        this.products = res.data.data
        this.pageCount = Math.floor(res.data.productCount/this.limit) + 1
        console.log( "pageCount: ", this.pageCount)
      })
    },
  },


};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";

@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap";

@import "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/4.3.0/mdb.min.css";

@import "https://cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.css";

@import "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/components/menu.min.css";

.card.card-cascade .view.gradient-card-header {
  padding: 1rem 1rem;
  text-align: center;
}

.card.card-cascade h3,
.card.card-cascade h4 {
  margin-bottom: 0;
}
.option-control {
    width: 100%;
    padding: 6px 13px;
    margin: 5px 0;
    box-sizing: border-box;
}

.flex {
    display: inline-flex;
    padding: 10px;
}

</style>
