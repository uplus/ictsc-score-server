<template lang="jade">
table.problems-table
  caption
  thead
    tr.table-header
      th.table-no #
      th.table-title Title
      th.table-duedate Due date
      th.table-updated Updated
  tbody("v-for" = "problem in problems")
    tr("data-href" = "/problems/{{ problem.id }}")
      th.table-no
        != '#{{ problem.id }}'
      th.table-title
        a(href = "/problems/{{ problem.id }}") {{ problem.title }}
      th.table-duedate {{ date2str(problem.closed_at) }}
      th.table-updated {{ date2str(problem.opened_at) }}
</template>

<script>
import dateFormat from "dateformat"

export default {
  data: () => {
    return {
      problems: []
    }
  },

  ready: function() {
    this.dateFormat = dateFormat;

    this.$http.get("/api/problems").then(
      (response) => {
        this.problems = response.data;
      },
      (response) => {
        // fail
        window.location.pathname = "/";
      }
    );
  },

  methods: {
    date2str: (date) => {
      return dateFormat(date, "mm/dd HH:MM")
    }
  },

  events: {}

}
</script>

<style lang="scss" scoped>
.problems-table {
  .table-no, .table-duedate, .table-updated {
    text-align: center;
    vertical-align: middle;
  }

  .table-no {
    width: 7%;
  }

  .table-title {
    width: 60%;
  }

  .table-duedate, .table-updated {
    width: 14%;
  }

  tbody tr {
    transition: 0.2s;

    &:hover {
      background: #f7f7f7;
    }

    & + tr {
      border-top: 1px solid #ececec;
    }
  }


  th {
    padding: 18px 1%;
  }

  .problems-header {
    margin-bottom: 6px;
  }
}
</style>
