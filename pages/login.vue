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

<script src="~/controllers/login.js"></script>
