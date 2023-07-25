<template>
  <v-card max-width="40rem" class="mx-auto">
    <v-toolbar flat>
      <v-toolbar-title>New Meal plan</v-toolbar-title>
    </v-toolbar>
    <v-divider />

    <v-card-text>
      <v-form @submit.prevent="create_meal_plan()">
        <v-row align="center">
          <v-col>
            <v-text-field autofocus label="Name" v-model="meal_plan.name" />
          </v-col>
          <v-col cols="auto">
            <v-btn color="primary" type="submit">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Foods",

  data: () => ({
    meal_plan: {
      name: "",
    },
  }),

  methods: {
    create_meal_plan() {
      const route = `/meal_plans`
      const body = this.meal_plan
      this.axios
        .post(route, body)
        .then(({ data }) => {
          this.$router.push({
            name: "meal_plan",
            params: { meal_plan_id: data._id },
          })
        })
        .catch((error) => {
          console.error(error)
          alert("Failed")
        })
    },
  },
  computed: {},
}
</script>
