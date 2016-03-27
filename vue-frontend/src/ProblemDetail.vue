<template lang="jade">
div("v-if" = "problem")
  .title-label Title
  .title
    h1 {{ problem.title }}
  .info
    .info-box.info-no
      .info-title Issues No.
      .info-main= "#{{ problem.id }}"
    .info-box.info-duedate
      .info-title Due Date
      .info-main.info-updated {{ date2str(problem.closed_at) }}
    .info-box
      .info-title Updated
      .info-main {{ date2str(problem.updated_at) }}
  .text {{{ text2html(problem.text) }}}
</template>

<script>
import dateFormat from "dateformat"

export default {
  props: {
    problemId: {
      type: Number,
      required: true
    }
  },

  data: () => {
    return {
      problem: null
    }
  },

  ready: function() {
    this.dateFormat = dateFormat;

    this.$http.get(`/api/problems/${this.problemId}`).then(
      (response) => {
        console.log(response)
        this.problem = response.data;
      }, (response) => {
        // fail
        console.log(response)
        // window.location.pathname = "/";
      }
    );
  },

  methods: {
    date2str: (date) => {
      return dateFormat(date, "mm/dd HH:MM")
    },

    text2html: (text) => {
      return text.replace(/\t/g, "    ")
                 .replace(/  /g, "&nbsp; ")
                 .replace(/  /g, " &nbsp;")
                 .replace(/\r\n|\n|\r/g, "<br>");
    }
  },

  events: {}

}
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  font-weight: bold;
}

.title-label {
  color: #909090;
  font-family: "Lato", sans-serif;
  font-weight: bold;
}

.info {
  width: 840px;
  margin: 20px 0 26px 0;
  padding: 10px;
  display: table;
  background: #f4f4f4;
  font-family: "Lato", sans-serif;
  text-align: center;
}

.info-box {
  width: 33%;
  display: table-cell;
}

.info-no, .info-duedate {
  border-right: 2px solid #ffffff;
}

.info-title {
  color: #909090;
  font-weight: bold;
}

.info-main {
  font-size: 20px;
}

.text {
  width: 100%;

  img {
    max-width: 100%;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
    margin: 10px 0;
  }

  h1 { font-size: 24px; }
  h2 { font-size: 22px; }
  h3 { font-size: 20px; }
  h4 { font-size: 18px; }
  h5 { font-size: 16px; }
  h6 { font-size: 14px; }
}
</style>
