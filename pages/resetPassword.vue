<template>
  <v-container fluid class="pa-0" style="overflow-x: hidden;">
    <v-row no-gutters>
      <v-col>
        <Header />
      </v-col>
    </v-row>
    <v-form ref="form">
      <v-row class="pa-3">
        <v-col cols="12">
          <div class="headline font-weight-bold">
            Khôi phục tài khoản
          </div>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="phone"
            label="Nhập số điện thoại*"
            :rules="[rules.required, rules.phoneNumber]"
          />
        </v-col>
        <v-col v-if="newPassword" cols="12">
          <div class="text-center title font-weight-bold">
            Mật khẩu mới: {{ newPassword }}
          </div>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn class="mx-1 success" @click="$router.push('/login')">
            Đăng nhập
          </v-btn>
          <v-btn class="mx-1 primary" @click="resetPassword()">
            Khôi phục
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <SnackBar ref="SnackBar" />
  </v-container>
</template>

<script>
import Header from '~/components/Header';
import SnackBar from '~/components/SnackBar.vue';
import API from '~/config/api';

export default {
  components: {
    Header,
    SnackBar,
  },

  data: () => ({
    phone: null,
    newPassword: null,
    rules: {
      required: (value) => !!value || 'Không được bỏ trống trường này',
      phoneNumber: (value) => {
        const pattern = /\D/;
        return (
          (!pattern.test(value) && value.length <= 20) ||
          'Số điện thoại không hợp lệ'
        );
      },
    },
  }),

  methods: {
    async resetPassword() {
      const { SnackBar, form } = this.$refs;
      if (!form.validate()) {
        return;
      }

      const phone = {
        DienThoai: this.phone,
      };
      const { data } = await this.$axios(API.resetPassword({ phone }));

      if (data[0]?.ErrCode) {
        SnackBar.notify({ type: 'error', message: data[0].ErrMsg });
      } else if (data[0]?.ErrCode === 0) {
        this.newPassword = data[0]?.MatKhauMoi;
        form.reset();
        SnackBar.notify({ type: 'success', message: data[0].ErrMsg });
      }
    },
  },
};
</script>
