<template>
  <v-card>
    <v-card-title>Food manager</v-card-title>
    <v-card-subtitle> v{{ version }} </v-card-subtitle>

    <v-card-text>
      <p>Deveoped and maintained by Maxime MOREILLON</p>
      <v-data-table
        hide-default-footer
        :itemsPerPage="-1"
        :headers="headers"
        :items="services"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { version } from "@/../package.json"
const {
  VUE_APP_LOGIN_URL,
  VUE_APP_IDENTIFICATION_URL,
  VUE_APP_FOOD_MANAGER_API_URL,
} = process.env

export default {
  name: "About",
  data() {
    return {
      version,
      headers: [
        { text: "API", value: "name" },
        { text: "URL", value: "url" },
      ],
      services: [
        {
          name: "Back-end",
          url: VUE_APP_FOOD_MANAGER_API_URL,
        },
        {
          name: "Login",
          url: VUE_APP_LOGIN_URL,
        },
        {
          name: "Identification",
          url: VUE_APP_IDENTIFICATION_URL,
        },
      ],
    }
  },
  mounted() {},
  methods: {},
}
</script>

<style scoped></style>
