import Vue from 'vue'
import Router from 'vue-router'
import Schedule from './views/Schedule'
import ScheduleApollo from './views/ScheduleApollo'
import Favorites from './views/Favorites'
import About from './views/About'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'schedule',
      component: Schedule
    },
    {
      path: '/scheduleApollo',
      name: 'scheduleApollo',
      component: ScheduleApollo
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: Favorites
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
  ]
})
