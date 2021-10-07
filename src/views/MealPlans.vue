<template>
  <v-card>

    <v-card-title>Meal plans</v-card-title>

    <v-data-table
      :search="search"
      :headers="headers"
      :items="meal_plans"
      :items-per-page="-1"
      @click:row="row_clicked($event)">

      <template v-slot:top>
        <v-toolbar
          flat>


          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            hide-details/>

          <v-spacer/>


          <v-btn :to="{name: 'new_meal_plan'}">New meal plan</v-btn>

        </v-toolbar>
      </template>

      <template v-slot:item.keto_friendly="{ item }">
        <v-icon v-if="item.keto_friendly">mdi-check</v-icon>
      </template>





    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: 'Foods',

  data: () => ({
    search: '',
    meal_plans: [],
    headers: [
      {text: 'Date', value: 'date'},

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
    row_clicked(item){
      this.$router.push({name: 'meal_plan', params: {meal_plan_id: item._id}})
    },

  },
}
</script>
