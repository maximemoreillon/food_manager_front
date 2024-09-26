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
        :items="envVars"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { version } from "@/../package.json"

export default {
  name: "About",
  data() {
    return {
      version,
      headers: [
        { text: "Environment variable", value: "name" },
        { text: "Value", value: "value" },
      ],
      envVars: [],
    }
  },
  mounted() {
    const names = [
      "VUE_APP_FOOD_MANAGER_API_URL",
      "VUE_APP_LOGIN_URL",
      "VUE_APP_IDENTIFICATION_URL",
      "VUE_APP_OIDC_AUTHORITY",
    ]

    names.forEach((name) => {
      const value = process.env[name]
      if (value)
        this.envVars.push({
          name,
          value,
        })
    })
  },
  methods: {},
}
</script>

<style scoped></style>
