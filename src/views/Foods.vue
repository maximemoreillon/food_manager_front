<template>
  <v-card>

    <v-card-title>Foods</v-card-title>

    <v-card-text>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="filtered_foods"
        :items-per-page="-1"
        @click:row="row_clicked($event)"
        sort-by="name">

        <template v-slot:top>
          <v-toolbar flat>

            <v-row align="baseline">
              <v-col>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  hide-details/>
              </v-col>
              <v-col>
                <v-checkbox
                  label="Show hidden"
                  v-model="show_hidden"/>
              </v-col>
              <v-spacer/>
              <v-col cols="auto">
                <v-btn
                  :to="{name: 'create_food'}">
                  <v-icon>mdi-plus</v-icon>
                  <span class="ml-2">Add</span>
                </v-btn>
              </v-col>
            </v-row>

          </v-toolbar>
        </template>

        <template v-slot:item.hidden="{ item }">
          <v-icon v-if="item.hidden">mdi-check</v-icon>
        </template>

        <template v-slot:item.image="{ item }">
          <v-img
            width="6em"
            height="6em"
            contain
            :src="image_src(item)" />
        </template>


      </v-data-table>
    </v-card-text>


  </v-card>
</template>

<script>

export default {
  name: 'Foods',

  data: () => ({
    search: '',
    foods: [],
    show_hidden: false,
    base_headers: [
      {text: 'Image', value: 'image'},
      {text: 'Name', value: 'name'},
      {text: 'Calories [kcal]', value: 'calories_per_serving'},
      {text: 'Protein [g]', value: 'protein'},
      {text: 'Fat [g]', value: 'fat'},
      {text: 'Carbs [g]', value: 'carbohydrates'},
      {text: 'Price [JPY]', value: 'price_per_serving'},
      {text: 'Vendor', value: 'vendor'},
    ]
  }),
  mounted(){
    this.get_foodd()
  },
  methods:{
    get_foodd(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods`
      this.axios.get(url)
      .then(({data}) => { this.foods = data })
      .catch(error => {
        console.error(error)
      })

    },
    image_src({_id, image}){
      if (!image) return require('@/assets/image-off.png')
      else return `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods/${_id}/thumbnail`
    },
    row_clicked(food){
      this.$router.push({name: 'food', params: {food_id: food._id}})
    },

  },
  computed: {
    filtered_foods(){
      if(this.show_hidden) return this.foods
      else return this.foods.filter(f => !f.hidden)
    },
    headers(){
      if(this.show_hidden) return [ ...this.base_headers, {text: 'Hidden', value: 'hidden'} ]
      else return this.base_headers


    }
  }
}
</script>
