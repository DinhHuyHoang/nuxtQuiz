<template>
  <v-row style="overflow-x: hidden;" no-gutters>
    <v-row v-if="!isHiddenHeader" no-gutters>
      <v-col cols="12">
        <Header />
      </v-col>
    </v-row>

    <!--  -->
    <v-col cols="12">
      <v-container>
        <v-row>
          <v-col>
            <div v-if="!isDoingTest">
              <v-row justify="center">
                <v-col cols="12">
                  <v-spacer class="my-5" />
                  <v-sheet class="overflow-hidden">
                    <v-row align="center" justify="center">
                      <v-col cols="12" sm="10" md="8" lg="7">
                        <v-row no-gutters="">
                          <v-col cols="12" class="text-right mb-2">
                            <v-btn
                              color="primary"
                              dark
                              @click.stop="drawer = !drawer"
                            >
                              Thông tin thí sinh
                            </v-btn>
                          </v-col>
                          <v-col cols="12">
                            <ExamInfo :model="examInfo" :do-test="startExam" />
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-navigation-drawer
                      v-model="drawer"
                      width="320"
                      absolute
                      temporary
                      height="100vh"
                    >
                      <UserInfo
                        :model="userInfo"
                        :dialog="{ updateUser, closeDrawer, toggleHistory }"
                      />
                    </v-navigation-drawer>
                  </v-sheet>
                </v-col>
              </v-row>
            </div>

            <div v-else>
              <v-row>
                <v-col>
                  <Competition
                    :model="{ userInfo, examInfo: currentExam, captcha }"
                    :finished-exam="finished"
                    :hidden-header="hiddenHeader"
                    :back="back"
                  />
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>

        <v-dialog
          v-model="dialogUpdateUser"
          hide-overlay
          transition="dialog-bottom-transition"
          fullscreen
        >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialogUpdateUser = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-list>
              <v-list-item>
                <UpdateUser :model="userInfo" />
              </v-list-item>
            </v-list>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="dialogHistory"
          hide-overlay
          transition="dialog-bottom-transition"
          fullscreen
        >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialogHistory = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-list>
              <v-list-item>
                <History />
              </v-list-item>
            </v-list>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogBack" max-width="500">
          <v-card>
            <v-card-title class="title">
              Bạn chắc chắn muốn thoát?
            </v-card-title>

            <v-card-text>
              Trong lúc làm bài, khi bấm quay có thể gây ra lỗi lưu bài
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn color="green darken-1" text @click="dialogBack = false">
                Hủy bỏ
              </v-btn>
              <v-btn color="red darken-1" text @click="acceptBack()">
                Chấp nhận
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <SnackBar ref="SnackBar" />
      </v-container>
    </v-col>
    <!--  -->
    <v-row class="align-end" no-gutters>
      <v-col>
        <Footer />
      </v-col>
    </v-row>
  </v-row>
</template>

<script src="~/controllers/index.js"></script>
