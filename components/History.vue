<template>
  <v-container>
    <v-row>
      <v-col v-if="lenghtPage">
        <div class="text-center mb-5">
          <h2>Lịch sử làm bài</h2>
        </div>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th width="5%" class="text-left">
                  STT
                </th>
                <th class="text-left">
                  Thời gian bắt đầu
                </th>
                <th class="text-left">
                  Thời gian kết thúc
                </th>
                <th class="text-left">
                  Số câu đúng
                </th>
                <th class="text-left">
                  Số điểm
                </th>
                <th class="text-left">
                  Thời gian làm bài (giây)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in exams" :key="item.STT">
                <td>{{ item.STT }}</td>
                <td>{{ item.ThoiGianThi }}</td>
                <td>{{ item.ThoiGianKetThuc }}</td>
                <td>{{ item.SoCauDung }}</td>
                <td>{{ item.SoDiem }}</td>
                <td>{{ item.ThoiGianLamBai }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <div class="text-center">
          <v-pagination v-model="page" :length="lenghtPage" />
        </div>
      </v-col>
      <v-col v-else class="text-center">
        <h2>Chưa có bài làm</h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import API from '~/config/api';
import { keys } from '~/config/localstorage';
const { getLocal } = require('~/utils/encryt');

export default {
  data: () => ({
    studentId: null,
    lenghtPage: 0,
    page: 0,
    exams: [],
  }),

  watch: {
    page() {
      this.changePage();
    },
  },

  async created() {
    const studentId = getLocal(keys.studentId);
    this.studentId = studentId;
    const { data } = await this.$axios(API.getExamHistories({ studentId }));
    this.lenghtPage = data[0].SoTrang;
    this.page = this.lenghtPage >= 1 ? 1 : 0;
  },

  methods: {
    async changePage() {
      this.exams = (
        await this.$axios(
          API.getExamHistory({ studentId: this.studentId, page: this.page })
        )
      ).data;
    },
  },
};
</script>
