<template>
    <div class="flexible-content">
        <SlideBar />
        <h2 class="title">Add Role</h2>



        <form class="form-input">
            <h5 style="color:red;text-align:center" v-if="msg"> {{ msg }}</h5>
            <label for="name"> Role Name </label>
            <input type="text" id="fname" name="fname" v-model="name" />

            <label for="lname">Description</label>
            <input type="text" id="lname" name="lname" style="height: 100px" v-model="des">

            <label for="fname">Permission</label>


            <select class="option-control"  :required="true" v-model="permission">
          <option v-for="permission in permissions"  :value="permission" v-bind:key="permission._id">
            endpoint:  {{ permission.endpoint }}, method: {{ permission.method }}
          </option>
        </select>

         <button type="button" class="btn btn-success" v-on:click="addPermission()">ADD</button>

        <div class="inside-form">
        
        <p class="fw-normal mb-1" v-for="item in selected"  v-bind:key="item._id" > 
         endpoint:  {{ item.endpoint }}, method: {{ item.method }}    
         <i style="margin-left: 10px" class="fas fa-trash" @click="deleteSelected(item._id)" ></i>
        </p>

        </div>


            <div class="fm-btn flex">
                <button type="button" class="btn btn-primary" v-on:click="addRole()">Save</button>
                <button type="button" class="btn btn-secondary" v-on:click="close()">Close</button>
            </div>
        </form>

    </div>
</template>

<script>
//import { ref } from "vue";
import api from "../api/apiServices.ts";
import SlideBar from "./SlideBar.vue";
//import Multiselect from 'vue-multiselect'

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
            permissions: [],
            permissions_clone: [],
            permission: "",
            selected: [],
            des: "",
            msg: null
        }
    },
    created() {
        this.getAllPermission();

    },
    methods: {
        onFileChange(e) {
            const file = e.target.files[0];
            this.url = URL.createObjectURL(file);

        },
        close(){
          this.$router.push({name: "Role"})
        },
        getAllPermission() {
            
            api.get("/api/admin/permissions").then(res => {
                console.log(res.data);
                this.permissions = res.data.data
                this.permissions_clone = res.data.data.slice()
                this.permission = res.data.data[0]
            })
        },
       async addRole() {
            
            let formData = new FormData();
            formData.append('name', this.name)
            formData.append('description', this.des)
            
            api.post(`/api/admin/roles`,{
                name: this.name,
                description: this.description
            }).then(async(res) => {
                console.log(res.data)
                if (res.data.success) {

                    const role = res.data.data

                    for(let i=0; i< this.selected.length; i++){
                        await this.addPermissionToRole(role._id, this.selected[i].method, this.selected[i].endpoint)
                    }

                    this.$router.push({ name: "Role" });
                } else {
                    this.msg = res.data.message
                    this.$route.go();
                }

            }).catch(err => {
                console.log(err)
            })


        },
        addPermission(){
            this.selected.push(this.permission)
            this.permissions = this.permissions_clone.filter((o1) => !this.selected.some((o2) => o1._id === o2._id));
        },
        deleteSelected(id){
            this.selected = this.selected.filter(item => item._id !== id);
            this.permissions = this.permissions_clone.filter((o1) => !this.selected.some((o2) => o1._id === o2._id));
            console.log("deleted: ", this.selected)
        },
        addPermissionToRole(roleID, method, endpoint){
            return api.post(`/api/admin/permissions`, {
                Role_ID: roleID,
                method: method,
                endpoint: endpoint
            }).then(res=>{
                console.log(res.data)
            })
        }
    },



};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

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
    margin: auto;
    width: 40%;
    padding: 10px;
    margin-top: 30px;
}

.inside-form{
  background-color: white;
  width: 100%;
  height: 350px;
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
