<template>
    <v-card-text>
        <v-form @submit.prevent="submit()" v-if="food">

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
            <v-row>

                <v-spacer></v-spacer>
                <v-col cols="auto">
                    <v-btn type="submit">Submit</v-btn>
                </v-col>
            </v-row>


        </v-form>
    </v-card-text>

</template>

<script>
export default {
    name: 'FoodForm',
    props: {
        item: Object,
    },
    data() {
        return {
            quantity: 1,
            defaults: {
                name: 'Default',
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

    },
    mounted() {
        if(this.item) {
            this.food = this.item.food,
            this.quantity = this.item.quantity
        }
        else {
            this.food = { ...this.defaults }
            this.quantity = 1
        }
    },
    methods: {
        submit() {
            this.$emit('submit', { quantity: this.quantity, food: { ...this.food } })
            this.food = { ...this.defaults }
        }
    }


}
</script>
