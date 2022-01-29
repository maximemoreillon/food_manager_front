<template>
  <v-card>

    <v-card-title>Meal plans</v-card-title>

    <v-card-text>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="meal_plans"
        @click:row="row_clicked($event)"
        sort-by="date"
        sort-desc>

        <template v-slot:top>
          <v-toolbar
            flat>
            <v-row align="center">
              <v-col>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  hide-details/>
              </v-col>
              <v-spacer/>
              <v-col cols="auto">
                <v-btn
                  :to="{name: 'new_meal_plan'}">
                  <v-icon>mdi-plus</v-icon>
                  <span class="ml-2">New</span>
                </v-btn>
              </v-col>
            </v-row>

          </v-toolbar>
        </template>

        <template v-slot:item.date="{ item }">
          <span>{{formatted_date(item.date)}}</span>
        </template>

        <template v-slot:item.calories="{ item }">
          <!-- <CaloriesProgress :calories="item.calories" /> -->
          <div class="chart_wrapper">
            <CalorieCountChart
              :options="chart_options"
              :calories="item.calories"/>
          </div>
        </template>


        <template v-slot:item.macronutrients="{ item }">
          <div class="chart_wrapper">
            <MacronutrientChart
              :options="chart_options"
              :protein="item.protein"
              :fat="item.fat"
              :carbohydrates="item.carbohydrates" />
          </div>
        </template>

        <template v-slot:item.incomplete="{ item }">
          <v-icon
            color="#c00000"
            v-if="item.incomplete">
            mdi-alert
          </v-icon>
        </template>





      </v-data-table>
    </v-card-text>


  </v-card>
</template>

<script>
import MacronutrientChart from '@/components/MacronutrientChart.vue'
// import CaloriesProgress from '@/components/CaloriesProgressCircular.vue'
import CalorieCountChart from '@/components/CalorieCountChart.vue'

export default {
  name: 'Foods',
  components: {
    MacronutrientChart,
    CalorieCountChart,
    // CaloriesProgress
  },
  data: () => ({
    search: '',
    meal_plans: [],
    chart_options: {
      legend: {show: false},
      dataLabels: {enabled: false},
    },
    headers: [
      {text: 'Name', value: 'name'},
      {text: 'Date', value: 'date'},
      {text: 'Calories', value: 'calories'},
      {text: 'Macronutrients', value: 'macronutrients'},
      {text: 'Incomplete', value: 'incomplete'},

      // {text: 'Protein', value: 'protein'},
      // {text: 'Fat', value: 'fat'},
      // {text: 'Carbohydrates', value: 'carbohydrates'},

    ]
  }),
  mounted(){
    this.get_foodd()
  },
  methods:{
    get_foodd(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/meal_plans`
      this.axios.get(url)
      .then(({data}) => {
        this.meal_plans = data
      })
      .catch(error => {
        console.error(error)
      })

    },
    formatted_date(date_string){
      const date = new Date(date_string)
      return date.toLocaleString()
    },
    row_clicked(item){
      this.$router.push({name: 'meal_plan', params: {meal_plan_id: item._id}})
    },

  },
}
</script>

<style scoped>
.chart_wrapper {
  display: inline-flex;
  align-items: center;
  width: 10em;
  height: 10em;
}
</style>
