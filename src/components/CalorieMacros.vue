<template>
    <div>
        <v-row>
            <v-col>
                {{calories}} / {{target}} kcal
            </v-col>
            <v-spacer />
            <v-col cols="auto" v-for="(value, key) in macronutrients" :key="key">
                <span :style="{ color: colors[key] }">{{value}}g {{ key }}</span>
            </v-col>
        </v-row>

        <div class=" wrapper" :style="wrapper_style">
            <div class="target_bar" :style="target_bar_style" v-if="calories > target"></div>

            <div class="calories_bar" :style="calorie_bar_style">
                <div class="macro_bar" v-for="(value, key) in macronutrients" :key="`bar_${key}`"
                    :style="macro_bar_style(key)">
                </div>
            </div>


        </div>

    </div>
</template>
<script>
import colors from '@/colors'

export default {
    name: 'CalorieMacros',
    props: {
        calories: {
            type: Number,
            default: () => 0,
        },
        target: {
            type: Number,
            default(){
                return this.$store.state.user_configuration.calorie_target
            },
        },
        macronutrients: {
            type: Object,
            default: () => ({protein: 0, fat: 0, carbohydrates: 0})
        }
    },
    data(){
        return {
            colors
        }
    },
    methods: {
        macro_bar_style(macro){
            return {
                width: `${100 * this.macronutrients[macro] / this.macros_total_mass}%`,
                'background-color': colors[macro]
            }
        }
    },
    computed: {
        calorie_to_target_ratio(){
            return this.calories/this.target
        },
        calorie_bar_style(){
            return {
                width: `${100 * this.calories / this.calorie_bar_max}%`
            }
        },
        target_bar_style(){
            return {
                width: `${100 * (1 - this.target / this.calorie_bar_max)}%`
            }
        },
        wrapper_style(){
            return {
                'background-color': this.calories > this.target ? 'lightpink' : 'aliceblue'
            }
        },
        macros_total_mass(){
            const {protein, fat, carbohydrates} = this.macronutrients
            return protein + fat + carbohydrates
        },
        calorie_bar_max(){
            return Math.max(this.target, this.calories)
        }
    }
}
</script>

<style scoped>
.wrapper {
    margin-top: 0.5em;
    border-radius: 0.5em;
    position: relative;
}


.calorie_counter {
    text-align: center;
}

.calories_bar {
    padding: 0.5em;
    display: flex;
    transition: width 0.25s;
    gap: 0.1em;
}

.target_bar {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    border-left: 2px solid #c00000;
    transition: width 0.25s;
}

.macro_bar {
    border-radius: 0.5em;
    height: 1.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #444444;
    transition: width 0.25s;
    overflow: hidden;
}

</style>