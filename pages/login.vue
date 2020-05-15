<template>
  <v-container
    id="login"
    fluid
    class="fill-height align-start justify-center pa-0"
    style="overflow-x: hidden;"
  >
    <v-row no-gutters>
      <v-col>
        <Header />
      </v-col>
    </v-row>
    <v-row
      justify="center"
      align-content="center"
      align-content-md="center"
      @keyup.enter="confirmLogin()"
    >
      <v-col cols="12">
        <v-row justify="center" class="align-center">
          <v-col cols="12" md="6">
            <v-form ref="form">
              <v-card flat="" color="transparent">
                <v-card-title>
                  <div v-if="!haveNotAccount" class="headline">
                    Đăng nhập
                  </div>
                  <div v-if="haveNotAccount" class="headline">
                    Tạo tài khoản
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="phone"
                        color="black"
                        label="Nhập số điện thoại*"
                        :rules="[rules.required, rules.phoneNumber]"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="maDuThi"
                        color="black"
                        label="Nhập mật khẩu*"
                        :rules="[rules.required]"
                        :type="show1 ? 'text' : 'password'"
                        :append-icon="show1 ? 'visibility' : 'visibility_off'"
                        @click:append="show1 = !show1"
                      />
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col>
                      <v-checkbox
                        v-model="haveNotAccount"
                        color="black"
                        label="Bạn chưa có tài khoản?"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="text-center">
                      <v-btn
                        elevation="6"
                        color="primary"
                        height="40"
                        width="150"
                        @click.native="confirmLogin()"
                      >
                        <span v-if="!haveNotAccount">Đăng nhập</span>
                        <span v-if="haveNotAccount">Tạo tài khoản</span>
                      </v-btn>
                      <div
                        style="cursor: pointer;"
                        class="mt-3"
                        @click="$router.push('/reset-password')"
                      >
                        Quên tài khoản
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-form>
          </v-col>
        </v-row>
        <v-row justify="center" class="align-center">
          <v-col cols="12">
            <Alert :model="alert" />
          </v-col>
        </v-row>
      </v-col>
      <SnackBar ref="SnackBar" />
    </v-row>
  </v-container>
</template>

<script>
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
</script>

<style>
/* #login {
  background-image: url('/polygon.png');
  background-repeat: repeat;
} */
</style>
