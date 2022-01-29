<template>
  <v-card>

    <v-card-title>Settings</v-card-title>

    <v-card-text>
      <v-text-field
        label="Calories target"
        v-model="$store.state.user_configuration.calories_target" />

        <v-btn @click="update_settings()">
        Save</v-btn>

    </v-card-text>


  </v-card>
</template>

<script>


export default {
  name: 'Settings',
  components: {

  },
  data: () => ({
    settings: {
      calories_target: process.env.VUE_APP_DEFAULT_CALORIES_TARGET || 2500
    },

  }),
  mounted(){
  },
  methods:{

    update_settings(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/settings`
      this.axios.patch(url, this.$store.state.user_configuration)
      .then(() => {

      })
      .catch(error => {
        console.error(error)
      })
    }


  },
}
</script>
