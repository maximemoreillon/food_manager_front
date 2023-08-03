<template>
  <v-btn icon>
    <v-icon @click="toggleTheme()">mdi-theme-light-dark</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "ThemeToggler",
  mounted() {
    if (localStorage.getItem("theme") === "dark")
      this.$vuetify.theme.dark = true
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem("theme", this.$vuetify.theme.dark ? "dark" : "light")
    },
  },
}
</script>
