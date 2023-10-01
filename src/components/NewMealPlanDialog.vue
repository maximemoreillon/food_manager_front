<template>
  <v-dialog max-width="50rem" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary" dark>
        <v-icon left>mdi-plus</v-icon>
        <span>New</span>
      </v-btn>
    </template>

    <v-card>
      <v-card-title> New meal plan </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="create_meal_plan()">
          <v-row align="center">
            <v-col>
              <v-text-field autofocus label="Name" v-model="meal_plan.name" />
            </v-col>
            <v-col cols="auto">
              <v-btn color="primary" type="submit" :loading="loading">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "NewMealPlanDialog",

  data: () => ({
    loading: false,
    meal_plan: {
      name: "",
    },
    dialog: false,
  }),

  methods: {
    create_meal_plan() {
      this.loading = true

      this.axios
        .post(`/meal_plans`, this.meal_plan)
        .then(({ data }) => {
          this.$router.push({
            name: "meal_plan",
            params: { meal_plan_id: data._id },
          })
        })
        .catch((error) => {
          console.error(error)
          alert("Meal plan creation failed")
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  computed: {},
}
</script>
