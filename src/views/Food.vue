<template>
  <v-card>

    <v-card-text class="text-center" v-if="loading">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-card-text>

    <template v-if="food && !loading">
      <v-toolbar flat>
        <v-btn
          icon
          :to="{name: 'foods'}"
          exact>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>{{food.name || 'unnnamed food'}}</v-toolbar-title>
        <v-spacer/>
        <v-btn
          icon
          @click="update_food()">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn
          icon
          color="#c00000"
          @click="delete_food()">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider/>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field
              label="name"
              v-model="food.name" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Calories per serving"
              v-model="food.calories_per_serving" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox
              label="Vendor"
              :items="vendors"
              v-model="food.vendor"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              label="Price per serving"
              v-model="food.price_per_serving"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox
              label="Keto friendly"
              v-model="food.keto_friendly"/>
          </v-col>
        </v-row>
      </v-card-text>

    </template>




  </v-card>
</template>

<script>
export default {
  name: 'Foods',

  data: () => ({
    food: null,
    loading: false,
    vendors: [
      'スギ薬局',
      'Lawson 100',
      'Family Mart',
    ]
  }),
  mounted(){
    this.get_food()
    document.addEventListener("keydown", this.handle_keydown)
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handle_keydown)
  },

  methods:{
    handle_keydown(e){
      // Keyboard events

      // CTRL S
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault()
        this.update_food()
      }

    },

    get_food(){
      this.loading = true
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods/${this.food_id}`
      this.axios.get(url)
      .then(({data}) => {
        this.food = data
      })
      .catch(error => {
        console.error(error)
      })
      .finally( () => { this.loading = false })
    },
    update_food(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods/${this.food_id}`
      this.axios.patch(url, this.food)
      .then(() => {
        this.get_food()
      })
      .catch(error => {
        console.error(error)
      })
    },
    delete_food(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods/${this.food_id}`
      this.axios.delete(url)
      .then(() => { this.$router.push({name:'foods'}) })
      .catch(error => {
        console.error(error)
      })
    }

  },
  computed: {
    food_id(){
      return this.$route.params.food_id
    }
  }
}
</script>
