<template>
  <v-dialog max-width="90vw" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="#c00000" dark>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-row align="baseline">
          <v-col>
            <v-card-title>Add food</v-card-title>
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <template v-slot:extension>
          <v-tabs v-model="tab" align-with-title>
            <v-tabs-slider></v-tabs-slider>
            <v-tab>
              <v-icon>mdi-database</v-icon>
            </v-tab>
            <v-tab>
              <v-icon>mdi-plus</v-icon>
            </v-tab>
            <v-tab>
              <v-icon>mdi-barcode-scan</v-icon>
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-divider></v-divider>

      <v-card-text>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <RegisteredFoodsTable
              :open="dialog"
              :meal_plan="meal_plan"
              @foodAdded="$emit('submit', $event)"
            />
          </v-tab-item>
          <v-tab-item>
            <FoodForm
              :open="dialog"
              @submit="
                $emit('submit', $event)
                dialog = false
              "
            />
          </v-tab-item>
          <v-tab-item>
            <BarcodeReaderTab
              :active="dialog"
              @foodFound="
                $emit('submit', $event)
                dialog = false
              "
            />
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="js">
import RegisteredFoodsTable from './RegisteredFoodsTable.vue'
import FoodForm from './FoodForm.vue'
import BarcodeReaderTab from './BarcodeReaderTab.vue'
export default {
    name: 'AddFoodDialog',
    props: {
        meal_plan: Object,
    },
    components: {
        RegisteredFoodsTable,
        FoodForm,
        BarcodeReaderTab,
    },
    data() {
        return {
            dialog: false,
            tab: null,
        }
    },

    mounted() {
    },
    methods: {

    }


}
</script>
