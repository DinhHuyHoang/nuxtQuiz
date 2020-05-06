<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Cập nhật thông tin tài khoản</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-form ref="formSignIn">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="fullName"
                label="Họ và tên"
                :rules="[rules.required]"
                :persistent-hint="true"
                hint="Họ tên thí sinh trùng với CMND (nếu có)"
              />
              <v-text-field
                v-model="phoneNumber"
                label="Số điện thoại"
                :rules="[rules.required]"
                :disabled="!!model.DienThoai"
                :persistent-hint="true"
                hint="Thông tin điện thoại KHÔNG THAY ĐỔI sau khi đăng ký thành công"
              />
              <v-text-field
                v-model="identityCard"
                label="Số CMND"
                :rules="[rules.required]"
                :persistent-hint="true"
                hint="Số CMND của thí sinh"
              />
              <v-row no-gutters>
                <v-col
                  class="mr-2"
                >
                  <v-select
                    v-model="day"
                    label="Ngày sinh"
                    :rules="[rules.required]"
                    :items="dayOfMonth"
                  />
                </v-col>
                <v-col
                  class="mr-2"
                >
                  <v-select
                    v-model="month"
                    label="Tháng sinh"
                    :rules="[rules.required]"
                    :items="monthOfYear"
                  />
                </v-col>
                <v-col>
                  <v-select
                    v-model="year"
                    :rules="[rules.required]"
                    label="Năm sinh"
                    :items="years"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <!-- Đối tượng dự thi -->
              <v-combobox
                v-model="organizationLv1"
                :items="organizationsLv1"
                :rules="[organizationsLv1.length ? rules.required : () => true]"
                label="Khối dự thi"
                item-text="TenKhoi"
                item-value="KhoiID"
                :persistent-hint="true"
                hint="Chọn trong danh mục có sẵn"
                @change="changeOrganization"
              />
              <v-combobox
                v-if="organizationsLv2.length"
                v-model="organizationLv2"
                :items="organizationsLv2"
                :rules="[organizationsLv2.length ? rules.required : () => true]"
                label="Cấp dự thi"
                item-text="TenCap"
                item-value="CapID"
                :persistent-hint="true"
                hint="Chọn trong danh mục có sẵn"
                @change="changeOrganization"
              />
              <v-combobox
                v-if="organizationsLv3.length"
                v-model="organizationLv3"
                :items="organizationsLv3"
                :rules="[organizationsLv3.length ? rules.required : () => true]"
                label="Đơn vị dự thi"
                item-text="TenDonVi"
                item-value="DonViID"
                :persistent-hint="true"
                hint="Chọn trong danh mục có sẵn"
                @change="changeOrganization"
              />
              <v-combobox
                v-if="organizationsLv4.length"
                v-model="organizationLv4"
                :items="organizationsLv4"
                :rules="[organizationsLv4.length ? rules.required : () => true]"
                label="Cơ quan dự thi"
                item-text="TenCoQuan"
                item-value="CoQuanID"
                :persistent-hint="true"
                hint="Chọn trong danh mục có sẵn"
                @change="changeOrganization"
              />
              <v-combobox
                v-if="organizationsLv5.length"
                v-model="organizationLv5"
                :items="organizationsLv5"
                :rules="[organizationsLv5.length ? rules.required : () => true]"
                label="Xã dự thi"
                item-text="TenXa"
                item-value="XaID"
                :persistent-hint="true"
                hint="Chọn trong danh mục có sẵn"
                @change="changeOrganization"
              />
              <!-- Đối tượng dự thi -->
              <v-text-field
                v-if="organizationLv1 && organizationLv1.KhoiID === 4"
                v-model="studentNote"
                label="Địa chỉ"
                :rules="[rules.required]"
                :persistent-hint="true"
                hint="Ghi rõ đia chỉ cư trú tên đường, phường/xã, quận huyện, thành phố..."
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn color="primary" @click="submit">
                Cập nhật
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <v-row class="mt-5">
      <v-col>
        <h2>Đổi mật khẩu</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-form ref="formPassword">
          <v-text-field
            v-model="oldPassword"
            label="Mật khẩu cũ"
            :rules="[rules.required]"
            :type="show1 ? 'text' : 'password'"
            :append-icon="show1 ? 'visibility' : 'visibility_off'"
            @click:append="show1 = !show1"
          />
          <v-text-field
            v-model="password"
            label="Mật khẩu"
            :rules="[rules.required]"
            :type="show2 ? 'text' : 'password'"
            :append-icon="show2 ? 'visibility' : 'visibility_off'"
            @click:append="show2 = !show2"
          />
          <v-text-field
            v-model="rePassword"
            label="Xác nhận mật khẩu"
            :rules="[rules.required, passwordConfirmationRule]"
            :type="show3 ? 'text' : 'password'"
            :append-icon="show3 ? 'visibility' : 'visibility_off'"
            @click:append="show3 = !show3"
          />
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn color="primary" @click="changePassword">
                Cập nhật mật khẩu
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <SnackBar ref="SnackBar" />
  </v-container>
</template>

<script>
import API from '~/config/api';
import SnackBar from '~/components/SnackBar.vue';
import { keys } from '~/config/localstorage';
const { saveLocal } = require('~/utils/encryt');

const TODAY = new Date();

export default {
  components: {
    SnackBar
  },

  props: {
    model: {
      type: Object,
      required: true
    }
  },

  async fetch() {
    this.initYears();
    const { data } = await this.$axios(API.getOrganizations({ level: 1 }));
    this.organizationsLv1 = data;
    this.mapData(this.model);
  },

  data: () => ({
    rules: {
      required: v => !!v || 'Không được bỏ trống',
      email: v => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ'
    },
    day: null,
    month: null,
    year: null,
    monthOfYear: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    years: [],
    minYear: TODAY.getFullYear() - 120,
    oldPassword: '',
    password: '',
    rePassword: '',
    show1: false,
    show2: false,
    show3: false,
    fullName: '',
    email: '',
    phoneNumber: '',
    identityCard: '',
    organizationLv1: null,
    organizationsLv1: [],
    organizationLv2: null,
    organizationsLv2: [],
    organizationLv3: null,
    organizationsLv3: [],
    organizationLv4: null,
    organizationsLv4: [],
    organizationLv5: null,
    organizationsLv5: [],
    userInfo: '',
    studentNote: '',
    shouldReload: false,
    isComboboxChange: false
  }),

  computed: {
    dayOfMonth() {
      const day31 = [1, 3, 5, 7, 8, 10, 12];
      const day30 = [4, 6, 9, 11];

      if (day31.includes(this.month)) { return Array.from(Array(31).keys(), x => x + 1); };
      if (day30.includes(this.month)) { return Array.from(Array(30).keys(), x => x + 1); };

      if (this.month === 2) {
        if (this.year % 4 === 0) {
          return Array.from(Array(29).keys(), x => x + 1);
        }

        return Array.from(Array(28).keys(), x => x + 1);
      }

      return Array.from(Array(31).keys(), x => x + 1);
    },

    passwordConfirmationRule() {
      return this.password === this.rePassword || 'Mật khẩu không trùng khớp';
    }
  },

  watch: {
    async organizationLv1(newVal) {
      if (!newVal) { return; }
      const { data } = await this.$axios(
        API.getOrganizations({ level: 2, selectedId: newVal?.KhoiID })
      );
      this.organizationLv2 = !this.isComboboxChange
        ? data.find(el => el.CapID === this.userInfo.ValueCap02)
        : null;
      this.organizationsLv2 = data;
    },

    async organizationLv2(newVal) {
      if (!newVal) { return; }

      const { data } = await this.$axios(
        API.getOrganizations({ level: 3, selectedId: newVal?.CapID })
      );
      this.organizationLv3 = !this.isComboboxChange
        ? data.find(el => el.DonViID === this.userInfo.ValueCap03)
        : null;
      this.organizationsLv3 = data;
    },

    async organizationLv3(newVal) {
      if (!newVal) { return; }

      const { data } = await this.$axios(
        API.getOrganizations({ level: 4, selectedId: newVal?.DonViID })
      );
      this.organizationLv4 = !this.isComboboxChange
        ? data.find(el => el.CoQuanID === this.userInfo.ValueCap04)
        : null;
      this.organizationsLv4 = data;
    },

    async organizationLv4(newVal) {
      if (!newVal) { return; }

      const { data } = await this.$axios(
        API.getOrganizations({ level: 5, selectedId: newVal?.CoQuanID })
      );
      this.organizationLv5 = !this.isComboboxChange
        ? data.find(el => el.XaID === this.userInfo.ValueCap05)
        : null;
      this.organizationsLv5 = data;
    }
  },

  methods: {
    initYears() {
      const currentYear = new Date().getFullYear();
      for (let year = currentYear; year >= this.minYear; year--) {
        this.years.push(year);
      }
    },

    mapData(userInfo) {
      this.userInfo = userInfo;
      this.day = Number(userInfo.NgaySinh.substring(0, 2));
      this.month = Number(userInfo.NgaySinh.substring(2, 4));
      this.year = Number(userInfo.NgaySinh.substring(4, 8));
      this.fullName = userInfo.HoTenSV;
      this.email = userInfo.email;
      this.phoneNumber = userInfo.DienThoai;
      this.identityCard = userInfo.SoCMND;
      this.studentNote = userInfo.StudentNote;
      this.organizationLv1 = this.organizationsLv1.find(
        el => el.KhoiID === userInfo.ValueCap01
      );
    },

    formatNumber(number) {
      return number.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
    },

    changeOrganization() {
      if (!this.isComboboxChange) { this.isComboboxChange = true; };
    },

    async submit() {
      const isValid = this.$refs.formSignIn.validate();
      const { SnackBar } = this.$refs;

      if (isValid) {
        const user = {
          StudentIDEnCrypt: this.userInfo.id,
          NgaySinh: `${this.formatNumber(this.day)}${this.formatNumber(
            this.month
          )}${this.formatNumber(this.year)}`,
          HoTenSV: this.fullName,
          Email: this.email,
          DienThoai: this.phoneNumber,
          SoCMND: this.identityCard,
          DoiTuongID: this.organization?.DoiTuongID,
          Cap01: this.organizationLv1?.KhoiID,
          Cap02: this.organizationLv2?.CapID,
          Cap03: this.organizationLv3?.DonViID,
          Cap04: this.organizationLv4?.CoQuanID,
          Cap05: this.organizationLv5?.XaID,
          StudentNote: this.studentNote
        };

        const { data } = await this.$axios(API.createOrUpdateUserInfo({ user }));
        if (!data[0]?.ErrCode) {
          const userInfo = (
            await this.$axios(API.userInfo({ studentId: this.userInfo.id }))
          ).data[0];
          this.userInfo = userInfo;
          saveLocal(keys.studentInfo, userInfo);
          SnackBar.notify({ type: 'success', message: data[0].ErrMsg });
        } else {
          SnackBar.notify({ type: 'error', message: data[0].ErrMsg });
        }
      }
    },

    async changePassword() {
      const { SnackBar } = this.$refs;

      if (this.$refs.formPassword.validate()) {
        const password = {
          id: this.userInfo.id,
          OldPass: this.oldPassword,
          NewPass: this.password
        };

        const { data } = await this.$axios(API.changePassword({ password }));
        if (!data[0]?.ErrCode) {
          SnackBar.notify({ type: 'success', message: data[0].ErrMsg });
          this.$refs.formPassword.reset();
        } else {
          SnackBar.notify({ type: 'error', message: data[0].ErrMsg });
        }
      }
    }
  }
};
</script>
<style scoped>
.v-input {
  margin-bottom: 24px;
}
</style>
