import { mapMutations, mapState, mapActions } from 'vuex';
import API from '~/config/api';
import UserInfo from '~/components/UserInfo.vue';
import ExamInfo from '~/components/ExamInfo.vue';
import Competition from '~/components/Competition.vue';
import SnackBar from '~/components/SnackBar.vue';
import UpdateUser from '~/components/UpdateUser.vue';
import History from '~/components/History.vue';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import { keys } from '~/config/localstorage';
const Base64 = require('js-base64').Base64;
const {
  myEncode,
  myDecode,
  saveLocal,
  getLocal,
  removeKeyLocal,
} = require('~/utils/encryt');

export default {
  components: {
    UserInfo,
    ExamInfo,
    Competition,
    SnackBar,
    UpdateUser,
    History,
    Header,
    Footer,
  },

  async asyncData({ $axios, redirect }) {
    const studentId = getLocal(keys.studentId);
    if (!studentId) {
      redirect('/login');
      return;
    }

    const [userInfo, examInfo] = await Promise.all([
      $axios(API.userInfo({ studentId })),
      $axios(API.examInfo({ studentId })),
      $axios(API.getTopScore({ studentId })),
    ]).then(([res1, res2, res3]) => [
      { ...res1.data[0], ...res3.data[0] },
      res2.data,
    ]);

    saveLocal(keys.studentInfo, userInfo);
    saveLocal(keys.examInfo, examInfo);

    return { userInfo, examInfo, studentId };
  },

  data: () => ({
    captcha: null,
    isHiddenHeader: false,
    drawer: false,
    dialogUpdateUser: false,
    dialogHistory: false,
    dialogBack: false,
    isDoingTest: false,
    currentExam: {
      TestStatus: 1,
    },
    snackBar: {
      isShowUp: false,
      message: '',
      type: 'success',
    },
    window: null,
  }),

  watch: {
    async dialogUpdateUser(newVal) {
      if (newVal === false && this.studentId) {
        const studentId = this.studentId;
        this.userInfo = await Promise.all([
          this.$axios(API.userInfo({ studentId })),
          this.$axios(API.getTopScore({ studentId })),
        ]).then(([res1, res2]) => ({ ...res1.data[0], ...res2.data[0] }));

        saveLocal(keys.studentInfo, this.userInfo);
      }
    },
  },

  created() {
    this.drawer = !this.userInfo.SoCMND || !this.userInfo.NgaySinh;
    const currentExam = getLocal(keys.currentExam);

    if (currentExam) {
      this.currentExam = this.examInfo.find(
        (item) => item.StudentTestID === currentExam.StudentTestID
      );
      if (!this.currentExam) {
        this.finished();
      }

      if (this.currentExam.TestStatus === 0) {
        this.isDoingTest = false;
      }

      if (this.currentExam.TestStatus === 1) {
        this.isDoingTest = true;
      }
    }
  },

  mounted() {
    const socket = this.$nuxtSocket({
      name: process.env.NODE_ENV === 'development' ? 'test' : 'home',
      teardown: false,
      transports: ['websocket'],
    });

    this.initSocket({ socket });
  },

  methods: {
    ...mapActions({
      initSocket: 'moduleSocket/initializeSocket',
    }),

    async fetchStudenInfo(studentId) {
      try {
        const userInfo = (await this.$axios(API.userInfo({ studentId })))
          .data[0];
        saveLocal(keys.studentInfo, userInfo);
        return userInfo;
      } catch (error) {
        return getLocal(keys.studentInfo);
      }
    },

    async fetchExamInfo(studentId) {
      try {
        const examInfo = (await this.$axios(API.examInfo({ studentId }))).data;
        saveLocal(keys.examInfo, examInfo);
        return examInfo;
      } catch (error) {
        return getLocal(keys.examInfo);
      }
    },

    startExam(curExamInfo, captcha) {
      this.captcha = captcha;

      if (curExamInfo.TestStatus === 0) {
        this.isDoingTest = true;
        this.currentExam = curExamInfo;
        this.currentExam.TestStatus = 1;
        saveLocal(keys.currentExam, this.currentExam);
      }

      if (curExamInfo.TestStatus === 1) {
        this.isDoingTest = true;
        this.currentExam = curExamInfo;
        saveLocal(keys.currentExam, this.currentExam);
      }
    },

    finished() {
      this.isDoingTest = false;
      this.isHiddenHeader = false;

      removeKeyLocal(keys.currentTime);
      removeKeyLocal(keys.currentExam);
      removeKeyLocal(keys.currentQuestion);
      removeKeyLocal(keys.alertInfo);
      removeKeyLocal(keys.questions);
      removeKeyLocal(keys.answers);
      window.location.reload();
    },

    back() {
      this.dialogBack = true;
    },

    async acceptBack() {
      this.isDoingTest = false;
      this.dialogBack = false;
      this.isHiddenHeader = false;

      this.examInfo = (
        await this.$axios(API.examInfo({ studentId: this.studentId }))
      ).data;
      saveLocal(keys.examInfo, this.examInfo);
      removeKeyLocal(keys.currentExam);
      removeKeyLocal(keys.alertInfo);
    },

    updateUser() {
      this.dialogUpdateUser = true;
    },

    toggleHistory() {
      this.dialogHistory = true;
    },

    closeDrawer() {
      this.drawer = false;
    },

    hiddenHeader() {
      this.isHiddenHeader = true;
    },
  },
};
