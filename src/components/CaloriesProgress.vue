<!-- UNUSED -->
<template>
  <v-progress-linear
    rounded
    :value="100 * calories / calories_target"
    height="50"
    :color="color">
    {{calories}} / {{calories_target}}
  </v-progress-linear>
</template>

<script>
  export default {
    name: 'CaloriesProgress',
    props: {
      calories: Number,
      height: Number,
    },
    data(){
      return {
        calories_target: 2600
      }
    },
    computed: {
      color(){
        return this.calories > this.calories_target ? 'red' : 'blue'
      }
    }

  }
</script>
