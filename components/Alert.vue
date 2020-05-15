<template>
  <v-alert
    v-if="model.message"
    prominent
    :color="model.color"
    :type="model.type"
  >
    <!-- eslint-disable-next-line -->
    <div v-html="$sanitize(model.message)" />
  </v-alert>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
};
</script>
