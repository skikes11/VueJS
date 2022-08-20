<template>
    <div class="flexible-content">
        <SlideBar />
        <div class="flex">

            <div>
                <h3 class="title">User Infor</h3>
                <div class="form-user">
                    <div>
                    <p> Username: {{order.User_ID.name}} </p>
                    <p> Email: {{order.User_ID.email}} </p>
                    <p> Phone: {{order.User_ID.phone}} </p>
                    </div>
                </div>
                
            </div>


            <div class="list-products">
                <h3 class="title">List Products</h3>
                 
                <table class="table align-middle mb-0 bg-white" style="margin-top: 65px">
                <perfect-scrollbar>
                    <thead class="bg-light">
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                   
                    <tbody>
                        
                        <tr v-for="product in products" :key="product._id">
                            <td>
                                <div class="d-flex align-items-center">
                                    <img :src="url_vue + product.image" class="rounded-circle" alt=""
                                        style="width: 45px; height: 45px" />
                                    <div class="ms-3">
                                        <p class="fw-bold mb-1" v-if="product.name">{{ product.name }}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p class="fw-normal mb-1" v-if="product.price">{{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price) }}</p>
                            </td>
                           
                            <td>

                                <button type="button" class="btn btn-outline-primary" data-mdb-ripple-color="dark"
                                    v-on:click="addProductToOrder(product._id)">
                                    Add to Items
                                </button>

                               
                            </td>
                        </tr>
                        
                    </tbody>
                    </perfect-scrollbar>
                </table>
                


            </div>

            <div class="list-items">
                <h3 class="title">List Items</h3>
                <h5 style="color:green;text-align:center" v-if ="msg"> {{msg}}</h5>
                <table class="table align-middle mb-0 bg-white" style="margin-top: 65px">
                <perfect-scrollbar>
                    <thead class="bg-light">
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        <tr v-for="(item, index) in items" :key="item._id">
                            <td>
                                <div class="d-flex align-items-center">
                                    <img :src="url_vue + item.Product_ID.image" class="rounded-circle" alt=""
                                        style="width: 45px; height: 45px" />
                                    <div class="ms-3">
                                        <p class="fw-bold mb-1" v-if="item.Product_ID.name">{{ item.Product_ID.name }}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p class="fw-normal mb-1" v-if="item.Product_ID.price"> {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Product_ID.price) }} </p>
                            </td>
                            <td>
                                <p class="fw-normal mb-1" v-if="item.quantity">  <i class="fas fa-plus" @click="plusItem(index)"></i>  {{ item.quantity }}  <i class="fas fa-minus" @click="minusItem(index)"></i> </p>
                            </td>
                            <td>
                                <p class="fw-normal mb-1">{{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.Product_ID.price * item.quantity)}}</p>
                            </td>
                           

                            <td>
                                <button type="button" class="btn btn-outline-danger" data-mdb-ripple-color="dark"
                                    v-on:click="deleteItemByID(item.Product_ID._id)">
                                    Delete
                                </button>
                            </td>
                        </tr>
                        
                    </tbody>
                    </perfect-scrollbar>
                </table>

                <p class="fw-bold mb-1" style="font-size:20px" > Total Price: {{  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}}</p>

                <div class="fm-btn flex">
                        <button type="button" class="btn btn-primary" v-on:click="updateOrder()">Save</button>
                        <button type="button" class="btn btn-secondary" v-on:click="close()">Close</button>
                </div>

            </div>


        </div>
    </div>
</template>

<script>
//import { ref } from "vue";
import api from "../api/apiServices.ts";
import apiJson from "../api/apiJson.ts"
import SlideBar from "./SlideBar.vue";
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
//import Multiselect from 'vue-multiselect'

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
            items: [],
            totalPrice: 0,
            order: null,
            msg: null,
            products: [],
            url_vue : process.env.VUE_APP_URL,
        }
    },
    async created() {
       
        this.order = JSON.parse(this.$route.query.orders)
        this.items = this.order.items
        await this.caculateTotalPrice();
        console.log("totalPrice", this.totalPrice)
        console.log("order: ", this.order)
        await this.getAllProduct();
    },
    methods: {
        close() {
            this.$router.push({ name: "Orders" })
        },
        getAllProduct() {
            return api.get("/api/admin/products").then(res => {
                console.log(res.data)
                this.products = res.data.data
            })
        },
        async plusItem(index) {
            
                    this.items[index].quantity += 1
            
            await this.caculateTotalPrice();
        },
        async deleteItemByID(id) {
            this.items = this.items.filter(item => item.Product_ID._id !== id);
            await this.caculateTotalPrice();
        },

        async minusItem(index) {
            
                    this.items[index].quantity -= 1
                    
                    if(this.items[index].quantity <= 0){
                        this.deleteItemByID(this.items[index]._id)
                    }

            await this.caculateTotalPrice();
        },
        Check_If_Order_Exits_items(idProduct) {

            for(let i=0; i<this.items.length; i++){
                if(this.items[i].Product_ID._id == idProduct){
                    return i
                }
            }
            return false
            
        },
        findProductByProductID(idProduct) {

            for(let i=0; i<this.products.length; i++){
                if(this.products[i]._id == idProduct){
                    return this.products[i]
                }
            }
            return false
            
        },
        async addProductToOrder(idProduct) {
            console.log("check",this.Check_If_Order_Exits_items(idProduct))
            if(this.Check_If_Order_Exits_items(idProduct)===false){
                const item = {
                    Order_ID : this.$route.params.id,
                    Product_ID : await this.findProductByProductID(idProduct),
                    quantity : 1
                }
                this.items.push(item)      
                console.log( "items after add" ,this.items)
                
            }else{
                this.items[this.Check_If_Order_Exits_items(idProduct)].quantity += 1
            } 
            await this.caculateTotalPrice();
        },

        caculateTotalPrice() {
           this.totalPrice = 0;
            for(let i=0; i<this.items.length; i++){

                this.totalPrice += this.items[i].Product_ID.price * this.items[i].quantity
            }

            return this.totalPrice
            
        },

        
        async updateOrder() {

            
            const data = { 
                orderID : this.$route.params.id,
                items: this.items
            }

            apiJson.post(`/api/admin/orderItems/updateOrder`, JSON.stringify(data)).then(res => {
                console.log(res.data)
                if (res.data.success) {
                   // this.$router.go();
                   this.msg = "update order successfully"
                }
            })


        },

    }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
</style>






<style src="vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"/>
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

    width: 20%;
    padding: 10px;
    margin-top: 30px;
}

.form-user{
    background-color: white;
    margin-top: 64px;
    width: 100%;
    height: 150px;
    border: 1px solid gray;
    padding: 5px;
}

.list-products {
    margin-left: 20px;
}

.list-items {
    margin-left: 40px;
}

/* 
.inside-form{
  background-color: white;
  width: 100%;
  height: 350px;
  border: 1px solid gray;
  padding: 5px;
} */



.ps {
    background-color: white;
    width: 100%;
    height: 480px;
    border: 1px solid gray;
    padding: 5px;
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
