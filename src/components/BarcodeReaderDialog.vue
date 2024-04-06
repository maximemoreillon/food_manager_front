<template>
  <v-dialog max-width="50rem" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary">
        <v-icon>mdi-barcode-scan</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Barcode reader</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-row align="center" justify="center" class="mt-4">
          <v-col cols="auto">
            <StreamBarcodeReader @decode="onDecode" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader"

export default {
  name: "BarcodeReaderDialog",
  components: {
    StreamBarcodeReader,
  },

  data: () => ({
    dialog: false,
  }),

  methods: {
    onDecode(barcode) {
      this.$emit("decode", barcode)
      this.dialog = false
    },
  },
}
</script>
