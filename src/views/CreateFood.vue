<template>
  <v-card>
    <v-toolbar flat>
      <v-btn
        icon
        :to="{name: 'foods'}">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Create food</v-toolbar-title>
      <v-spacer/>
    </v-toolbar>
    <v-divider/>

    <v-card-text>
      <v-form @submit.prevent="create_food()">
        <v-row>
          <v-col>
            <v-text-field
              ref="name_input"
              label="name"
              v-model="new_food.name" />
          </v-col>
          <v-col cols="auto">
            <v-btn type="submit">Submit</v-btn>
          </v-col>
        </v-row>

      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'CreateFood',

  data: () => ({
    new_food: {
      name: '',
    }

  }),
  mounted(){
    setTimeout(() => {
      this.$refs.name_input.focus()
    },10)
  },
  methods: {
    create_food(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods`
      this.axios.post(url,this.new_food)
      .then(({data}) => {
        this.$router.push({name: 'food', params: {food_id: data._id}})
      })
      .catch(error => {
        console.error(error)
      })
    }
  }
}
</script>
