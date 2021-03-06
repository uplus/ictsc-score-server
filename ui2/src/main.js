import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

import Element from 'element-ui'
Vue.use(Element);
import 'element-ui/lib/theme-default/index.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

import { AsyncDataPlugin } from 'vue-async-data-2'
Vue.use(AsyncDataPlugin)

import App from './App'
import { DefaultStore as store } from './store'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Members from './pages/Members'
import Teams from './pages/Teams'
import TeamDetail from './pages/TeamDetail'
import Problems from './pages/Problems'
import ProblemDetail from './pages/ProblemDetail'
import ProblemIssues from './pages/ProblemIssues'
import ProblemAnswers from './pages/ProblemAnswers'
import Issues from './pages/Issues'
import Answers from './pages/Answers'
import Guide from './pages/Guide'
import Result from './pages/Result'
import NotFound from './pages/NotFound'

const router = new VueRouter({
  routes: [
    { path: '/', component: Dashboard, name: 'dashboard' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/signup', component: Signup, name: 'signup' },
    { path: '/members', component: Members, name: 'members' },
    { path: '/teams', component: Teams, name: 'teams' },
    { path: '/teams/:id', component: TeamDetail, name: 'team-detail' },
    { path: '/problems', component: Problems, name: 'problems' },
    { path: '/problems/:id', component: ProblemDetail, name: 'problem-detail' },
    { path: '/problems/:id/:team/issues/:issue?', component: ProblemIssues, name: 'problem-issues' },
    { path: '/problems/:id/:team/answers', component: ProblemAnswers, name: 'problem-answers' },
    { path: '/issues', component: Issues, name: 'issues' },
    { path: '/answers', component: Answers, name: 'answers' },
    { path: '/guide', component: Guide, name: 'guide' },
    { path: '/result', component: Result, name: 'result' },
    { path: '*', component: NotFound, name: 'not-found' },
  ]
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
  store,
})
