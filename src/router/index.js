import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/foods',
    name: 'foods',
    component: () => import('../views/Foods.vue')
  },
  {
    path: '/foods/new',
    name: 'create_food',
    component: () => import('../views/CreateFood.vue')
  },
  {
    path: '/foods/:food_id',
    name: 'food',
    component: () => import('../views/Food.vue')
  },
  {
    path: '/meal_plans',
    name: 'meal_plans',
    component: () => import('../views/MealPlans.vue')
  },
  {
    path: '/meal_plans/new',
    name: 'new_meal_plan',
    component: () => import('../views/MenuBuilder.vue')
  },
  {
    path: '/meal_plans/:meal_plan_id',
    name: 'meal_plan',
    component: () => import('../views/MenuBuilder.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
