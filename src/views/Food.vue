<template>
  <v-card :loading="loading" max-width="600px" class="mx-auto">

    <template v-if="food && !loading">
      <v-toolbar flat>
        <v-btn icon :to="{name: 'foods'}" exact>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>{{food.name || 'unnnamed food'}}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="update_food()">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn icon color="#c00000" @click="delete_food()">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />

      <v-img class="mt-3" height="300" :src="image_src" contain />

      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field label="name" v-model="food.name" />
          </v-col>
          <v-col cols="auto">
            <v-checkbox label="Hidden" v-model="food.hidden" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field label="Serving size" type="number" v-model.number="food.serving.size" />
          </v-col>
          <v-col cols="2">
            <v-text-field label="unit" v-model="food.serving.unit" />
          </v-col>
          <v-col cols="5">
            <v-text-field label="Calories per serving" v-model="food.serving.calories" />
          </v-col>
        </v-row>
        <v-row>

          <v-col>
            <v-text-field label="Protein [g]" v-model="food.serving.macronutrients.protein" />
          </v-col>
          <v-col>
            <v-text-field label="Fat [g]" v-model="food.serving.macronutrients.fat" />
          </v-col>
          <v-col>
            <v-text-field label="Carbs [g]" v-model="food.serving.macronutrients.carbohydrates" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-combobox label="Vendor" v-model="food.vendor" :items="vendors"/>
          </v-col>
          <v-col>
            <v-text-field label="Price" v-model="food.serving.price" />
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col>
            <v-file-input v-model="image" label="image" />
          </v-col>
          <v-col cols="auto">
            <v-btn :disabled="!image" @click="upload_image()">
              <v-icon>mdi-upload</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn color="#c00000" dark :disabled="!food.image" @click="delete_food_image()">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
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
export default {
  name: 'Foods',

  data: () => ({
    food: null,
    vendors: [],
    loading: false,
    image: null,
    snackbar: {
      show: false,
      text: null,
      color: 'green',
    },
  }),
  mounted(){
    this.get_food()
    this.get_vendors()
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
      this.axios.get(`/foods/${this.food_id}`)
      .then(({data}) => {
        this.food = data
      })
      .catch(error => {
        console.error(error)
      })
      .finally( () => { this.loading = false })
    },
    get_vendors() {
      this.axios.get(`/foods/vendors`)
        .then(({ data }) => {
          this.vendors = data
        })
        .catch(error => {
          console.error(error)
        })
    },
    update_food(){
      this.axios.patch(`/foods/${this.food_id}`, this.food)
      .then(() => { 
        this.snackbar.text = 'Food saved'
        this.snackbar.color = 'green'
        this.snackbar.show = true
       })
      .catch(error => {
        console.error(error)
      })
    },
    delete_food(){
      if(!confirm(`Delete ${this.food.name}?`)) return
      this.axios.delete(`/foods/${this.food_id}`)
      .then(() => { this.$router.push({name:'foods'}) })
      .catch(error => {
        console.error(error)
      })
    },
    upload_image(){
      const formData = new FormData()
      formData.append('image', this.image)
      this.axios.post(`/foods/${this.food_id}/image`,formData)
      .then(() => { this.get_food() })
      .catch(error => {
        console.error(error)
      })
    },
    delete_food_image(){
      this.food.image = null
    },

  },
  computed: {
    food_id(){
      return this.$route.params.food_id
    },
    image_src(){
      if (!this.food.image) return require('@/assets/image-off.png')
      else return `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods/${this.food._id}/image`
    },

  }
}
</script>
