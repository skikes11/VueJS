<template>
  <div class="container mx-auto px-4 h-full" style="margin-top: 200px">
    <div class="flex content-center items-center justify-center h-full">
      <div class="w-full lg:w-4/12 px-4">
        <div
          class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0"
        >
          <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div class="text-blueGray-400 text-center mb-3 font-bold">
              <h3 style="color: black">Login</h3>
            </div>
            <form>
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  v-model="email"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Email"
                />
              </div>

              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  v-model="password"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Password"
                />
              </div>
              <div>
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    id="customCheckLogin"
                    type="checkbox"
                    class="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  />
                  <span class="ml-2 text-sm font-semibold text-blueGray-600">
                    Remember me
                  </span>
                </label>
              </div>

              <div class="text-center mt-6">
                <button
                  class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  v-on:click="login()"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "../assets/styles/index.css";
import "../assets/styles/tailwind.css";
import api from "../api/apiServices.ts";
export default {
  name: "Login",

  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        // console.warn(this.email, this.password)

        let formData = new FormData();
            formData.append('email', this.email)
            formData.append('password', this.password)

         api
          .post("/api/auth/login", formData)
          .then((res) => {
            console.log(res);
            if(res.data.success){
            localStorage.setItem("userToken", res.data.userToken);
            //localStorage.setItem("userToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyY2JmNmNjYWY2ZWE2ODMyODc2MDk2MCIsInJvbGUiOnsiX2lkIjoiNjJjNjljNDFmNTg5ZDY5YTk5YjYzNmRhIiwibmFtZSI6ImFkbWluIn0sImlhdCI6MTY1OTQxMzI5MCwiZXhwIjoxNjkwOTQ5MjkwfQ.MVf3EdfExKv2QKFyFcE7yySIjSeTI8U7zTHH-g15nOg");
            this.$router.go({ name: "Dashboard" });
            }else{
            this.$router.go();
            }
          }).catch((err)=>{
              console.warn(err)
          });

        
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style>
.body {
  background-color: blue;
}
</style>
