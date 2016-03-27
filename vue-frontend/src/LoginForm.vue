<template lang="jade">
.signin-cover("v-show" = "show_login", transition = "show")
  .signin-wrap.clearfix
    .header-logo
      a(href = "") ICTSC5
    .form-message Enter your email address and password.
    form(@submit.prevent="doLogin")
      .form-item
        label(for = "login")
        input(type = "text", name = "login", v-model = "login", placeholder = "Login ID", required)
      .form-item
        label(for = "password")
        input(type = "password", name = "password", v-model = "password", placeholder = "Password", required)
      .form-error("v-show" = "show_error") Email address or password is incorrect.
      .button-wrap
        input.button#signin(type = "submit", title = "Sign In", value = "Sign In")
    .fpass
      a(href = "") Forgot password?
</template>

<script>
export default {
  data: () => {
    return {
      show_login: false,
      show_error: false,
      login: null,
      password: null
    }
  },

  ready: function() {
  },

  methods: {
    show() {
      this.show_login = true;
    },
    showError() {
      this.show_error = true;
    },
    hide() {
      this.show_login = false;
      this.show_error = false;
    },
    doLogin() {
      this.show_error = false;
      this.$root.$broadcast("member:doLogin", this.login, this.password);
    }
  },

  events: {
    "loginForm:show": "show",
    "loginForm:hide": "hide",
    "member:login:success": "hide",
    "member:login:fail": "showError",
    "member:logout": "show"
  }

}
</script>

<style lang="scss" scoped>
.signin-cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, .7);

  &.show-transition {
    transition: opacity 0.5s;
  }

  &.show-enter, &.show-leave {
    opacity: 0;
  }

  .signin-wrap {
    display: table;
    color: #3f3f3f;
    background: #ffffff;
    padding: 30px 60px;
    border: 1px solid #ececec;
  }

  .header-logo a {
    background: url(../img/ictsc.gif) no-repeat;
    background-size: 200px 65px;
  }

  .form-message {
    margin-bottom: 10px;
    text-align: center;
  }

  .form-error {
    margin-bottom: 10px;
    color: #e6003b;
  }

  .form-item {
    margin-bottom: 12px;
    width: 100%;

    input {
      width: 100%;
      background: #ffffff;
      border: none;
      border-bottom: 2px solid #e9e9e9;
      color: #666;
      font-family: 'Lato', sans-serif;
      font-size: 1em;
      height: 50px;
      transition: border-color 0.3s;

      &:focus {
        border-bottom: 2px solid #c0c0c0;
        outline: none;
      }
    }
  }

  .button-panel {
    width: 100%;
  }

  .button#signin {
    /*background-image: url(/img/loading.svg);*/
    background-repeat: no-repeat;
    background-position: 50%;
  }
}

.fpass {
  margin-top: 16px;
  text-align: center;

  a:hover {
    text-decoration: underline;
  }
}
</style>
