<template></template>

<script>
export default {
  data: () => {
    return {
      logged_in: false,
      member: null
    }
  },

  ready: function() {
    this.$http.get("/api/session").then(
      (response) => {
        if (response.data.status == "not_logged_in") {
          this.$root.$broadcast("member:logout");
          this.member = null;
          this.logged_in = false;
        } else {
          this.$root.$broadcast("member:login");
        }
      }, (response) => {
        // fail
        console.dir(response);
        this.$root.$broadcast("member:logout");
      }
    );
  },

  methods: {
    doLogin(login, password) {
      this.$http.post("/api/session", {login: login, password: password}).then(
        (response) => {
          console.dir(response.data);
          if (response.data.status == "success") {
            this.$root.$broadcast("member:login");
          } else {
            this.$root.$broadcast("member:logout");
          }
        }, (response) => {
          // fail
          this.$root.$broadcast("member:logout");
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
