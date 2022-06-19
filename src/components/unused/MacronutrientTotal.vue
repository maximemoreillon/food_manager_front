<!-- UNUSED -->
<template>
  <v-card outlined>
    <v-card-title>Protein</v-card-title>
    <v-card-text>{{total_of_property(meal_plan.foods, 'protein')}}g</v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'MacronutrientTotal',
    props: {
      meal_plan: Object,
    },

  }
</script>
