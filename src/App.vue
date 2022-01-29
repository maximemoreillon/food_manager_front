<template>
  <AppTemplate
    :options="options"
    @user="user_changed($event)">

    <template v-slot:nav>
      <v-list
        dense
        nav >
        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact>
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

  </AppTemplate>
</template>

<script>
import AppTemplate from '@moreillon/vue_application_template_vuetify'
export default {
  name: 'App',

  components: {
    AppTemplate
  },

  data: () => ({
    options: {
      title: "Food manager",
      authenticate: true,
      skip_greetings: process.env.NODE_ENV === 'development',
      login_url: `${process.env.VUE_APP_AUTHENTICATION_API_URL}/login`,
      identification_url: `${process.env.VUE_APP_AUTHENTICATION_API_URL}/v2/whoami`,
      main_class: 'grey lighten-3',
      footer_color: 'grey lighten-3',
    },
    nav: [
      {title: 'Foods', to: {name: 'foods'}, icon: 'mdi-food'},
      {title: 'Meal plans', to: {name: 'meal_plans'}, icon: 'mdi-format-list-bulleted'},
      {title: 'Settings', to: {name: 'settings'}, icon: 'mdi-cogs'},

      {title: 'About', to: {name: 'about'}, icon: 'mdi-information-outline'},
    ]
  }),

  mounted(){
  },

  methods: {
    user_changed(user){
      if(!user) return
      this.get_settings()
    },
    get_settings(){
      const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/settings`
      this.axios.get(url)
      .then(({data}) => {
        this.$store.commit('set_user_configuration',data)
      })
      .catch(error => {
        console.error(error)
      })

    },
  }
};
</script>
