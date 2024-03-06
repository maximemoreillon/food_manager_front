<template>
  <v-card-text>
    <v-form @submit.prevent="submit()" v-if="food">
      <v-row>
        <v-col>
          <v-text-field label="Food name" v-model="food.name" />
        </v-col>
        <v-col>
          <v-text-field label="Quantity" v-model.number="quantity" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            type="number"
            label="Serving size"
            v-model.number="food.serving.size"
          />
        </v-col>
        <v-col>
          <v-text-field label="Unit" v-model="food.serving.unit" />
        </v-col>
        <v-col>
          <v-text-field
            type="number"
            label="Calories [kcal]"
            v-model.number="food.serving.calories"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            label="Protein [g]"
            type="number"
            v-model="food.serving.macronutrients.protein"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Fat [g]"
            type="number"
            v-model="food.serving.macronutrients.fat"
          />
        </v-col>
        <v-col>
          <v-text-field
            label="Carbs [g]"
            type="number"
            v-model="food.serving.macronutrients.carbohydrates"
          />
        </v-col>
      </v-row>

      <v-row justify="end">
        <v-col cols="auto" v-if="!isRegistered">
          <v-btn @click="register_food()" :loading="registering">
            <v-icon left>mdi-playlist-plus</v-icon>
            <span>Register</span>
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn type="submit" color="primary">
            <v-icon left>mdi-check</v-icon>
            <span>Save</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-snackbar :color="snackbar.color" v-model="snackbar.show">
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn text dark v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card-text>
</template>

<script>
export default {
  name: "FoodForm",
  props: {
    item: Object,
    open: Boolean,
  },
  data() {
    return {
      quantity: 1,
      food: null,
      registeredFoods: [],
      defaults: {
        name: "",
        serving: {
          calories: 0,
          size: 0,
          unit: "g",
          macronutrients: {
            fat: 0,
            carbohydrates: 0,
            protein: 0,
          },
        },
      },
      registering: false,
      snackbar: {
        show: false,
        text: null,
        color: "green",
      },
    }
  },
  watch: {
    open() {
      this.load_food()
    },
  },
  mounted() {
    this.load_food()
    this.get_foods()
  },
  methods: {
    load_food() {
      if (this.item) {
        // Make a copy
        this.food = JSON.parse(JSON.stringify(this.item.food))
        this.quantity = this.item.quantity
      } else {
        this.reset_inputs()
      }
    },
    get_foods() {
      this.axios
        .get("/foods")
        .then(({ data }) => {
          this.registeredFoods = data.items
        })
        .catch((error) => {
          alert("Failed to get foods")
          console.error(error)
        })
    },
    register_food() {
      this.registering = true
      this.axios
        .post(`/foods`, this.food)
        .then(({ data }) => {
          this.food = data
          this.snackbar.text = "Food registered"
          this.snackbar.show = true
          this.snackbar.color = "green"
        })
        .catch((error) => {
          console.error(error)
          this.snackbar.text = "Food registration failed"
          this.snackbar.show = true
          this.snackbar.color = "red"
        })
        .finally(() => {
          this.registering = false
        })
    },
    reset_inputs() {
      this.quantity = 1
      this.food = JSON.parse(JSON.stringify(this.defaults))
    },
    submit() {
      this.$emit("submit", { quantity: this.quantity, food: { ...this.food } })
      this.reset_inputs()
    },
  },
  computed: {
    isRegistered() {
      if (!this.food) return false
      return this.registeredFoods.some(({ _id }) => _id === this.food._id)
    },
  },
}
</script>
