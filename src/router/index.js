import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Foods.vue')
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
    component: () => import('../views/CreateMealPlan.vue')
  },
  {
    path: '/meal_plans/:meal_plan_id',
    name: 'meal_plan',
    component: () => import('../views/MealPlan.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
