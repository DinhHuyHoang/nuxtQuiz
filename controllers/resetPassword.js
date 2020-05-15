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
