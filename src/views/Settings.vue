<template>
  <v-card
    max-width="600px"
    class="mx-auto">

    <v-card-title>Settings</v-card-title>

    <v-card-text>
      <v-row>
        <v-col>
          <v-text-field
            label="Current calories target"
            v-model="$store.state.user_configuration.calories_target" />
        </v-col>
      </v-row>
      <v-row>
        <v-spacer/>
        <v-col cols="auto">
          <v-btn @click="update_settings()">
            <v-icon>mdi-content-save</v-icon>
            <span class="ml-2">Save</span>
          </v-btn>
        </v-col>
      </v-row>





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
