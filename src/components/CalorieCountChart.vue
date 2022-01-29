<template>
  <apexchart
    type="donut"
    :options="chart_options"
    :series="series"/>
</template>

<script>
  export default {
    name: 'CalorieCountChart',
    props: {
      options: {type: Object, default(){return {}}},
      calories: Number,
    },
    data(){
      return {
      }
    },
    computed: {
      calories_target(){
        return this.$store.state.user_configuration.calories_target
      },
      series(){
        return [ this.calories, this.remaining_calories ]
      },
      remaining_calories(){
        return Math.round((this.calories_target - this.calories) * 100) / 100
      },
      color(){
        return this.remaining_calories > 0 ? '#0599f5' : '#c00000'
      },
      chart_options(){
        return {
          ...this.options,
          labels: [`Consumed: ${this.calories} kcal`, `Remaining: ${this.remaining_calories} kcal`],
          colors: [this.color, '#e3f1fa']
        }
      }
    }

  }
</script>
