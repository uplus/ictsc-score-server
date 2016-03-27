<template><div></div></template>

<script>
export default {
  data: () => {
    return {
      logged_in: false,
      member_id: null,
      member: null
    }
  },

  ready: function() {
    this.doCheckLoggedIn()
  },

  methods: {
    doCheckLoggedIn() {
      this.$http.get("/api/session").then(
        (response) => {
          if (response.data.status == "not_logged_in") {
            this.$root.$broadcast("member:logout");
            this.member = null;
            this.logged_in = false;
          } else {
            this.$root.$broadcast("member:login:success");
            this.logged_in = true;
            this.member_id = response.data.member_id;
            this.doFetchMember();
          }
        }, (response) => {
          // fail
          console.error("doCheckLoggedIn failed");
          console.dir(response);
          this.$root.$broadcast("member:logout");
        }
      );
    },
    doLogin(login, password) {
      this.$http.post("/api/session", {login: login, password: password}).then(
        (response) => {
          if (response.data.status == "success") {
            this.$root.$broadcast("member:login:success");
          } else {
            this.$root.$broadcast("member:login:fail");
          }
        }, (response) => {
          // fail
          console.error("doLogin failed");
          console.dir(response);
        }
      );
    },

    doFetchMember() {
      this.$http.get(`/api/members/${this.member_id}`).then(
        (response) => {
          this.member = response.data;
          this.$root.$broadcast("member:update");
        }, (response) => {
          // fail
          this.member = null
          this.$root.$broadcast("member:update");
          console.error("doFetchMember failed");
          console.dir(response);
        }
      );
    }
  },

  events: {
    "member:doLogin": "doLogin"
  }

}
</script>

<style></style>
