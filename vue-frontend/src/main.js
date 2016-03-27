import Vue from "vue"
import LoginForm from "./LoginForm.vue"
import ProblemList from "./ProblemList.vue"
import ProblemDetail from "./ProblemDetail.vue"
import MemberService from "./MemberService.vue"

Vue.use(require("vue-resource"));

new Vue({
  el: "body",
  components: { LoginForm, ProblemList, ProblemDetail, MemberService }
})
