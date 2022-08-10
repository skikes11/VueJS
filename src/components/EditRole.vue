<template>
    <div class="flexible-content">
        <SlideBar />
        <h2 class="title">Edit Role</h2>



        <form class="form-input">
            <h5 style="color:red;text-align:center" v-if="msg"> {{ msg }}</h5>
            <label for="name"> Role Name </label>
            <input type="text" id="fname" name="fname" v-model="name" />

            <label for="lname">Description</label>
            <input type="text" id="lname" name="lname" style="height: 100px" v-model="des">

            <label for="fname">Permission</label>


            <select class="option-control" :required="true" v-model="permission">
                <option v-for="permission in permissions" :value="permission" v-bind:key="permission._id">
                    endpoint: {{ permission.endpoint }}, method: {{ permission.method }}
                </option>
            </select>

            <button type="button" class="btn btn-success" v-on:click="addPermission()">ADD</button>

            <div>

                <perfect-scrollbar>
                    <p class="fw-normal mb-1" v-for="item in role_permissions_change" v-bind:key="item._id">
                        endpoint: {{ item.endpoint }}, method: {{ item.method }}
                        <i style="margin-left: 10px" class="fas fa-trash" @click="deleteSelected(item._id)"></i>
                    </p>
                </perfect-scrollbar>


            </div>


            <div class="fm-btn flex">
                <button type="button" class="btn btn-primary" v-on:click="editRole()">Save</button>
                <button type="button" class="btn btn-secondary">Close</button>
            </div>
        </form>

    </div>
</template>

<script>
//import { ref } from "vue";
import api from "../api/apiServices.ts";
//import apiFormData from "../api/apiFormdata.ts";
import axios from "axios";
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
            name: "",
            permissions: [],
            permissions_clone: [],
            permission: "",
            role_permissions: [],
            role_permissions_change: [],
            selected: [],
            role: null,
            des: "",
            msg: null
        }
    },
    async created() {
        await this.getAllPermission();
        await this.getRoleByID();
        await this.getPermissionByRoleID(this.$route.params.id);
        this.check_permission_exist_in_role_and_delete_in_select_option();

    },
    methods: {
        check_permission_exist_in_role_and_delete_in_select_option() {
            this.permissions = this.permissions_clone.filter((o1) => !this.role_permissions_change.some((o2) => o1._id === o2._id));

        },
        getAllPermission() {

            return api.get("/api/admin/permissions").then(res => {
                console.log(res.data);
                this.permissions = res.data.data
                this.permissions_clone = res.data.data.slice();
                this.permission = res.data.data[0]
            })
        },
        getPermissionByRoleID(id) {
            return api.get(`/api/admin/permissions/${id}`).then((res) => {
                this.role_permissions = res.data.data.slice(0) //Object.assign({}, res.data.data)
                this.role_permissions_change = res.data.data.slice(0) //Object.assign({}, res.data.data)
                console.log("per$$$", res.data)
            })
        },
        getRoleByID() {
            return api.get(`/api/admin/roles/${this.$route.params.id}`).then(res => {
                console.log("role##", res.data);
                const role = res.data.data
                this.name = role.name
                this.des = role.description

            })
        },
        async editRole() {

            console.log("$$old per", this.role_permissions)
            console.log("$$new per", this.role_permissions_change)

            console.log("same%%", this.check_same_permission(this.role_permissions, this.role_permissions_change))

            const same_permission = this.check_same_permission(this.role_permissions, this.role_permissions_change)

            const delete_permission = this.check_different_permission(this.role_permissions, same_permission)

            const add_permission = this.check_different_permission(this.role_permissions_change, same_permission)
            // id: 1, type: 'add'
            // id: 2. type: 'del'



            let formData_update = new FormData();

            formData_update.append('data_del', JSON.stringify(delete_permission));
            formData_update.append('data_add', JSON.stringify(add_permission));
            formData_update.append('id', this.$route.params.id)


            axios({
                method: "post",
                url: `${process.env.VUE_APP_URL}/api/admin/permissions/updateRole`,
                data: formData_update,
                headers: { "Content-Type": "multipart/form-data" },
            }).then(function (response) {
                //handle success
                console.log(response);
            }).catch(function (response) {
                //handle error
                console.log(response);
            });

            // apiFormData.post(`/api/admin/permissions/updateRole`,formData_update).then(res=>{
            //     console.log(res.data)
            //    if(res.data.success){
            //     this.$router.go();
            //     }
            // })



            console.log("add##", add_permission)
            console.log("delete$$", delete_permission)




        },
        addPermission() {
            this.role_permissions_change.push(this.permission)
            this.permissions = this.permissions_clone.filter((o1) => !this.role_permissions_change.some((o2) => o1._id === o2._id));
            console.log("old after add new", this.role_permissions)
        },
        deleteSelected(id) {
            this.role_permissions_change = this.role_permissions_change.filter(item => item._id !== id);
            this.permissions = this.permissions_clone.filter((o1) => !this.role_permissions_change.some((o2) => o1._id === o2._id));
        },
        check_same_permission(permission_old, permission_new) {
            let result = null;
            console.log("###", permission_new.length, permission_old.length)
            if (permission_new.length > permission_old.length) {
                result = permission_new.filter((o1) => permission_old.some((o2) => o1._id === o2._id));
                console.log("gt");
            } else {
                result = permission_old.filter((o1) => permission_new.some((o2) => o1._id === o2._id));
            }
            return result
        },
        check_different_permission(r1, r2) {
            const result = r1.filter((o1) => !r2.some((o2) => o1._id === o2._id));
            return result
        }
    },



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
    margin: auto;
    width: 40%;
    padding: 10px;
    margin-top: 30px;
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
