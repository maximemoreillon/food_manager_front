<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">

      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

    </template>

    <v-card>

      <v-toolbar flat>
        <v-toolbar-title>Edit food</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <!-- Using v-if dialog so as to refresh food form content -->
      <FoodForm v-if="dialog" :item="item" @submit="dialog = false"/>
    </v-card>

  </v-dialog>
</template>

<script>
import FoodForm from './FoodForm.vue'

export default {
  name: 'FoodEditDialog',
  components: {
    FoodForm
  },
  props: {
    item: Object,
  },
  data(){
    return {
      dialog: false,
     
    }
  },
  watch: {
    // dialog(){
    //   if (!this.dialog || !this.item) {
    //     this.food = { ...this.defaults },
    //       this.quantity = 1
    //   }
    //   else if(this.item) {
    //       this.food = {...this.item.food},
    //       this.quantity = this.item.quantity
    //     }
    // }
  },
  mounted(){
    // this.food = {...this.defaults}
  },
  methods: {
    submit(){
      this.$emit('submit', {quantity: this.quantity, food: {...this.food}})
      // this.dialog = false
      // this.food = {...this.defaults}
    }
  }


}
</script>
