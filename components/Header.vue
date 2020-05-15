<template>
  <v-container fluid pa-0>
    <v-row
      style="background-color: #b40002; height: 40px;"
      class="justify-center align-center white--text"
    >
      <div style="margin-left: 16px;" class="flex-shrink-1">
        <v-btn
          href="http://timhieuphapluat.dongnai.gov.vn/"
          class="white--text"
          icon
        >
          <v-icon>home</v-icon>
        </v-btn>
      </div>
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="subtitle text-uppercase font-weight-bold flex-grow-1 text-center"
        style="line-height: 2;"
        v-html="(pageInfo.Title && $sanitize(pageInfo.Title)) || ''"
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
  async fetch() {
    this.pageInfo = await this.fetchPageInfo();
  },
  data: () => ({
    pageInfo: {},
  }),

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
  head() {
    return {
      title: this.$sanitize(this.pageInfo.Title),
    };
  },
};
</script>
