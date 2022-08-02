<template>
    <div class="flexible-content">
        <SlideBar />
        <h2 class="title"> Add User </h2>
        <div class="flex">

            <div class="img_block">
                <h4 style="text-align: center; margin: 20px;"> User avatar </h4>
                <img class="img"  v-if="url" :src="url"   alt="IMG">
                <input accept="image/*" type="file" id="avatar" name="avatar" @change="onFileChange" />
            </div>


            <form class="form-input">
                <label for="name"> User Name </label>
                <input type="text" id="fname" name="fname">

                <label for="lname"> Email </label>
                <input type="text" id="lname" name="lname">

                <label for="fname">Password</label>
                <input type="text" id="fname" name="fname">

                <label for="fname">Re Enter Password </label>
                <input type="text" id="fname" name="fname">

                <label for="lname">Phone</label>
                <input type="text" id="lname" name="lname">

                <label for="lname">Role</label>
                <select class="option-control" :required="true">
                    <option v-for="role in roles" v-bind:key="role.id" :selected="role == 'user'">{{ role.name }}
                    </option>
                </select>

                <div class="fm-btn flex"> 
                    <button type="button" class="btn btn-primary"> Save </button>
                    <button type="button" class="btn btn-secondary"> Close </button>
                </div>

            </form>
        </div>
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

    data() {
        return {
            url: null
        }
    },
    methods: {
        onFileChange(e) {
            const file = e.target.files[0];
            this.url = URL.createObjectURL(file);
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
