<template>
  <v-row justify="center" class="mt-4">
    <v-col cols="auto">
      <StreamBarcodeReader @decode="onDecode" />
    </v-col>
  </v-row>
</template>

<script>
import { StreamBarcodeReader } from "vue-barcode-reader"

export default {
  components: {
    StreamBarcodeReader,
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    onDecode(barcode) {
      this.loading = true

      const params = { barcode }

      this.axios
        .get("/foods", { params })
        .then(({ data }) => {
          const { total, items } = data
          if (!total) return
          if (total.length > 1) return alert("Multiple matches found")
          this.$emit("foodFound", { food: items[0], quantity: 1 })
        })
        .catch((error) => {
          alert("Failed to get foods")
          console.error(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>
