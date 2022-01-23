<template>
  <v-card>

    <v-toolbar flat>
      <v-row align="center">
        <v-col cols="auto">
          <v-btn
            icon
            exact
            :to="{name: 'meal_plans'}">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <v-toolbar-title>Meal plan</v-toolbar-title>
        </v-col>
        <v-spacer/>
        <v-col cols="auto">
          <v-btn
            icon
            @click="save_meal_plan()">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn
            icon
            color="#c00000"
            v-if="meal_plan_id"
            @click="delete_meal_plan()">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-divider/>

    <v-card-text>
      <v-row align="center">
        <v-col>
          Date: {{meal_plan.date}}
        </v-col>
        <v-col>
          <v-text-field
            label="Name"
            v-model="meal_plan.name"/>
        </v-col>
      </v-row>
    </v-card-text>


    <v-card-text>
      <v-progress-linear
        :value="100 * total_of_property('calories_per_serving') / calories_target"
        height="50">
        {{total_of_property('calories_per_serving')}} / {{calories_target}}
      </v-progress-linear>

    </v-card-text>

    <v-card-text>
      <v-row>
        <v-col>
          <v-card outlined>
            <v-card-title>Protein</v-card-title>
            <v-card-text>{{total_of_property('protein')}}g</v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card outlined>
            <v-card-title>Fat</v-card-title>
            <v-card-text>{{total_of_property('fat')}}g</v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-card outlined>
            <v-card-title>Carbs</v-card-title>
            <v-card-text>{{total_of_property('carbohydrates')}}g</v-card-text>
          </v-card>
        </v-col>
      </v-row>
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
            :items-per-page="-1"
            sort-by="name">

            <template v-slot:top>
              <v-toolbar flat>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  hide-details/>
              </v-toolbar>
            </template>

            <template v-slot:item.image="{ item }">
              <v-img
                :width="thumbnail_size"
                :height="thumbnail_size"
                contain
                v-if="item.image"
                :src="image_src(item)" />
            </template>

            <template v-slot:item.add="{ item }">
              <v-btn
                icon
                @click="add_food_to_plan(item)">
                <v-icon>mdi-playlist-plus</v-icon>
              </v-btn>
            </template>

          </v-data-table>
        </v-col>
        <v-col>
          <v-data-table
            class="elevation-1"
            :headers="meal_plan_foods_headers"
            :items="meal_plan.foods"
            :items-per-page="-1">

            <template v-slot:item.image="{ item }">
              <v-img
                :width="thumbnail_size"
                :height="thumbnail_size"
                contain
                v-if="item.image"
                :src="image_src(item)" />
            </template>

            <template v-slot:item.quantity="{ item }">
              <v-text-field
                type="number"
                v-model="item.quantity"/>
            </template>

            <template v-slot:item.remove="{ item }">
              <v-btn
                icon
                @click="remove_food_from_plan(item)">
                <v-icon>mdi-playlist-minus</v-icon>
              </v-btn>
            </template>

          </v-data-table>

        </v-col>
      </v-row>
    </v-card-text>

    <v-snackbar
      :color="snackbar.color"
      v-model="snackbar.show">
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn

          text
          dark
          v-bind="attrs"
          @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>




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
      name: '',
      foods: [],
    },
    thumbnail_size: '6em',
    snackbar: {
      show: false,
      text: null,
      color: 'green',
    },
    base_headers: [
      {text: 'Image', value: 'image'},
      {text: 'Name', value: 'name'},
      {text: 'Calories [kcal]', value: 'calories_per_serving'},
      //{text: 'Keto friendly', value: 'keto_friendly'},
      {text: 'Protein [g]', value: 'protein'},
      {text: 'Fat [g]', value: 'fat'},
      {text: 'Carbs [g]', value: 'carbohydrates'},

      //{text: 'Price [JPY]', value: 'price_per_serving'},

    ]
  }),
  async mounted(){
    document.addEventListener("keydown", this.handle_keydown)
    this.get_foods()

  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handle_keydown)
  },
  watch: {
    meal_plan_id(){
      if(this.meal_plan_id) this.get_meal_plan()
    }
  },
  methods: {
    handle_keydown(e){
      // Keyboard events

      // CTRL S
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault()
        this.save_meal_plan()
      }

    },
    get_meal_plan(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/meal_plans/${this.meal_plan_id}`
      this.axios.get(url)
      .then(({data}) => {

        this.meal_plan = {
          ...data,
          foods: data.foods.map((mpf) => ({
            ...mpf, // Original properties (_id, quantity)
            ...this.foods.find( ({_id}) => mpf._id === _id) // Sdding properties of foods from list
          }))
        }

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
        this.get_meal_plan()
       })
      .catch(error => {
        console.error(error)
      })
    },
    update_meal_plan(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/meal_plans/${this.meal_plan_id}`

      const body = {
        ...this.meal_plan,
        foods: this.meal_plan.foods.map( ({_id, quantity}) => ({_id, quantity}) )
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
      })
    },
    save_meal_plan(){
      if(this.meal_plan_id) this.update_meal_plan()
      else this.create_meal_plan()
    },
    add_food_to_plan(food){

      const found_food = this.meal_plan.foods.find( ({_id}) => _id === food._id)
      if(found_food) found_food.quantity ++
      else {
        this.meal_plan.foods.push({...food, quantity: 1})
      }

    },
    remove_food_from_plan({_id}){

      const found_index = this.meal_plan.foods.findIndex( f => f._id ===_id)
      if(found_index < 0) return
      this.meal_plan.foods.splice(found_index,1)
    },
    image_src(item){
      return `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods/${item._id}/thumbnail`
    },
    total_of_property(property){
      if(!this.meal_plan.foods.length) return 0
      return this.meal_plan.foods.reduce((acc,item) => {
        if(!item) return acc
        return acc + item[property] * item.quantity
      }, 0)
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
        {text: 'Quantity', value: 'quantity'},
        {text: 'Remove', value: 'remove'},
      ]
    },

  }
}
</script>
