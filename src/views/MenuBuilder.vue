<template>
  <v-card>

    <v-toolbar flat>
      <v-toolbar-title>Meal plan {{meal_plan_id}}</v-toolbar-title>
      <v-spacer/>
      <v-btn
        icon
        @click="save_meal_plan()">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <v-btn
        icon
        color="#c00000"
        v-if="meal_plan_id"
        @click="delete_meal_plan()">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider/>

    <v-card-text>

      <v-progress-linear
        :value="100 * total_calories / calories_target"
        height="50">
        {{total_calories}} / {{calories_target}}
      </v-progress-linear>

    </v-card-text>

    <v-card-text>
      <v-row>
        <v-col>
          <v-data-table
            height="500"
            class="elevation-1"
            :search="search"
            :headers="food_list_headers"
            :items="foods"
            :items-per-page="-1">

            <template v-slot:top>
              <v-toolbar flat>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  hide-details/>
              </v-toolbar>
            </template>

            <template v-slot:item.add="{ item }">
              <v-btn
                icon
                @click="select_food(item)">
                <v-icon>mdi-playlist-plus</v-icon>
              </v-btn>
            </template>

          </v-data-table>
        </v-col>
        <v-col>
          <v-data-table
            class="elevation-1"
            :headers="meal_plan_foods_headers"
            :items="mapped_selected_foods"
            :items-per-page="-1">

            <template v-slot:item.remove="{ item, index }">
              <v-btn
                icon
                @click="unselect_food(index)">
                <v-icon>mdi-playlist-minus</v-icon>
              </v-btn>
            </template>

          </v-data-table>

        </v-col>
      </v-row>
    </v-card-text>




  </v-card>
</template>

<script>
export default {
  name: 'Foods',

  data: () => ({
    calories_target: 2600,
    search: '',
    foods: [],
    meal_plan: {
      foods: []
    },
    base_headers: [
      {text: 'Name', value: 'name'},
      {text: 'Calories per serving', value: 'calories_per_serving'},
      {text: 'Keto friendly', value: 'keto_friendly'},

    ]
  }),
  mounted(){
    this.get_foods()
    if(this.meal_plan_id) this.get_meal_plan()
  },
  watch: {
    meal_plan_id(){
      if(this.meal_plan_id) this.get_meal_plan()
    }
  },
  methods: {
    get_meal_plan(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/meal_plans/${this.meal_plan_id}`
      this.axios.get(url)
      .then(({data}) => {
        this.meal_plan = data
      })
      .catch(error => {
        console.error(error)
      })
    },
    get_foods(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods`
      this.axios.get(url)
      .then(({data}) => {
        this.foods = data
      })
      .catch(error => {
        console.error(error)
      })
    },
    create_meal_plan(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/meal_plans`
      const body = {
        foods: this.meal_plan.foods,
      }
      this.axios.post(url,body)
      .then(({data}) => {
        this.$router.push({name: 'meal_plan', params: {meal_plan_id: data._id}})
      })
      .catch(error => {
        console.error(error)
        alert('Failed')
      })
    },
    update_meal_plan(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/meal_plans/${this.meal_plan_id}`
      const body = this.meal_plan
      this.axios.patch(url,body)
      .then(() => {
        alert('OK')
      })
      .catch(error => {
        console.error(error)
        alert('Failed')
      })
    },
    delete_meal_plan(){
      if(!confirm('Really?')) return
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/meal_plans/${this.meal_plan_id}`
      this.axios.delete(url)
      .then(() => {
        this.$router.push({name: 'meal_plans'})
      })
      .catch(error => {
        console.error(error)
      })
    },
    save_meal_plan(){
      if(this.meal_plan_id) this.update_meal_plan()
      else this.create_meal_plan()
    },
    select_food(food){
      this.meal_plan.foods.push(food._id)
    },
    unselect_food(index){
      this.meal_plan.foods.splice(index,1)
    },

  },
  computed: {
    meal_plan_id(){
      return this.$route.params.meal_plan_id
    },
    food_list_headers(){
      return [
        ...this.base_headers,
        {text: 'Add', value: 'add'},
      ]
    },
    meal_plan_foods_headers(){
      return [
        ...this.base_headers,
        {text: 'Remove', value: 'remove'},
      ]
    },
    total_calories(){
      return this.mapped_selected_foods.reduce((acc,food) => acc + food.calories_per_serving, 0)
    },
    mapped_selected_foods(){
      return this.meal_plan.foods.map(f => this.foods.find(({_id}) => _id === f))
    }
  }
}
</script>
