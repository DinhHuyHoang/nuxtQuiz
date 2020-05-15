<template>
  <div>
    <div v-if="model.ErrCode" class="text-center">
      <v-card>
        <v-card-text class="red--text">
          <div class="display-1 font-weight-bold">
            {{ model.ErrMsg }}
          </div>
        </v-card-text>
      </v-card>
    </div>
    <v-card v-else class="mb-5">
      <v-card-title class="justify-center">
        <div class="headline font-weight-black">
          Thông tin kỳ thi
        </div>
      </v-card-title>
      <v-card-text>
        <div class="headline py-2 text-center">
          {{ model.ExamName }}
        </div>
        <template v-if="model.TestStatus !== 0">
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
                    <strong class="font-weight-black">
                      : {{ model.StartTime }}
                    </strong>
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
                    <strong class="font-weight-black">
                      : {{ model.endTime }}
                    </strong>
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
                  <strong class="font-weight-black"
                    >: {{ model.TongSoCau }}</strong
                  >
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
                  <strong class="font-weight-black"
                    >: {{ model.TimePerQuestion }}</strong
                  >
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
                  <strong class="font-weight-black"
                    >: {{ model.TinhTrangLamBai }}</strong
                  >
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-spacer class="mt-5" />
        <div class="text-justify">
          <strong class="subtitle-1 red--text font-weight-black font-italic"
            >{{ model.ThongTin }}
          </strong>
        </div>
        <div class="text-justify mt-3">
          <strong class="subtitle-1 red--text font-weight-black font-italic"
            >Ghi chú: {{ model.GhiChu }}
          </strong>
        </div>
      </v-card-text>
      <v-card-subtitle
        v-if="model.TestStatus === 0 && captchaImage"
        class="py-0"
      >
        <v-form ref="formCaptcha">
          <v-row class="justify-center">
            <v-col class="py-0" cols="12">
              <div class="text-center">
                <img :src="`data:image/png;base64,${captchaImage}`" alt="" />
              </div>
            </v-col>
            <v-col cols="12" />
            <v-col class="py-0" cols="12" sm="8" md="6" lg="4">
              <v-text-field
                v-model="captcha"
                :rules="[rules.required]"
                label="Nhập các ký tự bên trên"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-subtitle>

      <v-card-actions class="justify-center">
        <v-btn
          ref="btnDoExam"
          :width="160"
          class="mb-4"
          :class="[model.TestStatus === 0 ? 'primary' : 'warning']"
          @click="confirmEl($event, model)"
        >
          {{
            model.TestStatus === 0
              ? 'Làm bài'
              : model.TestStatus === 1
              ? 'Tiếp tục làm bài'
              : 'Kết thúc'
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import API from '~/config/api';

export default {
  props: {
    model: {
      type: Object,
      required: true,
    },

    doTest: {
      type: Function,
      required: true,
    },
  },

  async fetch() {
    try {
      const { ErrCode } = this.model;
      if (!ErrCode) {
        const studentTestId = this.model.StudentTestID;
        const { data } = await this.$axios(API.getCaptcha({ studentTestId }));
        this.captchaImage = data.CaptchaImage;

        this.$nextTick(() => {
          this.$refs.btnDoExam.$el.addEventListener('click', (event) => {
            const [x, y] = [event.clientX, event.clientY];
            const elementMouseIsOver = document.elementFromPoint(x, y);
            const isValid = elementMouseIsOver === this.elDoExam;

            if (isValid && event.isTrusted) {
              this.confirm(this.currentExam);
            }
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  data: () => ({
    rules: {
      required: (value) => !!value || 'Không được bỏ trống trường này',
    },
    currentExam: null,
    captchaImage: null,
    captcha: null,
  }),

  methods: {
    confirm(examInfo) {
      const { formCaptcha } = this.$refs;

      if (formCaptcha === undefined) {
        this.doTest(examInfo, this.captcha);
        return;
      }

      if (formCaptcha.validate()) {
        this.doTest(examInfo, this.captcha);
      }
    },

    confirmEl(event, exam) {
      this.elDoExam = event.target;
      this.currentExam = exam;
    },
  },
};
</script>
