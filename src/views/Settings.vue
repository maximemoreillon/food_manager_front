<template>
  <v-card
    max-width="600px"
    class="mx-auto">

    <v-card-title>Settings</v-card-title>

    <v-card-text>
      <v-row>
        <v-col>
          <!-- TODO: stop mutating store data with v-model -->
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

const {
  calories_target = 2500
} = process.env 

export default {
  name: 'Settings',
  components: {

  },
  data: () => ({
    settings: {
      calories_target
    },
    snackbar: {
      show: false,
      text: null,
      color: 'green',
    },

  }),
  mounted(){
  },
  methods:{

    update_settings(){
      const route = `/settings`
      this.axios.patch(route, this.$store.state.user_configuration)
      .then(() => {
        this.snackbar.text = 'Settings saved'
        this.snackbar.color = 'green'
        this.snackbar.show = true
      })
      .catch(error => {
        console.error(error)
        this.snackbar.text = 'Error'
        this.snackbar.color = 'red'
        this.snackbar.show = true
      })
    }


  },
}
</script>
