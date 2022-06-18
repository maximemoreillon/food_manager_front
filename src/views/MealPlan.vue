<template>
  <v-card :loading="loading">

    <v-toolbar flat>
      <v-row align="center">
        <v-col cols="auto">
          <v-btn icon exact :to="{name: 'meal_plans'}">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <v-toolbar-title>Meal plan</v-toolbar-title>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn icon @click="save_meal_plan()">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn icon color="#c00000" v-if="meal_plan_id" @click="delete_meal_plan()">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-divider />

    <template v-if="this.meal_plan">

      <v-card-text>
        <v-row>
          <v-col>

            <v-card outlined>
              <v-card-title>Meal plan info</v-card-title>
              <v-card-text>
                <v-row align="center">
                  <v-col cols="12" md="6">
                    <v-text-field label="Meal plan name" v-model="meal_plan.name" />
                  </v-col>
                  <v-spacer />
                  <v-col cols="auto">
                    Date: {{new Date(meal_plan.date).toLocaleString()}}
                  </v-col>
                  <v-spacer />
                  <v-col cols="auto">
                    <v-checkbox label="Incomplete" v-model="meal_plan.incomplete" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-card outlined>
              <v-card-title>Calories and Macros</v-card-title>
              <v-card-text>
                <CalorieMacros :target="meal_plan.calories_target" :calories="calorie_total"
                  :macronutrients="macros_total" />
              </v-card-text>


            </v-card>
          </v-col>
        </v-row>

      </v-card-text>


      <v-card-text>
        <v-row>
          <!-- Left col: registered foods -->
          <v-col cols="12" md="6">
            <v-card outlined>
              <v-card-text>
                <v-data-table height="500" :search="search" :headers="food_list_headers" :items="filtered_foods"
                  :items-per-page="-1" sort-by="name" @click:row="add_food_to_plan($event)">

                  <template v-slot:top>
                    <v-container fluid>
                      <v-row>
                        <v-col cols="12" md="6" class="text-h6">
                          Registered foods
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col md="12">
                          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" hide-details />
                        </v-col>
                      </v-row>


                    </v-container>

                  </template>


                  <template v-slot:item.image="{ item }">
                    <v-img :width="thumbnail_size" :height="thumbnail_size" contain :src="image_src(item)" />
                  </template>

                  <template v-slot:item.serving="{ item }">
                    {{item.serving.size}} {{ item.serving.unit}}
                  </template>

                  <template v-slot:item.serving.calories="{ item }">
                    <v-chip :color=" item_too_calorific(item) ? 'red' : 'green'">
                      {{item.calories_per_serving}}
                    </v-chip>
                  </template>

                  <template v-slot:item.food.serving="{ item }">
                    {{item.food.serving.size}} {{ item.food.serving.unit}}
                  </template>

                  <template v-slot:item.macronutrients="{ item }">
                    <div class="chart_wrapper">
                      <MacronutrientChart :options="chart_options" :protein="item.protein" :fat="item.fat"
                        :carbohydrates="item.carbohydrates" />
                    </div>
                  </template>

                </v-data-table>
              </v-card-text>
            </v-card>

          </v-col>

          <!-- Right col: Foods in meal plan -->
          <v-col cols="12" md="6">
            <v-card outlined>


              <v-card-text>
                <v-data-table :headers="meal_plan_foods_headers" :items="meal_plan.foods" :items-per-page="-1">

                  <template v-slot:top>
                    <v-container fluid>
                      <v-row>
                        <v-col cols="12" md="6" class="text-h6">
                          Foods in meal plan
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="auto">
                          <UnregisteredFoodDialog :foods="foods" @foodSubmitted="add_unregistered_food($event)" />
                        </v-col>
                      </v-row>
                      <v-spacer />
                    </v-container>


                  </template>



                  <template v-slot:item.image="{ item }">
                    <v-img :width="thumbnail_size" :height="thumbnail_size" contain :src="image_src(item.food)" />
                  </template>

                  <template v-slot:item.quantity="{ item }">
                    <v-text-field type="number" v-model="item.quantity" />
                  </template>

                  <template v-slot:item.food.serving="{ item }">
                    {{item.food.serving.size}} {{ item.food.serving.unit}}
                  </template>

                  <template v-slot:item.remove="{ item }">
                    <v-btn icon @click="remove_food_from_plan(item)">
                      <v-icon>mdi-playlist-minus</v-icon>
                    </v-btn>
                  </template>

                  <template v-slot:item.edit="{ item }">
                    <v-btn v-if="item.food._id" icon target="_blank"
                      :to="{name: 'food', params: {food_id: item.food._id}}">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <UnregisteredFoodDialog v-else :food_index="item.index" :foods="meal_plan.foods" />
                  </template>


                </v-data-table>
              </v-card-text>
            </v-card>


          </v-col>
        </v-row>
      </v-card-text>

    </template>




    <v-snackbar :color="snackbar.color" v-model="snackbar.show">
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn text dark v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>




  </v-card>
</template>

<script>
import UnregisteredFoodDialog from '@/components/UnregisteredFoodDialog.vue'
import CalorieMacros from '../components/CalorieMacros.vue'
export default {
  name: 'Foods',
  components: {
    UnregisteredFoodDialog,
    // CaloriesProgress,
    CalorieMacros,
  },
  data: () => ({
    search: '',
    foods: [],

    // COuld be null at first
    meal_plan: null,
    loading: false,

    thumbnail_size: '6em',
    snackbar: {
      show: false,
      text: null,
      color: 'green',
    },


    chart_options: {
      legend: {show: false},
      dataLabels: {enabled: false},
    },
  }),
  mounted(){
    document.addEventListener("keydown", this.handle_keydown_events)
    this.get_meal_plan()
    this.get_foods()

  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handle_keydown_events)
  },
  watch: {
    meal_plan_id(){
      if(this.meal_plan_id) this.get_meal_plan()
    }
  },
  methods: {
    handle_keydown_events(e){
      // CTRL S
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault()
        this.save_meal_plan()
      }

    },
    get_meal_plan(){
      this.loading = true
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/meal_plans/${this.meal_plan_id}`
      this.axios.get(url)
      .then(({data}) => {
        this.meal_plan = data

        // Calorie target
        if(!this.meal_plan.calories_target) {
          const current_calories_target = this.$store.state.user_configuration.calories_target
          this.$set(this.meal_plan,'calories_target',current_calories_target)
        }

      })
      .catch(error => {
        alert('Failed to load meal plan')
        console.error(error)
      })
      .finally( () => {
        this.loading = false
      })
    },
    get_foods(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods`
      this.axios.get(url)
      .then(({data}) => {
        this.foods = data.items
       })
      .catch(error => {
        alert('Failed to get foods')
        console.error(error)
      })
    },
    update_meal_plan(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/meal_plans/${this.meal_plan_id}`


      const body = {
        ...this.meal_plan,
        calories: this.calorie_total,
        macronutrients: this.macros_total,
      }

      this.axios.patch(url,body)
      .then(() => {
        this.snackbar.text = 'Meal plan saved'
        this.snackbar.show = true
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
      .then(() => { this.$router.push({name: 'meal_plans'}) })
      .catch(error => {
        console.error(error)
        alert('failed')
      })
    },
    save_meal_plan(){
      if(this.meal_plan_id) this.update_meal_plan()
      else this.create_meal_plan()
    },
    add_food_to_plan(new_food){

      // Check if food is already listed. If so, simply increase quantity
      const found_food = this.meal_plan.foods.find(({ food: {_id} }) => _id === new_food._id)
      if(found_food) found_food.quantity ++
      else this.meal_plan.foods.push({ food: new_food, quantity: 1})


    },
    remove_food_from_plan({food: food_to_delete}){
      const found_index = this.meal_plan.foods.findIndex(({ food: existing_food }) => JSON.stringify(existing_food) === JSON.stringify(food_to_delete))
      if(found_index < 0) return alert(`Error whiel deletign food`)
      this.meal_plan.foods.splice(found_index, 1)
    },
    image_src({_id, image}){
      if(!_id) return require('@/assets/image-off.png')
      if (!image) return require('@/assets/image-off.png')
      else return `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods/${_id}/thumbnail`
    },
    
    total_for_macro( macro ){
      const total = this.meal_plan.foods.reduce((acc, { quantity, food }) => acc + quantity * food.serving.macronutrients[macro], 0)
      return Math.round(total * 100) / 100
    },
    item_too_calorific({serving: {calories}}){
      return calories > (this.meal_plan.calories_target - this.calorie_total)
    },

    add_unregistered_food(food){
      console.log(food)
      this.meal_plan.foods.push({food, quantity: 1})
    }

  },
  computed: {
    meal_plan_id(){
      return this.$route.params.meal_plan_id
    },
    filtered_foods(){
      return this.foods.filter(f => !f.hidden)
    },
    calorie_total() {
      const total = this.meal_plan.foods.reduce((acc, { quantity, food }) => acc + quantity * food.serving.calories, 0)
      return Math.round(total * 100) / 100
    },
    macros_total(){
      return {
        protein: this.total_for_macro('protein'),
        fat: this.total_for_macro('fat'),
        carbohydrates: this.total_for_macro('carbohydrates')
      }
    },
    food_list_headers(){
      return [
        { text: '', value: 'image' },
        { text: 'Name', value: 'name' },
        { text: 'Serving', value: 'serving' },
        { text: 'Calories', value: 'serving.calories' },
        { text: 'Protein', value: 'serving.macronutrients.protein' },
        { text: 'Fat', value: 'serving.macronutrients.fat' },
        { text: 'Carbs', value: 'serving.macronutrients.carbohydrates' },
      ]
    },
    meal_plan_foods_headers(){
      return [
        { text: '', value: 'image' },
        { text: 'Name', value: 'food.name' },
        { text: 'Serving', value: 'food.serving' },
        { text: 'Calories', value: 'food.serving.calories' },
        { text: 'Qty', value: 'quantity', width: '5rem'},
        { text: '', value: 'remove'},
        
        { text: '', value: 'edit'},
      ]
    },



  }
}
</script>

<style scoped>
.chart_wrapper {
  display: flex;
  align-items: center;
  height: 6em;
  width: 6em;
}
</style>
