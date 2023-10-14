<template>
  <v-card
    :loading="loading"
    max-width="600px"
    class="mx-auto">

    <v-card-title>Settings</v-card-title>

    <v-card-text v-if="!loading">
      <v-row>
        <v-col>
          <!-- TODO: stop mutating store data with v-model -->
          <v-text-field
            label="Default calories target"
            v-model="settings.calories_target" />
        </v-col>
      </v-row>
      <v-row>
        <v-spacer/>
        <v-col cols="auto">
          <v-btn @click="update_settings()" :loading="saving">
            <v-icon left>mdi-content-save</v-icon>
            <span >Save</span>
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


export default {
  name: 'Settings',
  components: {

  },
  data: () => ({
    loading: false,
    saving: false,
    settings: {
      calories_target: 2500,
    },
    snackbar: {
      show: false,
      text: null,
      color: 'green',
    },

  }),
  mounted(){
    this.getSettings()
  },
  methods:{
    async getSettings(){
      this.loading = true
        const {data} = await this.axios.get('/settings')
        this.settings = data
        this.loading = false
    },
    update_settings(){
      this.saving = true
      const route = `/settings`
      this.axios.patch(route, this.settings)
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
      .finally(() => {
        this.saving = false
      })
    }


  },
}
</script>
