<template>
  <v-dialog max-width="30rem" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" :outlined="outlined">
        <v-icon>mdi-label</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title> Label parsing </v-card-title>
      <v-card-text>
        <v-row align="center">
          <v-col>
            <v-file-input v-model="image" label="image" />
          </v-col>
          <v-col cols="auto">
            <v-btn
              :disabled="!image"
              @click="parseLabel()"
              :loading="imageUploading"
              color="primary"
            >
              <v-icon>mdi-brain</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "LabelParsing",
  props: {
    outlined: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    image: null,
    imageUploading: false,
    dialog: false,
  }),

  methods: {
    async parseLabel() {
      this.imageUploading = true
      const formData = new FormData()
      formData.append("image", this.image)
      try {
        const { data } = await this.axios.post(`/label`, formData)
        this.$emit("parsed", data)
        this.dialog = false
      } catch (error) {
        alert("Label parsing failed")
      } finally {
        this.imageUploading = false
      }
    },
  },
}
</script>
