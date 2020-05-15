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

<script src="~/controllers/resetPassword.js"></script>
