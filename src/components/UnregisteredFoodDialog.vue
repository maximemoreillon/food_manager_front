<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">

      <v-btn v-if="item" icon v-bind="attrs" v-on="on">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-btn v-else v-bind="attrs" v-on="on" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>

    </template>
    <v-form @submit.prevent="submit()">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title v-if="item">Edit food</v-toolbar-title>
          <v-toolbar-title v-else>Add unregistered food</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text v-if="food">
          <v-row>
            <v-col>
              <v-text-field label="Food name" v-model="food.name" />
            </v-col>
            <v-col>
              <v-text-field label="Quantity" v-model.number="quantity" />
            </v-col>
          </v-row>
          <v-row>

            <v-col>
              <v-text-field type="number" label="Serving size" v-model.number="food.serving.size" />
            </v-col>
            <v-col>
              <v-text-field label="Unit" v-model="food.serving.unit" />
            </v-col>
            <v-col>
              <v-text-field type="number" label="Calories [kcal]" v-model.number="food.serving.calories" />
            </v-col>
          </v-row>
          <v-row>

            <v-col>
              <v-text-field label="Protein [g]" type="number" v-model="food.serving.macronutrients.protein" />
            </v-col>
            <v-col>
              <v-text-field label="Fat [g]" type="number" v-model="food.serving.macronutrients.fat" />
            </v-col>
            <v-col>
              <v-text-field label="Carbs [g]" type="number" v-model="food.serving.macronutrients.carbohydrates" />
            </v-col>
          </v-row>

          <v-row v-if="!item">
            <v-spacer />
            <v-col cols="auto">
              <v-btn @click="dialog = false">
                Cancel
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn type="submit">
                Submit
              </v-btn>
            </v-col>
          </v-row>

          <v-row v-else>
            <v-spacer />
            <v-col cols="auto">
              <v-btn @click="dialog = false">
                Close
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
    name: 'UnregisteredFoodDialog',
    props: {
      item: Object,
    },
    data(){
      return {
        dialog: false,
        quantity: 1,
        defaults: {
          name: null,
          serving: {
            calories: 0,
            size: 0,
            unit: 'g',
            macronutrients: {
              fat: 0,
              carbohydrates: 0,
              protein: 0,
            }
          },
          
        },
        food: null,
      }
    },
    watch: {
      dialog(){
        if (!this.dialog || !this.item) {
          this.food = { ...this.defaults },
            this.quantity = 1
        }
        else if(this.item) {
            this.food = {...this.item.food},
            this.quantity = this.item.quantity
          }
      }
    },
    mounted(){
      this.food = {...this.defaults}
    },
    methods: {
      submit(){
        this.$emit('foodSubmitted', {quantity: this.quantity, food: {...this.food}})
        this.dialog = false
        this.food = {...this.defaults}
      }
    }


  }
</script>
