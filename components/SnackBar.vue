<template>
  <div class="text-center">
    <v-snackbar v-model="isShowUp" top :color="type" :timeout="timeout">
      {{ message }}
      <v-btn color="white" text @click="isShowUp = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    isShowUp: false,
    message: '',
    timeout: 5000,
    type: '',
  }),

  methods: {
    notify({ type, message, timeout, callback }) {
      this.isShowUp = true;
      this.type = type;
      this.message = message;
      this.timeout = timeout;

      if (callback) {
        setTimeout(() => {
          callback();
        }, timeout);
      }
    },
  },
};
</script>
