<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <template v-else>
      <v-row justify="center" class="align-center text-center">
        <v-col>
          <span class="title font-weight-bold">{{ otherError }}</span>
          <div>
            <v-btn class="info mt-5" @click="reload">
              TẢI LẠI TRANG
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>
  </v-app>
</template>

<script>
const {
  clearLocal
} = require('~/utils/encryt');

export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'Có lỗi xãy ra vui lòng tải lại trang'
    };
  },
  methods: {
    reload() {
      clearLocal();
      window.location.reload();
    }
  },

  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title
    };
  }
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
