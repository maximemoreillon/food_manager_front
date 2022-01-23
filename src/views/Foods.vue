<template>
  <v-card>

    <v-card-title>Foods</v-card-title>

    <v-card-text>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="foods"
        :items-per-page="-1"
        @click:row="row_clicked($event)"
        sort-by="name">

        <template v-slot:top>
          <v-toolbar
            flat>


            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              hide-details/>

            <v-spacer/>

            <v-btn
              :to="{name: 'create_food'}">
              New food
            </v-btn>

          </v-toolbar>
        </template>

        <template v-slot:item.keto_friendly="{ item }">
          <v-icon v-if="item.keto_friendly">mdi-check</v-icon>
        </template>

        <template v-slot:item.image="{ item }">
          <v-img
            width="6em"
            height="6em"
            contain
            v-if="item.image"
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
    headers: [
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
    image_src(item){
      return `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods/${item._id}/thumbnail`
    },
    row_clicked(food){
      this.$router.push({name: 'food', params: {food_id: food._id}})
    },

  },
}
</script>
