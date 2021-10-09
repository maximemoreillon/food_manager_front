<template>
  <v-card>

    <v-card-title>Foods</v-card-title>

    <v-data-table
      :search="search"
      :headers="headers"
      :items="foods"
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


          <v-btn :to="{name: 'create_food'}">New food</v-btn>

        </v-toolbar>
      </template>

      <template v-slot:item.keto_friendly="{ item }">
        <v-icon v-if="item.keto_friendly">mdi-check</v-icon>
      </template>





    </v-data-table>
  </v-card>
</template>

<script>
import headers from '../table_headers.js'

export default {
  name: 'Foods',

  data: () => ({
    search: '',
    foods: [],
    headers,
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
    row_clicked(food){
      this.$router.push({name: 'food', params: {food_id: food._id}})
    },

  },
}
</script>
