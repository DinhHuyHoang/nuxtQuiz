import { mapState } from 'vuex';
import SnackBar from '~/components/SnackBar.vue';
import Header from '~/components/Header';
import Alert from '~/components/Alert.vue';
import API from '~/config/api';
import { keys } from '~/config/localstorage';
const { saveLocal, getLocal, clearLocal } = require('~/utils/encryt');

export default {
  layout: 'none',

  components: {
    SnackBar,
    Alert,
    Header,
  },
  async asyncData({ redirect, $axios }) {
    const studentId = getLocal(keys.studentId);
    if (studentId) {
      redirect('/');
      return;
    }

    const { data } = await $axios(API.getAlertLogin());
    const message = data[0]?.ThongBao || '';

    return {
      alert: {
        type: 'info',
        message,
        color: 'rgba(53, 131, 218, 0.7)',
      },
    };
  },

  data: () => ({
    socket: null,
    alert: {
      message: '',
      type: 'info',
    },
    show1: false,
    haveNotAccount: false,
    phone: '',
    emailOrPhone: '',
    maDuThi: '',
    rules: {
      required: (value) => !!value || 'Không được bỏ trống trường này',
      email: (value) => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Email không hợp lệ';
      },
      phoneNumber: (value) => {
        const pattern = /\D/;
        return (
          (!pattern.test(value) && value.length <= 20) ||
          'Số điện thoại không hợp lệ'
        );
      },
    },
  }),

  computed: {
    ...mapState(['chatMessages']),
    emailOrPhoneCommit() {
      if (!isNaN(this.emailOrPhone)) {
        return this.rules.phoneNumber(this.emailOrPhone);
      }
      return this.rules.email(this.emailOrPhone);
    },
  },

  // mounted() {
  //   this.socket = this.$nuxtSocket({})
  //   this.socket.emit('setMessage', { id: 'abc123' })
  // },

  methods: {
    async confirmLogin() {
      const { SnackBar, form } = this.$refs;
      if (form.validate()) {
        try {
          const { data } = await this.$axios(
            API[this.haveNotAccount ? 'signUpAndLogin' : 'login']({
              phone: this.phone.trim(),
              maDuThi: this.maDuThi.trim(),
            })
          );

          if (!data[0]?.ErrCode) {
            saveLocal(keys.studentId, data[0]?.id || undefined);
            SnackBar.notify({
              type: 'success',
              message: data[0].ErrMsg,
              timeout: 1000,
              callback: () => {
                this.$router.push('/');
              },
            });
          } else {
            SnackBar.notify({ type: 'error', message: data[0].ErrMsg });
          }
        } catch (error) {
          console.error({ error });
        }
      }
    },
  },
};
