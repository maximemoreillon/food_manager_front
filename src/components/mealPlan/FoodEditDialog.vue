<template>
  <v-dialog max-width="50rem" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title> Edit food </v-card-title>

      <FoodForm :item="item" @submit="submit($event)" :open="dialog" />
    </v-card>
  </v-dialog>
</template>

<script>
import FoodForm from "./FoodForm.vue"

export default {
  name: "FoodEditDialog",
  components: {
    FoodForm,
  },
  props: {
    item: Object,
  },
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    submit($event) {
      this.$emit("submit", $event)
      this.dialog = false
    },
  },
}
</script>
