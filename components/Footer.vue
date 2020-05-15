<template>
  <v-container fluid pa-0>
    <v-row
      style="background-color: #b40002; height: 40px;"
      class="justify-center align-center white--text"
    >
      <!-- eslint-disable vue/no-v-html -->
      <span
        class="subtitle text-uppercase font-weight-bold"
        style="line-height: 2;"
        v-html="(pageInfo && $sanitize(pageInfo.Bottom)) || ''"
      />
    </v-row>
  </v-container>
</template>

<script>
import API from '~/config/api';
import { keys } from '~/config/localstorage';
const {
  myEncode,
  myDecode,
  saveLocal,
  getLocal,
  removeLocal,
} = require('~/utils/encryt');

export default {
  data: () => ({
    pageInfo: null,
  }),

  async created() {
    this.pageInfo = await this.fetchPageInfo();
  },

  methods: {
    async fetchPageInfo() {
      const localPageInfo = getLocal(keys.pageInfo);
      if (localPageInfo) {
        return localPageInfo;
      }

      const pageInfo = (await this.$axios(API.getPageInfo())).data[0];
      saveLocal(keys.pageInfo, pageInfo);
      return pageInfo;
    },
  },
};
</script>
