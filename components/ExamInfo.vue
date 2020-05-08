<template>
  <div>
    <div v-if="!model.length" class="text-center red--text">
      <span
        class="display-1 font-weight-bold"
      >Hiện tại kỳ thi chưa được mở!!!</span>
      <div class="display-1">
        Khi nào kỳ thi được mở, vui lòng bấm F5 để lấy bài thi
      </div>
    </div>
    <v-card v-for="(item, key) in model" v-else :key="key" class="mb-5">
      <v-card-title class="justify-center">
        <div class="headline font-weight-black">
          Thông tin kỳ thi
        </div>
      </v-card-title>
      <v-card-text>
        <div class="headline py-2 text-center">
          {{ item.ExamName }}
        </div>
        <template v-if="item.TestStatus !== 0">
          <v-row no-gutters="">
            <v-col cols="12">
              <v-row no-gutters="" class="headline align-center">
                <v-col cols="7">
                  <div class="py-2">
                    Bắt đầu
                  </div>
                </v-col>
                <v-col>
                  <div>
                    <strong
                      class="font-weight-black"
                    >: {{ item.StartTime }}</strong>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-row no-gutters="" class="headline align-center">
                <v-col cols="7">
                  <div class="py-2">
                    Kết thúc
                  </div>
                </v-col>
                <v-col>
                  <div>
                    <strong
                      class="font-weight-black"
                    >: {{ item.endTime }}</strong>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </template>

        <v-row no-gutters="">
          <v-col cols="12">
            <v-row no-gutters="" class="headline align-center">
              <v-col cols="7">
                <div class="py-2">
                  Tổng số câu hỏi
                </div>
              </v-col>
              <v-col>
                <div>
                  <strong
                    class="font-weight-black"
                  >: {{ item.TongSoCau }}</strong>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters="">
          <v-col cols="12">
            <div class="headline pr-5" />
            <v-row no-gutters="" class="headline align-center">
              <v-col cols="7">
                <div class="py-2">
                  Thời gian làm mỗi câu
                </div>
              </v-col>
              <v-col>
                <div>
                  <strong
                    class="font-weight-black"
                  >: {{ item.TimePerQuestion }}</strong>
                  giây
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row no-gutters="" class="headline align-center">
              <v-col cols="7">
                <div class="py-2">
                  Tình trạng
                </div>
              </v-col>
              <v-col>
                <div>
                  <strong
                    class="font-weight-black"
                  >: {{ item.TinhTrangLamBai }}</strong>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-spacer class="mt-5" />
        <div class="text-justify">
          <strong
            class="subtitle-1 red--text font-weight-black font-italic"
          >{{ item.ThongTin }}
          </strong>
        </div>
        <div class="text-justify mt-3">
          <strong
            class="subtitle-1 red--text font-weight-black font-italic"
          >Ghi chú: {{ item.GhiChu }}
          </strong>
        </div>
      </v-card-text>
      <v-card-actions class="justify-center">
        <div v-if="item.TestStatus === 0">
          <v-btn class="mb-4 primary" @click="confirm(item)">
            Làm bài
          </v-btn>
        </div>
        <div v-if="item.TestStatus === 1">
          <v-btn class="mb-4 warning" @click="confirm(item)">
            Tiếp tục làm bài
          </v-btn>
        </div>
        <!-- <div v-if="item.TestStatus === 3">
          <v-btn @click="confirm(item)" class="mb-4" :disabled="true">
            Kết thúc
          </v-btn>
        </div> -->
        <!-- <v-btn @click="confirm(item)" :class="item.TestStatus === 0 ? 'success' : 'warning'" class="mb-4" :disabled="item.TestStatus === 3">
          Làm bài
        </v-btn> -->
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Array,
      required: true
    },

    doTest: {
      type: Function,
      required: true
    }
  },

  methods: {
    confirm(examInfo) {
      this.doTest(examInfo);
    }
  }
};
</script>
