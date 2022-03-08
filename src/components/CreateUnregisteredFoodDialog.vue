<template>
  <v-dialog
    max-width="600px"
    v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"  >
        Add unregistered food
      </v-btn>
    </template>
    <v-form @submit.prevent="submit()">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Add unregistered food</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              icon
              dark
              @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                label="Food name"
                v-model="food.name" />
            </v-col>
          </v-row>
          <v-row>

            <v-col>
              <v-text-field
                type="number"
                label="Calories [kcal]"
                v-model="food.calories_per_serving" />
            </v-col>
            <v-col>
              <v-text-field
                label="Quantity"
                type="number"
                v-model="food.quantity" />
            </v-col>
          </v-row>
          <v-row>

            <v-col>
              <v-text-field
                label="Protein [g]"
                type="number"
                v-model="food.protein" />
            </v-col>
            <v-col>
              <v-text-field
                label="Fat [g]"
                type="number"
                v-model="food.fat" />
            </v-col>
            <v-col>
              <v-text-field
                label="Carbs [g]"
                type="number"
                v-model="food.carbohydrates" />
            </v-col>
          </v-row>
          <v-row>
            <v-spacer/>
            <v-col cols="auto">
              <v-btn
                @click="dialog = false">
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                type="submit">
                Submit
              </v-btn>
            </v-col>

          </v-row>
        </v-card-text>

      </v-card>
    </v-form>

  </v-dialog>
</template>

<script>
  export default {
    name: 'CreateUnregisteredFoodDialog',
    props: {

    },
    data(){
      return {
        dialog: false,
        defaults: {
          name: null,
          calories_per_serving: 0,
          fat: 0,
          carbohydrates: 0,
          protein: 0,
          quantity: 1,
        },
        food: null,
      }
    },
    mounted(){
      this.food = {...this.defaults}
    },
    methods: {
      submit(){
        this.$emit('foodSubmitted', {...this.food})
        this.dialog = false
        this.food = {...this.defaults}
      }
    }


  }
</script>
