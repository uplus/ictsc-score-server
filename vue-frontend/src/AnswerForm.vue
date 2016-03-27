<template lang="jade">
.answer-cover("v-show" = "show_answer", transition = "show", "@click" = "hide")
  .answer-wrap.clearfix("@click.stop" = "")
    h1 解答の提出
    form(@submit.prevent="doSend")
      .form-item
        label(for = "text")
        textarea(name = "text", v-model = "text", placeholder = "Text", required)
      .form-error("v-show" = "show_error") Text is empty.
      .button-wrap
        input.button#answer(type = "submit", title = "Submit", value = "Submit")
</template>

<script>
export default {
  data: () => {
    return {
      text: null,
      show_answer: false,
      show_error: false,
    }
  },

  ready: function() {
  },

  methods: {
    show() {
      this.show_answer = true;
    },
    showError() {
      this.show_error = true;
    },
    hide() {
      this.show_answer = false;
      this.show_error = false;
    },
    doSend() {
      this.show_error = false;

      this.$http.post("/api/answers", {
        text: this.text,
        problem_id: this.$parent.problemId
      }).then(
        (response) => {
          this.$root.$broadcast("answer:send:success");
          this.hide();
        }, (response) => {
          // fail
          console.error("doSend failed");
          console.dir(response);
          this.$root.$broadcast("answer:send:fail");
          this.show_error = true; // NOTE: change error message
        }
      );
    }
  },

  events: {
    "answerForm:show": "show",
    "answerForm:hide": "hide"
  }

}
</script>

<style lang="scss" scoped>
.answer-cover {
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

  h1 {
    font-weight: bold;
    font-size: 24px;
    margin-bottom: 10px;
  }

  .answer-wrap {
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

  textarea {
    width: 512px;
    resize: vertical;
  }

  .button-panel {
    width: 100%;
  }

  .button#answer {
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
