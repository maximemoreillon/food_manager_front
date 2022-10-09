<template>
  <v-card>

    <v-card-title>Foods</v-card-title>

    <v-card-text>
      <v-data-table 
      :loading="loading" 
      :search="search" 
      :headers="headers" 
      :items="foods" 
      sort-by="name"
      :server-items-length="total"
      :options.sync="options"
      >

        <template v-slot:top>
          <v-container fluid>

            <v-row align="baseline">
              <v-col cols="12" md="6">
                <v-form @submit.prevent="get_foods()">
                  <v-text-field v-model="search" append-icon="mdi-magnify" label="Search">
                    <template v-slot:append>
                      <v-btn icon type="submit">
                        <v-icon>mdi-magnify</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                  
                </v-form>
              </v-col>
              <v-col>
                <v-checkbox label="Show hidden" v-model="show_hidden" />
              </v-col>
              <v-spacer />
              <v-col cols="auto">
                <v-btn :to="{name: 'create_food'}">
                  <v-icon>mdi-plus</v-icon>
                  <span class="ml-2">Add</span>
                </v-btn>
              </v-col>
            </v-row>

          </v-container>
        </template>

        <template v-slot:item.name="{ item }">
          <router-link :to="{ name: 'food', params: { food_id: item._id } }">
            {{item.name}}
          </router-link>
        </template>

        <template v-slot:item.serving="{ item }">
          {{item.serving.size}} {{item.serving.unit}}
        </template>

        <template v-slot:item.hidden="{ item }">
          <v-icon v-if="item.hidden">mdi-check</v-icon>
        </template>

        <template v-slot:item.image="{ item }">
          <v-img width="6em" height="6em" contain :src="image_src(item)" />
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
    loading: false,
    foods: [],
    total: 0,
    show_hidden: false,
    base_headers: [
      { text: 'Image', value: 'image' },
      { text: 'Name', value: 'name' },
      { text: 'Vendor', value: 'vendor' },
      { text: 'Serving', value: 'serving' },
      { text: 'Calories [kcal]', value: 'serving.calories'},
      { text: 'Protein [g]', value: 'serving.macronutrients.protein'},
      { text: 'Fat [g]', value: 'serving.macronutrients.fat'},
      { text: 'Carbs [g]', value: 'serving.macronutrients.carbohydrates'},
      { text: 'Price', value: 'serving.price' },
      { text: 'Hidden', value: 'hidden' },
    ],
    options: {}
  }),
  mounted(){
    this.get_foods()
  },
  watch: {
    options: {
      handler() {
        this.get_foods()
      },
      deep: true,
    },
    show_hidden(){
      this.get_foods()
    }
  },
  methods:{
    get_foods(){
      this.loading = true
      const route = `/foods`

      const { itemsPerPage, page, sortBy, sortDesc } = this.options
      const params = {
        limit: String(itemsPerPage),
        skip: String((page - 1) * itemsPerPage),
        order: String(sortDesc[0] ? -1 : 1),
        sort: sortBy[0],
        search: this.search,
        hidden: this.show_hidden ? true : undefined,
      }

      this.axios.get(route, {params} )
        .then( ({data}) => { 
          this.foods = data.items
          this.total = data.total
        })
        .catch(error => {
          console.error(error)
        })
        .finally( () => {
          this.loading = false
        })

    },
    image_src({_id, image}){
      if (!image) return require('@/assets/image-off.png')
      else return `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods/${_id}/thumbnail`
    },


  },
  computed: {
    filtered_foods(){
      // Unused
      if(this.show_hidden) return this.foods
      else return this.foods.filter(f => !f.hidden)
    },
    headers(){
      // Unused
      if(this.show_hidden) return [ ...this.base_headers, {text: 'Hidden', value: 'hidden'} ]
      else return this.base_headers
    },
  }
}
</script>
