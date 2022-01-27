<template>
  <apexchart
    height="100%"
    type="donut"
    :options="chart_options"
    :series="series"/>
</template>

<script>
  export default {
    name: 'MacronutrientChart',
    props: {
      options: {type: Object, default(){return {}}},
      protein: Number,
      fat: Number,
      carbohydrates: Number,
    },
    data(){
      return {
      }
    },
    computed: {
      series(){
        return [ this.protein, this.fat, this.carbohydrates ]
      },
      chart_options(){
        return {
          ...this.options,
          labels: ['Protein', 'Fat', 'Carbohydrates'],
          //colors: ['#eb4034', '#ebd034', '#3bb84b']
        }
      }
    }

  }
</script>
