<template>
  <v-row no-gutters>
    <v-col>
      <v-row no-gutters class="fixed">
        <v-col>
          <v-card style="border-radius:0;" flat color="#b40002">
            <v-card-text class="pa-1 white--text">
              <v-row
                style="height: 48px;"
                no-gutters
                class="justify-center align-center"
              >
                <v-col class="text-center">
                  <div class="title">
                    <span>Còn lại: </span>
                    {{ timeRemaining / 1000 >= 0 ? timeRemaining / 1000 : 0 }}
                  </div>
                </v-col>
                <v-col class="text-center">
                  <div v-if="!isLastQuestion">
                    <v-btn
                      elevation="5"
                      class="white--text"
                      style="font-size: 1.1em;"
                      color="transparent"
                      @click="nextQuestion()"
                    >
                      Câu tiếp theo
                    </v-btn>
                  </div>
                  <!-- <div v-else>
                    <v-btn
                      elevation="5"
                      class="white--text"
                      style="font-size: 1.1em;"
                      :disabled="isExistsQuestionsUnresolve || isFinished"
                      color="transparent"
                      @click="FinishedTest()"
                    >
                      Nộp bài
                    </v-btn>
                  </div> -->
                </v-col>
              </v-row>
              <v-row v-if="onErrorWhenFinish">
                <v-col>
                  <div class="text-center title">
                    Vui lòng không tắt trình duyệt bài làm đang được lưu lại...
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters="">
        <v-col>
          <v-container pa-0>
            <v-row style="user-select: none;" justify="center">
              <v-col cols="12" sm="10" md="8" class="pa-0">
                <v-card v-if="!isFinished" class="mt-3" flat>
                  <v-card-text style="color:black">
                    <v-row v-if="isLoading" class="text-center">
                      <v-col>
                        <v-progress-circular indeterminate color="primary" />
                      </v-col>
                    </v-row>
                    <v-row
                      v-if="!isLoading && Object.keys(currentQuestion).length"
                    >
                      <v-col>
                        <p style="text-align: justify;" class="headline">
                          {{ currentQuestion.STT + ". " }}
                          <!-- eslint-disable -->
                          <span
                            v-html="$sanitize(currentQuestion.QuestionContent)"
                          ></span>
                        </p>
                        <v-radio-group v-model="modelRadio">
                          <v-radio
                            v-for="(answer,
                            answerKey) in currentQuestion.answers"
                            :key="answerKey"
                            :disabled="isLastQuestion"
                            class="py-2"
                            :label="
                              `${answer.alphabet}. ${answer.AnswerContent}`
                            "
                            :value="answer.AnswerNumber"
                            @change="selectAnswer(answer)"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                    <v-row style="user-select: none;" justify="center">
                      <v-col cols="12">
                        <div class="text-center">
                          <strong class="title">{{ endTime }}</strong>
                        </div>
                      </v-col>
                    </v-row>
                    <v-row
                      v-if="!isLastQuestion"
                      class="justify-center text-center"
                    >
                      <v-col>
                        <v-btn class="warning" @click="back()">
                          Quay lại
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>

                <!-- section finished -->
                <v-card v-if="isFinished && scores" flat>
                  <v-card-text class="text-center">
                    <v-list>
                      <v-list-item-content>
                        <v-list-item-title
                          class="headline font-weight-bold text-uppercase"
                        >
                          Bài làm đã kết thúc
                        </v-list-item-title>
                        <v-list-item class="title">
                          Kỳ thi:
                          {{ scores.ExamName }}
                        </v-list-item>
                        <v-list-item class="title">
                          Điểm thi:
                          {{ scores.DiemThi }}
                        </v-list-item>
                        <v-list-item class="title">
                          Số câu đúng:
                          {{ scores.KetQuaSoCauDung }}
                        </v-list-item>
                        <v-list-item class="title">
                          Thời gian làm bài:
                          {{ scores.ThoiGianLamBai }}
                        </v-list-item>
                      </v-list-item-content>
                    </v-list>
                  </v-card-text>
                  <v-card-actions class="justify-center">
                    <v-btn class="primary" @click="finishedExam()">
                      Quay lại
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-col>
    <SnackBar ref="SnackBar" />
  </v-row>
</template>

<script>
import { mapState } from 'vuex';

import API from '~/config/api';
import SnackBar from '~/components/SnackBar.vue';
import { keys } from '~/config/localstorage';
import { myEncode, myDecode } from '~/utils/encryt';
const Base64 = require('js-base64').Base64;
const { saveLocal, getLocal, removeKeyLocal } = require('~/utils/encryt');

function* getByInterval(data) {
  for (const item of data) {
    yield item;
  }
}

export default {
  components: {
    SnackBar
  },

  props: {
    model: {
      type: Object,
      required: true
    },

    finishedExam: {
      type: Function,
      required: true
    },

    hiddenHeader: {
      type: Function,
      required: true
    },

    back: {
      type: Function,
      required: true
    }
  },

  async fetch() {
    this.hiddenHeader();

    try {
      const { userInfo, examInfo } = this.model;
      this.examInfo = examInfo;
      this.userInfo = userInfo;

      const studentId = userInfo.id;
      const studentTestId = examInfo.StudentTestID;
      this.timePerQuestion = examInfo.TimePerQuestion;

      const [questions, answers] = await Promise.all([
        this.fetchQuestion(studentId, studentTestId),
        this.fetchAnswer(studentId, studentTestId)
      ]).then(res => res);

      this.fetchAlert(studentId, studentTestId);

      // decode
      const filterQuestions = this.filterQuestionWithCurrent(questions);
      const questionsAnswers = this.mapAnswersToQuestion(
        filterQuestions,
        answers
      );

      // init time by exam
      if (!getLocal(keys.currentTime)) {
        this.inittimePerQuestion();
      } else {
        this.updatetimePerQuestion();
      }

      // start
      this.questions = questions;
      this.questionGenerator = getByInterval(questionsAnswers);
      const question = this.questionGenerator.next().value;

      this.updateCurrentQuestion(question);
      this.startExam();
      this.startServiceFetch();

      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.finishedExam();
    }
  },

  data() {
    return {
      examInfo: null,
      userInfo: null,
      isLastQuestion: false,
      modelRadio: {},
      questions: [],
      questionsRaw: null,
      questionGenerator: {},
      answers: [],
      currentQuestion: {},
      time: 0,
      timeRemaining: 0,
      timePerQuestion: 0,
      intervalCountDown: null,
      endTime: null,
      intervalFetch: null,
      intervalFinished: null,
      onErrorWhenFinish: false,
      isExistsQuestionsUnresolve: true,
      isLoading: true,
      isFinished: false,
      scores: null
    };
  },

  computed: {
    ...mapState({
      socket: state => state.moduleSocket.socket
    })
  },

  beforeDestroy() {
    clearInterval(this.intervalFetch);
    clearInterval(this.intervalCountDown);
    clearInterval(this.intervalFinished);
  },

  mounted() {
    this.$nextTick(() => {
      // eslint-disable-next-line nuxt/no-globals-in-created
      // this.socket.on('nextQuestionRes', (data) => {
      //   console.log('nextQuestionRes',JSON.parse(myDecode(data)))
      // })

      window.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
          if (!this.isLastQuestion) {
            this.nextQuestion();
          } else {
            this.FinishedTest();
          }
        }
      });

      window.onbeforeunload = (event) => {
        if (!this.isFinished) {
          event.returnValue = 'Something is lost...';
        }
      };
    });
  },

  methods: {
    checkExsitsResolveQuestion() {
      const data = getLocal(keys.questions);
      const index = data.findIndex(item => item.state === 'pendding');

      if (index !== -1) {
        return true;
      }
      return false;
    },

    async fetchAnswerQuestion(callBack = undefined) {
      const localQuestions = getLocal(keys.questions);
      const currentQuestion = localQuestions.find(
        item => item.state === 'pendding'
      );

      try {
        if (currentQuestion) {
          // const currentQuestion = localQuestions[index]

          this.socket.emit(
            'nextQuestion',
            myEncode(JSON.stringify(currentQuestion)),
            ({ data }) => {
              data = JSON.parse(myDecode(data));

              // Bai thi da ket thuc, nhung cau hoi load tu localstorage
              if (data[0]?.ErrCode && data[0]?.ErrCode !== 0) {
                this.isFinished = true;
                this.stopExam();
              }

              // Dong bo cau hoi hien tai vơi server
              if (
                data[0]?.STTCauHoiTiepTheo !== 0 &&
                data[0]?.STTCauHoiTiepTheo - 1 !== currentQuestion?.STT
              ) {
                let question = null;
                do {
                  question = this.questionGenerator.next().value;
                  if (question) {
                    this.updateCurrentQuestion(question);
                  } else {
                    break;
                  }
                } while (question?.STT !== data[0].STTCauHoiTiepTheo);
              }
            }
          );

          // trap code
          await this.$axios(
            API.updateTimeRemain({
              studentTestId: currentQuestion.StudentTestID,
              questionId: currentQuestion.QuestionID,
              timeRemaining: currentQuestion.timeAnswer,
              answer: currentQuestion.answerSelected
            })
          );

          currentQuestion.state = 'resolve';
          saveLocal(keys.questions, localQuestions);
          this.questions = getLocal(keys.questions);
        }

        // Finish phase
        if (
          !this.isExistsQuestionsUnresolve &&
          this.isLastQuestion &&
          !currentQuestion
        ) {
          clearInterval(this.intervalFetch);
          clearInterval(this.intervalCountDown);
          clearInterval(this.intervalFinished);

          const { data } = await this.$axios(
            API.getScores({
              studentId: this.userInfo.id,
              studentTestId: this.examInfo.StudentTestID
            })
          );

          this.isFinished = true;
          this.scores = data[0];
        }
      } catch (error) {
        console.error(error);
        this.finishedExam();
      }
    },

    async fetchAlert(studentId, studentTestId) {
      let alertInfo = getLocal(keys.alertInfo);
      if (alertInfo) {
        this.endTime = alertInfo?.GhiChu || '';
      } else {
        alertInfo = (
          await this.$axios(API.getAlert({ studentId, studentTestId }))
        ).data[0];

        this.endTime = alertInfo?.GhiChu || '';
        saveLocal(keys.alertInfo, alertInfo);
      }

      this.$nextTick(() => {
        const { SnackBar } = this.$refs;
        SnackBar.notify({
          type: 'warning',
          message: alertInfo?.GhiChu || ''
        });
      });
    },

    async fetchQuestion(studentId, studentTestId) {
      const localQuestions = getLocal(keys.questions);
      if (localQuestions) {
        return localQuestions;
      }

      const questions = (
        await this.$axios(API.getQuestions({ studentId, studentTestId }))
      ).data;
      saveLocal(keys.questions, questions);
      return questions;
    },

    async fetchAnswer(studentId, studentTestId) {
      const localAnswers = getLocal(keys.answers);
      if (localAnswers) {
        return localAnswers;
      }

      const answers = (
        await this.$axios(API.getAnswers({ studentId, studentTestId }))
      ).data;
      saveLocal(keys.answers, answers);
      return answers;
    },

    updateCurrentQuestion(currentQuestion) {
      this.currentQuestion = currentQuestion;
      saveLocal(keys.currentQuestion, this.currentQuestion);
    },

    filterQuestionWithCurrent(questions) {
      const curQuestion = getLocal(keys.currentQuestion);

      if (curQuestion) {
        const index = questions.findIndex(
          question => question.STT === curQuestion.STT
        );
        questions = questions.slice(index);
      }

      return questions;
    },

    mapAnswersToQuestion(questions, answers) {
      const result = [];
      const questionsTemp = questions.slice();

      for (const question of questionsTemp) {
        question.answerSelected = 0;
        question.timeAnswer = null;
        question.state = 'init';

        let answersPerQuestion = this.getAnswersByQuestion(
          question.QuestionID,
          answers
        );
        answersPerQuestion = this.sortAnswerByRule(
          question.OrderAnswer,
          answersPerQuestion
        );
        question.QuestionContent =
          (question.isDecode && question.QuestionContent) ||
          Base64.decode(question.QuestionContent);

        question.isDecode = true;
        result.push({ ...question, answers: answersPerQuestion });
      }

      return result;
    },

    inittimePerQuestion() {
      this.time = this.timePerQuestion * 1000 + 1000;
      this.timeRemaining = this.time - 1000;
      saveLocal(keys.currentTime, this.timeRemaining);
    },

    updatetimePerQuestion() {
      this.time = getLocal(keys.currentTime);
      this.timeRemaining = this.time - 1000 <= 0 ? 0 : this.time - 1000;
      saveLocal(keys.currentTime, this.timeRemaining);
    },

    startExam() {
      this.intervalCountDown = setInterval(() => {
        this.timeRemaining -= 1000;
        saveLocal(keys.currentTime, this.timeRemaining);
        if (this.timeRemaining <= 0) {
          this.nextQuestion();
        }
      }, 1000);
    },

    stopExam() {
      clearInterval(this.intervalCountDown);
    },

    getAnswersByQuestion(questionId, answers) {
      return answers.filter((item, index) => {
        if (item.QuestionID === questionId) {
          item.AnswerContent =
            (item.isDecode && item.AnswerContent) ||
            Base64.decode(item.AnswerContent);
          item.isDecode = true;
          return item;
        }
      });
    },

    updateTimeRemain() {
      this.currentQuestion.timeAnswer =
        this.timeRemaining / 1000 <= 0 ? 0 : this.timeRemaining / 1000;
      this.currentQuestion.state = 'pendding';

      const index = this.questions.findIndex(
        question => question.STT === this.currentQuestion.STT
      );

      if (index !== -1) {
        this.questions[index] = {
          ...this.currentQuestion,
          QuestionContent: this.questions[index].QuestionContent
        };

        saveLocal(keys.questions, this.questions);
      }
    },

    sortAnswerByRule(ruleOrder, answers) {
      if (ruleOrder && answers.length) {
        const rules = ruleOrder.split('').map(item => Number(item));
        let i = 0;
        const result = [];

        for (const rule of rules) {
          const answer = answers.find(answer => answer.AnswerNumber === rule);
          answer.alphabet = String.fromCharCode(65 + i);
          result.push(answer);
          i++;
        }
        return result;
      }
      return [];
    },

    selectAnswer(answer) {
      this.currentQuestion.answerSelected = answer.AnswerNumber;
    },

    async fetchFinishTest() {
      try {
        this.onErrorWhenFinish = false;

        await this.$axios(
          API.finishedTest({
            studentTestId: this.examInfo.StudentTestID
          })
        );
        this.stopExam();
        // this.finishedExam()
      } catch (error) {
        this.finishedExam();
      }
    },

    async FinishedTest() {
      const isExists = this.checkExsitsResolveQuestion();
      clearInterval(this.intervalCountDown);

      if (!isExists) {
        this.onErrorWhenFinish = false;
        this.isExistsQuestionsUnresolve = false;
        await this.fetchFinishTest();
      } else {
        this.onErrorWhenFinish = true;
        this.isExistsQuestionsUnresolve = true;

        clearInterval(this.intervalFinished);
        this.intervalFinished = setInterval(() => {
          this.FinishedTest();
        }, 1000);
      }
    },

    nextQuestion() {
      this.updateTimeRemain();
      this.inittimePerQuestion();
      this.stopExam();
      this.startExam();

      const question = this.questionGenerator.next();

      if (question.done) {
        this.isLastQuestion = true;
        this.FinishedTest();
      } else {
        this.modelRadio = undefined;
        this.updateCurrentQuestion(question.value);
      }
    },

    startServiceFetch() {
      this.intervalFetch = setInterval(async () => {
        await this.fetchAnswerQuestion();
      }, 500);
    }
  }
};
</script>

<style lang="scss">
.fixed {
  position: fixed;
  width: 100%;
  top: 0;
  right: 0;
  left: 0;
  z-index: 999;
}

.v-radio {
  align-items: start !important;
  .v-label {
    color: black !important;
    font-size: 1.1rem !important;
    line-height: 1.8 !important;
    text-align: left;
  }
  .v-input--selection-controls__input {
    margin-top: 4px;
  }
}
</style>
