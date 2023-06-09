<template>
  <v-card :loading="loading">
    <v-toolbar flat>
      <v-btn icon exact :to="{ name: 'meal_plans' }">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>Meal plan</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="save_meal_plan()" :loading="saving">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>

      <v-btn
        icon
        color="#c00000"
        v-if="meal_plan_id"
        @click="delete_meal_plan()"
        :loading="deleting"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
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
                    <v-text-field
                      label="Meal plan name"
                      v-model="meal_plan.name"
                    />
                  </v-col>
                  <v-spacer />
                  <v-col cols="auto">
                    <v-checkbox
                      label="Incomplete"
                      v-model="meal_plan.incomplete"
                    />
                  </v-col>
                  <v-col cols="auto">
                    <v-icon left>mdi-calendar</v-icon>
                    <span>{{ new Date(meal_plan.date).toDateString() }}</span>
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
                <v-row align="baseline" justify="space-between" dense>
                  <v-col cols="12" md="auto">
                    <v-text-field
                      :error="calorie_total > meal_plan.calories_target"
                      :prefix="`${calorie_total}/`"
                      label="Calories"
                      color="red"
                      type="number"
                      outlined
                      dense
                      rounded
                      v-model.number="meal_plan.calories_target"
                      @input="calories_target_change_handler($event)"
                    />
                  </v-col>
                  <v-spacer />
                  <v-col
                    cols="auto"
                    v-for="(value, key) in macros_total"
                    :key="key"
                  >
                    <v-chip :color="colors[key]">
                      {{ value }}g {{ macros_label_lookup[key] }}
                    </v-chip>
                  </v-col>
                </v-row>
                <CalorieMacros
                  :target="meal_plan.calories_target"
                  :calories="calorie_total"
                  :macronutrients="macros_total"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-card outlined>
          <v-card-text>
            <v-data-table
              :search="search"
              :headers="meal_plan_foods_headers"
              :items="meal_plan.foods"
              :items-per-page="-1"
            >
              <template v-slot:top>
                <v-row>
                  <v-col class="text-h6"> Foods </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="auto">
                    <AddFoodDialog
                      :meal_plan="meal_plan"
                      @submit="add_food_to_plan($event)"
                    />
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col>
                    <v-text-field
                      v-model="search"
                      clearable
                      append-icon="mdi-magnify"
                      label="Search"
                      hide-details
                    />
                  </v-col>
                </v-row>
              </template>

              <template v-slot:item.image="{ item }">
                <v-img
                  :width="thumbnail_size"
                  :height="thumbnail_size"
                  contain
                  :src="image_src(item.food)"
                />
              </template>

              <template v-slot:item.quantity="{ item }">
                <v-text-field type="number" v-model="item.quantity" />
              </template>

              <template v-slot:item.food.serving="{ item }">
                {{ item.food.serving.size }} {{ item.food.serving.unit }}
              </template>

              <template v-slot:item.remove="{ item }">
                <v-btn icon @click="remove_food_from_plan(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>

              <template v-slot:item.edit="{ item }">
                <FoodEditDialog
                  :item="item"
                  @submit="update_item(item, $event)"
                />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
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
import FoodEditDialog from "@/components/mealPlan/FoodEditDialog.vue"
import CalorieMacros from "../components/CalorieMacros.vue"
import AddFoodDialog from "../components/mealPlan/AddFoodDialog.vue"

import colors from "@/colors"

export default {
  name: "MealPlan",
  components: {
    FoodEditDialog,
    // CaloriesProgress,
    CalorieMacros,
    AddFoodDialog,
  },
  data: () => ({
    colors,
    search: "",
    foods: [],

    // COuld be null at first
    meal_plan: null,
    loading: false,
    saving: false,
    deleting: false,

    thumbnail_size: "6em",
    snackbar: {
      show: false,
      text: null,
      color: "green",
    },
  }),
  mounted() {
    document.addEventListener("keydown", this.handle_keydown_events)
    this.get_meal_plan()
    this.get_foods()
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.handle_keydown_events)
  },
  watch: {
    meal_plan_id() {
      if (this.meal_plan_id) this.get_meal_plan()
    },
  },
  methods: {
    handle_keydown_events(e) {
      // CTRL S
      if (e.key === "s" && e.ctrlKey) {
        e.preventDefault()
        this.save_meal_plan()
      }
    },
    get_meal_plan() {
      this.loading = true
      const route = `/meal_plans/${this.meal_plan_id}`
      this.axios
        .get(route)
        .then(({ data }) => {
          this.meal_plan = data
          this.setCalorieTarget()

          // Calorie target
        })
        .catch((error) => {
          alert("Failed to load meal plan")
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },

    setCalorieTarget() {
      // No need to do anything if meal plan already has a calorie target
      if (this.meal_plan.calories_target) return
      const target = localStorage.getItem("caloriesTarget") || 2500
      this.$set(this.meal_plan, "calories_target", Number(target))
    },
    get_foods() {
      const route = `/foods`
      this.axios
        .get(route)
        .then(({ data }) => {
          this.foods = data.items
        })
        .catch((error) => {
          alert("Failed to get foods")
          console.error(error)
        })
    },
    update_meal_plan() {
      this.saving = true
      const route = `/meal_plans/${this.meal_plan_id}`
      const body = {
        ...this.meal_plan,
        calories: this.calorie_total,
        macronutrients: this.macros_total,
      }

      this.axios
        .patch(route, body)
        .then(() => {
          this.snackbar.text = "Meal plan saved"
          this.snackbar.show = true
        })
        .catch((error) => {
          console.error(error)
          alert("Failed")
        })
        .finally(() => {
          this.saving = false
        })
    },
    delete_meal_plan() {
      if (!confirm("Really?")) return
      this.deleting = false
      const route = `/meal_plans/${this.meal_plan_id}`
      this.axios
        .delete(route)
        .then(() => {
          this.$router.push({ name: "meal_plans" })
        })
        .catch((error) => {
          console.error(error)
          alert("failed")
        })
        .finally(() => {
          this.deleting = false
        })
    },
    save_meal_plan() {
      if (this.meal_plan_id) this.update_meal_plan()
      else this.create_meal_plan()
    },
    add_food_to_plan({ food: new_food, quantity }) {
      if (!new_food._id)
        return this.meal_plan.foods.push({ food: new_food, quantity })
      const found_food = this.meal_plan.foods.find(
        ({ food: { _id } }) => _id === new_food._id
      )
      if (found_food) found_food.quantity++
      else this.meal_plan.foods.push({ food: new_food, quantity })
      this.snackbar.text = `${new_food.name} added to meal plan`
      this.snackbar.show = true
    },
    remove_food_from_plan({ food: food_to_delete }) {
      const found_index = this.meal_plan.foods.findIndex(
        ({ food: existing_food }) =>
          JSON.stringify(existing_food) === JSON.stringify(food_to_delete)
      )
      if (found_index < 0) return alert(`Error while deleting food`)
      this.meal_plan.foods.splice(found_index, 1)
    },
    image_src({ _id, image }) {
      if (!_id) return require("@/assets/image-off.png")
      if (!image) return require("@/assets/image-off.png")
      else
        return `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods/${_id}/thumbnail`
    },

    total_for_macro(macro) {
      const total = this.meal_plan.foods.reduce(
        (acc, { quantity, food }) =>
          acc + quantity * food.serving.macronutrients[macro],
        0
      )
      return Math.round(total * 100) / 100
    },
    item_too_calorific({ serving: { calories } }) {
      return calories > this.meal_plan.calories_target - this.calorie_total
    },
    update_item(item, { quantity, food }) {
      // Not elegant at all
      this.$set(item, "quantity", quantity)
      this.$set(item, "food", food)
    },
    calories_target_change_handler(event) {
      localStorage.setItem("caloriesTarget", Number(event))
    },
  },
  computed: {
    meal_plan_id() {
      return this.$route.params.meal_plan_id
    },

    calorie_total() {
      const total = this.meal_plan.foods.reduce(
        (acc, { quantity, food }) => acc + quantity * food.serving.calories,
        0
      )
      return Math.round(total * 100) / 100
    },
    macros_total() {
      return {
        protein: this.total_for_macro("protein"),
        fat: this.total_for_macro("fat"),
        carbohydrates: this.total_for_macro("carbohydrates"),
      }
    },
    macros_label_lookup() {
      return {
        protein: "protein",
        fat: "fat",
        carbohydrates: "carbs",
      }
    },

    meal_plan_foods_headers() {
      return [
        { text: "", value: "image" },
        { text: "Name", value: "food.name" },
        { text: "Vendor", value: "food.vendor" },
        { text: "Calories [kcal]", value: "food.serving.calories" },
        { text: "Protein [g]", value: "food.serving.macronutrients.protein" },
        { text: "Fat [g]", value: "food.serving.macronutrients.fat" },
        {
          text: "Carbs [g]",
          value: "food.serving.macronutrients.carbohydrates",
        },
        { text: "Serving", value: "food.serving" },
        { text: "Quantity", value: "quantity", width: "5rem" },
        { text: "", value: "remove" },

        { text: "", value: "edit" },
      ]
    },
  },
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
