<template>
    <div>
        <v-row align="baseline">

            <v-col md="2">
                <v-text-field :error="calories > target" :prefix="`${calories}/`" label="Calories" color="red" type="number" outlined dense
                    rounded v-model.number="targetModel" />

            </v-col>
            <v-spacer />
            <v-col cols="auto">
                <v-chip v-for="(value, key) in macronutrients" :key="key" class="mx-1" :color="colors[key]">
                    {{value}}g {{ key }}
                </v-chip>
            </v-col>
        </v-row>

        <div class=" wrapper">
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
                'background-color': this.colors[macro],
                'border-top-right-radius': macro === 'carbohydrates' ? '0.5em' : '0',
                'border-bottom-right-radius': macro === 'carbohydrates' ? '0.5em' : '0',
                'border-top-left-radius': macro === 'protein' ? '0.5em' : '0',
                'border-bottom-left-radius': macro === 'protein' ? '0.5em' : '0',
            }
        }
    },
    computed: {
        calorie_to_target_ratio(){
            return this.calories/this.target
        },
        calorie_bar_style(){
            return {
                width: `${100 * this.calories / this.calorie_bar_max}%`,
                // 'background-color': this.calories > this.target ? this.colors.calorie_excess : this.colors.calories
            }
        },
        target_bar_style(){
            return {
                width: `${100 * (1 - this.target / this.calorie_bar_max)}%`
            }
        },

        macros_total_mass(){
            const {protein, fat, carbohydrates} = this.macronutrients
            return protein + fat + carbohydrates
        },
        calorie_bar_max(){
            return Math.max(this.target, this.calories)
        },
        targetModel: {
            get() { return this.target },
            set(value) { this.$emit('update:target', value) },
        }

    }
}
</script>

<style scoped>
.wrapper {
    border: 1px solid #dddddd;
    margin-top: 0.5em;
    border-radius: 0.5em;
    position: relative;
}


.calorie_counter {
    text-align: center;
}

.calories_bar {
    border-radius: 0.5em;
    padding: 0.25em;
    display: flex;
    transition: width 0.25s;
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
    height: 1.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #444444;
    transition: width 0.25s;
    overflow: hidden;
}

</style>