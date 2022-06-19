<template>
  <v-card>

    <v-toolbar flat>
      <v-row align="center">
        <v-col>
          <v-toolbar-title>
            Meal plans
          </v-toolbar-title>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn :to="{name: 'new_meal_plan'}">
            <v-icon>mdi-plus</v-icon>
            <span class="ml-2">New meal plan</span>
          </v-btn>
        </v-col>
      </v-row>

    </v-toolbar>

    <v-card-text>
      <v-data-table :loading="loading" :search="search" :headers="headers" :items="meal_plans" sort-by="date" sort-desc
        :server-items-length="total" :options.sync="options">



        <template v-slot:item.name="{ item }">
          <router-link :to="{ name: 'meal_plan', params: { meal_plan_id: item._id } }">
            {{item.name}}
          </router-link>
        </template>

        <template v-slot:item.date="{ item }">
          <span>{{formatted_date(item.date)}}</span>
        </template>

        <!-- <template v-slot:item.calories="{ item }">
          <div v-if="item.calories" class="chart_wrapper">
            <CalorieCountChart :options="chart_options" :calories="item.calories" :target="item.calories_target" />
            <span class="value">
              {{item.calories}}/{{item.calories_target || $store.state.user_configuration.calories_target}}
            </span>
          </div>
          <span v-else>N/A</span>
        </template> -->

        <template v-slot:item.calories="{ item }">
          <CalorieMacros :target="item.calories_target" :calories="item.calories" :macronutrients="item.macronutrients" />
        </template>


        <template v-slot:item.macronutrients="{ item }">
          <div v-if="item.macronutrients" class="chart_wrapper">
            <MacronutrientChart :options="chart_options" :protein="item.macronutrients.protein"
              :fat="item.macronutrients.fat" :carbohydrates="item.macronutrients.carbohydrates" />
          </div>
          <span v-else>N/A</span>
        </template>

        <template v-slot:item.incomplete="{ item }">
          <v-icon color="#c00000" v-if="item.incomplete">
            mdi-alert
          </v-icon>
        </template>





      </v-data-table>
    </v-card-text>


  </v-card>
</template>

<script>
// import MacronutrientChart from '@/components/MacronutrientChart.vue'
// import CalorieCountChart from '@/components/CalorieCountChart.vue'
import CalorieMacros from '../components/CalorieMacros.vue'

export default {
  name: 'Foods',
  components: {
    // MacronutrientChart,
    // CalorieCountChart,
    CalorieMacros
  },
  data: () => ({
    search: '',
    loading: false,
    meal_plans: [],
    chart_options: {
      legend: {show: false},
      dataLabels: {enabled: false},
    },
    options: {},
    total: 0,
    headers: [
      {text: 'Name', value: 'name'},
      {text: 'Date', value: 'date'},
      {text: 'Calories', value: 'calories'},
      // {text: 'Macronutrients', value: 'macronutrients'},
      {text: 'Incomplete', value: 'incomplete'},

    ]
  }),
  mounted(){
    this.get_meal_plans()
  },
  watch: {
    options: {
        handler () {
          this.get_meal_plans()
        },
        deep: true,
      },
  },
  methods:{
    get_meal_plans(){
      this.loading = true
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/meal_plans`
      const { itemsPerPage, page } = this.options
      const params = { limit: itemsPerPage, skip: ( page - 1 ) * itemsPerPage }

      this.axios
        .get(url, { params })
        .then(({data}) => {
          this.meal_plans = data.items
          this.total = data.total
        })
        .catch(error => {
          console.error(error)
        })
        .finally( () => {
          this.loading = false
        })

    },
    formatted_date(date_string){
      const date = new Date(date_string)
      return date.toLocaleString()
    },

  },
}
</script>

<style scoped>
.chart_wrapper {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 10em;
  height: 10em;
  position: relative;
}

.value{
  position: absolute;
}
</style>
