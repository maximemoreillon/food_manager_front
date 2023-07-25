<template>
  <v-card max-width="500px" class="mx-auto">
    <v-toolbar flat>
      <v-btn icon exact :to="{ name: 'foods' }">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Create food</v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <v-divider />

    <v-card-text>
      <v-form @submit.prevent="create_food()">
        <v-row align="baseline">
          <v-col>
            <v-text-field autofocus label="name" v-model="new_food.name" />
          </v-col>
          <v-col cols="auto">
            <v-btn type="submit" color="primary" :loading="loading">
              <v-icon left>mdi-plus</v-icon>
              <span>Create</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "CreateFood",

  data: () => ({
    loading: false,
    new_food: {
      name: "",
    },
  }),
  methods: {
    create_food() {
      this.loading = true
      this.axios
        .post(`/foods`, this.new_food)
        .then(({ data }) => {
          this.$router.push({ name: "food", params: { food_id: data._id } })
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
