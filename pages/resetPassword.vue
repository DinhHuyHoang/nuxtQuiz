<template>
  <v-container
    fluid
    class="pa-0"
    style="overflow-x: hidden;"
  >
    <v-row no-gutters>
      <v-col>
        <Header />
      </v-col>
    </v-row>
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
      <v-col cols="12" class="text-center">
        <v-btn class="mx-1 success" @click="$router.push('/login')">
          Đăng nhập
        </v-btn>
        <v-btn class="mx-1 primary">
          Khôi phục
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Header from '~/components/Header';

export default {
  components: {
    Header
  },

  data: () => ({
    phone: null,
    rules: {
      required: value => !!value || 'Không được bỏ trống trường này',
      phoneNumber: (value) => {
        const pattern = /\D/;
        return (
          (!pattern.test(value) && value.length <= 20) ||
          'Số điện thoại không hợp lệ'
        );
      }
    }
  })
};
</script>
