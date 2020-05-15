<template>
  <div v-if="Object.keys(model).length">
    <v-list-item>
      <v-list-item-avatar>
        <v-icon>person</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="title font-weight-bold">
          {{ model.HoTenSV }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider />

    <v-list subheader dense>
      <v-list-item
        v-for="item in [
          { key: 'DienThoai', text: 'Điện thoại' },
          { key: 'NgaySinh', text: 'Ngày sinh' },
          { key: 'SoCMND', text: 'CMND' },
        ]"
        :key="item.key"
        link
      >
        <v-list-item-content class="pa-0">
          <v-list-item-subtitle style="line-height: unset;" class="title">
            {{ item.text }}: {{ model[item.key] }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list subheader dense>
      <v-list-item class="title font-weight-bold text-uppercase">
        Lần thi điểm cao nhất
      </v-list-item>
      <v-list-item
        v-for="item in [
          { key: 'NgayThi', text: 'Lúc' },
          { key: 'SoCauDung', text: 'Số câu đúng' },
          { key: 'DiemThi', text: 'Điểm thi' },
          { key: 'ThoiGianLamBai', text: 'Thời gian (giây)' },
        ]"
        :key="item.key"
        link
      >
        <v-list-item-content class="pa-0">
          <v-list-item-subtitle style="line-height: unset;" class="title">
            {{ item.text }}: {{ model[item.key] }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-list subheader dense>
      <v-list-item class="my-2">
        <v-btn color="success" width="100%" @click="dialog.updateUser()">
          Cập nhật thông tin
        </v-btn>
      </v-list-item>
      <v-list-item class="my-2">
        <v-btn color="warning" width="100%" @click="dialog.toggleHistory()">
          Xem lịch sử
        </v-btn>
      </v-list-item>
      <v-list-item class="my-2">
        <v-btn color="primary" width="100%" @click="logout()">
          Đăng xuất
        </v-btn>
      </v-list-item>
      <v-list-item class="my-2">
        <v-btn width="100%" @click="dialog.closeDrawer()">
          Đóng menu
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { clearLocal } from '~/utils/encryt';

export default {
  props: {
    model: {
      type: Object,
      required: true,
    },

    dialog: {
      type: Object,
      required: true,
    },
  },

  methods: {
    logout() {
      clearLocal();
      window.location.reload();
    },
  },
};
</script>
