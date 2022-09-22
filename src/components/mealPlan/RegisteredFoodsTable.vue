<template>
    <v-data-table :loading="loading" :search="search" height="50vh" :headers="food_list_headers" :items="filtered_foods"
        :items-per-page="-1" sort-by="name" @click:row="$emit('foodAdded',{food: $event, quantity: 1})">

        <template v-slot:top>
            <v-container fluid>
                <v-text-field v-model="search" clearable append-icon="mdi-magnify" label="Search" hide-details />
            </v-container>
        </template>


        <template v-slot:item.image="{ item }">
            <v-img :width="thumbnail_size" :height="thumbnail_size" contain :src="image_src(item)" />
        </template>

        <template v-slot:item.serving="{ item }">
            {{ item.serving.size }} {{ item.serving.unit }}
        </template>

        <template v-slot:item.serving.calories="{ item }">
            <v-chip :color="item_too_calorific(item) ? colors.calorie_excess : ''" outlined>
                {{ item.serving.calories }}
            </v-chip>
        </template>

        <template v-slot:item.food.serving="{ item }">
            {{ item.food.serving.size }} {{ item.food.serving.unit }}
        </template>


    </v-data-table>
</template>

<script>
import colors from '@/colors'

export default {
    name: 'RegisteredFoodsTable',
    props: {
        meal_plan: Object,
        open: Boolean,
    },
    data() {
        return {
            colors,
            loading: false,
            foods: [],
            search: '',
            thumbnail_size: '6em',
        }
    },

    mounted() {
        this.get_foods()
    },
    watch: {
        open() {
            this.search = ''
        }
    },
    methods: {
        get_foods() {
            this.loading = true
            const url = `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods`
            this.axios.get(url)
                .then(({ data }) => {
                    this.foods = data.items
                })
                .catch(error => {
                    alert('Failed to get foods')
                    console.error(error)
                })
                .finally(() => {this.loading = false})
        },
        image_src({ _id, image }) {
            if (!_id) return require('@/assets/image-off.png')
            if (!image) return require('@/assets/image-off.png')
            else return `${process.env.VUE_APP_FOOD_MANAGER_API_URL}/foods/${_id}/thumbnail`
        },
        item_too_calorific({ serving: { calories } }) {
            return calories > (this.meal_plan.calories_target - this.calorie_total)
        },
    },
    computed: {
        calorie_total() {
            const total = this.meal_plan.foods.reduce((acc, { quantity, food }) => acc + quantity * food.serving.calories, 0)
            return Math.round(total * 100) / 100
        },
        filtered_foods() {
            return this.foods.filter(f => !f.hidden)
        },
        food_list_headers() {
            return [
                { text: '', value: 'image' },
                { text: 'Name', value: 'name' },
                { text: 'Vendor', value: 'vendor' },
                { text: 'Serving', value: 'serving' },
                { text: 'Calories', value: 'serving.calories' },
                { text: 'Protein', value: 'serving.macronutrients.protein' },
                { text: 'Fat', value: 'serving.macronutrients.fat' },
                { text: 'Carbs', value: 'serving.macronutrients.carbohydrates' },
            ]
        },
    }


}
</script>
