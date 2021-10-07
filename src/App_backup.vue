<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Food manager</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app>

      <v-list
        nav >

        <v-list-item :to="{name: 'foods'}">
          <v-list-item-title>Foods</v-list-item-title>
        </v-list-item>

        <v-list-item :to="{name: 'menu_builder'}">
          <v-list-item-title>Menu builder</v-list-item-title>
        </v-list-item>

        <v-list-item :to="{name: 'meal_plans'}">
          <v-list-item-title>Meal Plans</v-list-item-title>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <v-main class='grey lighten-3'>
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    drawer: false,
  }),
};
</script>
