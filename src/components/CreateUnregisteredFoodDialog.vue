<template>
  <v-dialog
      v-model="dialog">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"  >
          Add custom food
        </v-btn>
      </template>
      <v-form @submit.prevent="submit()">
        <v-card>
          <v-toolbar flat>
            <v-toolbar-title>Add custom food</v-toolbar-title>
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
                  label="name"
                  v-model="food.name" />
              </v-col>
              <v-col>
                <v-text-field
                  label="Calories [kcal]"
                  v-model="food.calories_per_serving" />
              </v-col>
              <v-col>
                <v-text-field
                  label="Quantity"
                  v-model="food.quantity" />
              </v-col>
            </v-row>
            <v-row>

              <v-col>
                <v-text-field
                  label="Protein [g]"
                  v-model="food.protein" />
              </v-col>
              <v-col>
                <v-text-field
                  label="Fat [g]"
                  v-model="food.fat" />
              </v-col>
              <v-col>
                <v-text-field
                  label="Carbs [g]"
                  v-model="food.carbohydrates" />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="auto">
                <v-btn
                  type="submit">Submit</v-btn>
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
        food: {
          name: null,
          calories_per_serving: 0,
          fat: 0,
          carbohydrates: 0,
          protein: 0,
          quantity: 1,
        }
      }
    },
    methods: {
      submit(){
        this.$emit('foodSubmitted', this.food)
      }
    }


  }
</script>
