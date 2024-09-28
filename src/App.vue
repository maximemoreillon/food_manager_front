<template>
  <AppTemplate :options="options" @user="handleUserChanged($event)">
    <template v-slot:nav>
      <v-list dense nav>
        <v-list-item
          v-for="(item, index) in nav"
          :key="`nav_item_${index}`"
          :to="item.to"
          exact
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </AppTemplate>
</template>

<script>
import AppTemplate from "@moreillon/vue_application_template_vuetify"
const {
  VUE_APP_LOGIN_URL,
  VUE_APP_IDENTIFICATION_URL,
  VUE_APP_OIDC_AUTHORITY,
  VUE_APP_OIDC_CLIENT_ID,
  VUE_APP_OIDC_AUDIENCE,
} = process.env
export default {
  name: "App",

  components: {
    AppTemplate,
  },

  data: () => ({
    options: {
      title: "Food manager",
      authenticate: true,
      login_url: VUE_APP_LOGIN_URL,
      identification_url: VUE_APP_IDENTIFICATION_URL,
      oidc: {
        authority: VUE_APP_OIDC_AUTHORITY,
        client_id: VUE_APP_OIDC_CLIENT_ID,
        extraQueryParams: {
          audience: VUE_APP_OIDC_AUDIENCE,
        },
      },
    },
    nav: [
      {
        title: "Meal plans",
        to: { name: "meal_plans" },
        icon: "mdi-silverware-fork-knife",
      },
      { title: "Foods", to: { name: "foods" }, icon: "mdi-food" },
      { title: "Settings", to: { name: "settings" }, icon: "mdi-cogs" },

      {
        title: "About",
        to: { name: "about" },
        icon: "mdi-information-outline",
      },
    ],
  }),
  methods: {
    handleUserChanged(user) {
      if (!user) return
      if (user.access_token)
        this.axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${user.access_token}`
    },
  },
}
</script>
