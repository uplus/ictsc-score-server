<template>
  <div>
    <div class="row">
      <div class="col-6">
        <problem :id="problemId"></problem>
      </div>
      <div class="col-6" v-loading="answersLoading">
        <problem-mode-switch
          :problemId="problemId"
          :teamId="teamId"
          :answers="answers"></problem-mode-switch>
        <template v-for="answer in currentAnswers">
          <answer :value="answer" :reload="reload"></answer>
        </template>
        <div class="new-issue">
          <simple-markdown-editor v-model="newAnswer"></simple-markdown-editor>
          <div class="tools">
            <button v-on:click="postNewIssue()" class="btn btn-success">解答投稿</button>
          </div>
          <div v-if="!canAnswer" class="overlay">
            {{ scoringCompleteTime | dateRelative }}に解答送信が可能になります。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.new-issue {
  position: relative;
  padding: 2rem 0;
}
.new-issue .overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .3);
  z-index: 1;
  font-size: 1.5rem;
  text-align: center;
  padding-top: 15rem;
}

</style>

<script>
import { SET_TITLE } from '../store/'
import { API } from '../utils/Api'
import Problem from '../components/Problem'
import Answer from '../components/Answer'
import ProblemModeSwitch from '../components/ProblemModeSwitch'
import SimpleMarkdownEditor from '../components/SimpleMarkdownEditor'
import {
  Emit,
  PUSH_NOTIF,
  REMOVE_NOTIF
} from '../utils/EventBus'
import { dateRelative } from '../utils/Filters'

export default {
  name: 'problem-answers',
  components: {
    Problem,
    SimpleMarkdownEditor,
    Answer,
    ProblemModeSwitch,
  },
  filters: {
    dateRelative,
  },
  data () {
    return {
      newAnswer: '',
      currentDate: new Date(),
    }
  },
  asyncData: {
    answersDefault: [],
    answers () {
      return API.getTeamWithAnswersComments(this.teamId).then(res => res.answers)
    },
    contentDefault: {},
    contest () {
      return API.getContest();
    },
  },
  computed: {
    problemId () {
      return '' + this.$route.params.id;
    },
    teamId () {
      return '' + this.$route.params.team;
    },
    currentAnswers () {
      if (!this.answers) return [];
      return this.answers
        .filter(i => '' + i.problem_id === this.problemId)
        .filter(i => '' + i.team_id === this.teamId)
        // .filter(i => this.issueId === undefined || '' + i.id === this.issueId);
    },
    // 採点のディレイタイム(ms)
    delay () {
      return ((this.contest && this.contest.answer_reply_delay_sec) ? this.contest.answer_reply_delay_sec : 0) * 1000;
    },
    // 採点中のAnswers
    scoringAnswers () {
      return this.answers
        .filter(ans => `${ans.problem_id}` === this.problemId)
        .filter(ans => ans.completed && !ans.score)
        .filter(ans => this.currentDate < new Date(ans.completed_at).valueOf() + this.delay)
    },
    // 回答可能かどうか
    canAnswer () {
      return this.scoringAnswers.length === 0;
    },
    // 採点が完了する時間(ms)
    scoringCompleteTime () {
      return this.scoringAnswers
        .reduce((p, n) => Math.max(p, new Date(n.completed_at).valueOf() + this.delay), 0)
    },
  },
  watch: {
    teamId () {
      this.asyncReload('answers');
    },
  },
  mounted () {
    this.$store.dispatch(SET_TITLE, '解答一覧');
    setInterval(() => {
      this.currentDate = new Date();
    }, 200)
  },
  destroyed () {
  },
  methods: {
    async postNewIssue () {
      try {
        Emit(REMOVE_NOTIF, msg => msg.key === 'answer');

        var answers = await API.getAnswersWithComments();
        var filteredAnswer = answers
          .filter(i => '' + i.problem_id === this.problemId)
          .filter(i => '' + i.team_id === this.teamId);

        // 解答が無い・最後の解答がcompletedである場合、新規作成
        var answer;
        if (filteredAnswer.length === 0 || filteredAnswer[filteredAnswer.length - 1].completed) {
          answer = await API.postAnswers(this.teamId, this.problemId);
        } else {
          answer = filteredAnswer[filteredAnswer.length - 1]
        }

        await API.addAnswerComment(answer.id, this.newAnswer);

        this.newAnswer = '';
        this.reload();
        Emit(PUSH_NOTIF, {
          type: 'success',
          title: '投稿しました',
          detail: '',
          key: 'answer',
        });
      } catch (err) {
        console.error(err);
        Emit(PUSH_NOTIF, {
          type: 'error',
          title: '投稿に失敗しました',
          key: 'answer',
        });
      }
    },
    reload () {
      this.asyncReload();
    }
  },
}
</script>