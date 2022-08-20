<template>
    <div class="flexible-content">
        <SlideBar />
        <p class="h3" style="text-align: center">Orders</p>


        <table class="table align-middle mb-0 bg-white">
            <thead class="bg-light">
                <tr>
                    <th>Username</th>
                    <th>Phone</th>
                    <th>Total Price</th>
                    <th>List Items</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, index) in pageOfItems" :key="order._id">
                    <td>
                        <p class="fw-normal mb-1" v-if="order.User_ID.name">{{ order.User_ID.name }}</p>

                    </td>
                    <td>
                        <p class="fw-normal mb-1" v-if="order.User_ID.phone">{{ order.User_ID.phone }}</p>

                    </td>
                    <td>
                        <p class="fw-normal mb-1" v-if="order.totalPrice">{{ new Intl.NumberFormat('vi-VN', {
                                style:
                                    'currency', currency: 'VND'
                            }).format(order.totalPrice)
                        }}</p>
                    </td>

                    <td>
                        <perfect-scrollbar>

                            <div v-for="item in order.items" v-bind:key="item._id">

                                <div class="flex">
                                    <div class="d-flex align-items-center">
                                        <img :src="url_vue + item.Product_ID.image" class="rounded-circle" alt=""
                                            style="width: 45px; height: 45px" />
                                        <div class="ms-3">
                                            <p class="fw-bold mb-1" v-if="item.Product_ID.name">{{ item.Product_ID.name
                                            }}</p>
                                        </div>

                                        <div class="ms-3">
                                            <p class="fw-bold mb-1" v-if="item.Product_ID.price"> Price: {{ new
                                                    Intl.NumberFormat('vi-VN', {
                                                        style: 'currency', currency: 'VND'
                                                    }).format(item.Product_ID.price)
                                            }} </p>
                                        </div>

                                        <div class="ms-3">
                                            <p class="fw-bold mb-1" v-if="item.Product_ID.price"> Quantity:
                                                {{ item.quantity }} </p>
                                        </div>

                                    </div>

                                </div>

                            </div> 

                        </perfect-scrollbar>


                    </td>


                    <td>
                        <button type="button" class="btn btn-outline-primary" data-mdb-ripple-color="dark"
                            v-on:click="editOrder(order._id, index)">
                            Edit
                        </button>

                        <button type="button" class="btn btn-outline-danger" data-mdb-ripple-color="dark"
                            v-on:click="deleteOrder(order._id)">
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <jw-pagination :items="orders_tmp" @changePage="onChangePage"   :labels="customLabels" ></jw-pagination>
         </div>
    </div>
</template>

<script>
import api from "../api/apiServices.ts";
import SlideBar from "./SlideBar.vue";
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'
//import AddUserDiaLog from "./AddUserDiaLog.vue"
//import axios from "axios";



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
            orders: [],
            orders_tmp: [],
            users: [],
            items: [],
            totalPrice: null,
            pageOfItems: [],
            customStyles,
            customLabels
        }
    },
    async created() {
        await this.getAllOrder();
        await this.getAllOrderItems();
        this.orders_tmp = await this.fillOrderItemsToOrder();

        console.log("order filled", this.orders_tmp)


    },
    methods: {

        editOrder(idOrder, index) {
            this.$router.push({
                name: "editOrder",
                query: { orders: JSON.stringify(this.orders_tmp[index]) },
                params: { id: idOrder }
            });
        },
        getAllOrder() {
            return api.get("/api/admin/orders").then(res => {

                this.orders = res.data.data
                console.log("order", this.orders)
            })
        },
        getAllOrderItems() {
            return api.get("/api/admin/orderItems").then(res => {
                this.items = res.data.data
                console.log("items", this.items)
            })
        },
         onChangePage(pageOfItems) {
            // update page of items
            this.pageOfItems = pageOfItems;
       },

        getAllOrderItemsByOrderID(id, element) {
            const items = []

            for (let i = 0; i < this.items.length; i++) {

                if (this.items[i].Order_ID == id) {
                    items.push(this.items[i])
                    this.orders[element].totalPrice += this.items[i].Product_ID.price * this.items[i].quantity // update total price to orders
                }
            }
            return items
        },
        deleteOrder(id) {
            this.$dialog
                .confirm("Please confirm to continue delete user")
                .then(function () {
                    api.delete(`/api/admin/orders/${id}`).then((res) => {
                        console.log(res.data);
                        window.location.reload();
                    })
                })
                .catch(function () {
                    console.log("Clicked on cancel");
                });
        },

        async fillOrderItemsToOrder() {
            for (let i = 0; i < this.orders.length; i++) {
                this.orders[i].items = await this.getAllOrderItemsByOrderID(this.orders[i]._id, i)
            }
            return this.orders
            
        }
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
.pagination{
    margin: auto;
}
.card.card-cascade h3,
.card.card-cascade h4 {
    margin-bottom: 0;
}

.flex {
    display: inline-flex;
}

.ps {
    background-color: white;
    width: 100%;
    height: 150px;
    padding: 5px;
}
</style>
