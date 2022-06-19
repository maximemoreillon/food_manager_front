<!-- UNUSED -->
<template>
  <v-progress-circular
    rounded
    :value="100 * calories / calories_target"
    :size="size || 80"
    :color="color">
    <span class="black--text">{{calories}}</span>
  </v-progress-circular>
</template>

<script>
  export default {
    name: 'CaloriesProgressCircular',
    props: {
      size: Number,
      calories: Number,
      height: Number,
    },
    data(){
      return {
      }
    },
    computed: {
      color(){
        return this.calories > this.calories_target ? 'red' : 'blue'
      },
      calories_target(){
        return this.$store.state.user_configuration.calories_target
      }
    }

  }
</script>
