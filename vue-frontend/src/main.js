import Vue from "vue"
import LoginForm from "./LoginForm.vue"

Vue.use(require("vue-resource"));

new Vue({
  el: "body",
  components: { LoginForm }
})
