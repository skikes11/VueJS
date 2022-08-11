<template>
    <div class="flexible-content">
        <SlideBar />
        <h2 class="title"> Add product </h2>
        <div class="flex">

            <div class="img_block">
                <h4 style="text-align: center; margin: 20px;"> Image product </h4>
                <img class="img"  v-if="url" :src="url"   alt="IMG">
                <input accept="image/*"  ref="file" type="file"  id="avatar" name="avatar" @change="onFileChange" />
            </div>


            <form class="form-input">
                 <h5 style="color:red;text-align:center" v-if ="msg"> {{msg}}</h5>
                <label for="name" > Product Name </label>
                <input type="text" id="fname" name="fname" v-model="name">

                <label for="lname"> Price </label>
                <input type="text" id="lname" name="lname" v-model="price">

                <label for="fname">Total quantity</label>
                <input type="text" id="fname" name="fname" v-model="total_quantity">

                <label for="fname">Brand </label>
                <input type="text" id="fname" name="fname" v-model="brand">

                <label for="lname">Origin</label>
                <input type="text" id="lname" name="lname" v-model="origin">

                <label for="lname">Description</label>
                <input type="text" id="lname" name="lname" style="height: 100px" v-model="des">

                <div class="fm-btn flex" style="margin-top: 20px">
                    <button type="button" class="btn btn-primary" v-on:click="addProduct()">Save</button>
                    <button type="button" class="btn btn-secondary" v-on:click="close()">Close</button>
                </div>

            </form>
        </div>
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
            name: "",
            price: "",
            total_quantity: "",
            brand: "",
            origin: "",
            des: "",
            image: null,
            msg : null
        }
    },
    created(){

    },
    methods: {
        onFileChange(e) {
            const file = e.target.files[0];
            this.url = URL.createObjectURL(file);
            
        },
        close(){
          this.$router.push({name: "Product"})
        },
        addProduct(){

            let formData = new FormData();
            
            formData.append('name', this.name)
            formData.append('price', this.price)
            formData.append('total_quantity', this.total_quantity)
            formData.append('brand', this.brand)
            formData.append('origin', this.origin)
            formData.append('des', this.des)
            formData.append('avatar', this.$refs.file.files[0])

            console.log(formData)
            api.post("/api/admin/products",formData).then(res=>{
                console.log(res.data)
                if(res.data.success){
                    this.$router.push({name: "Product"})
                }else{
                    this.msg = res.data.message
                    this.$router.go()
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    },

}



</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";

@import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap";

@import "https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/4.3.0/mdb.min.css";

input[type=text] {
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
.img_block{
    margin-left: 180px;
}

</style>
