<template>
  <v-dialog max-width="50rem" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary">
        <v-icon>mdi-barcode-scan</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title> Barcode reader </v-card-title>

      <v-card-text>
        <v-row align="center">
          <v-col>
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
