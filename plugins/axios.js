function checkNativeInterval() {
  return /\{\s+\[native code\]/.test(setInterval.toString());
}

export default function ({ $axios, redirect, store, ...data }) {
  $axios.onRequest((config) => {
    // console.log('Making request to ' + config.url)
    if (!checkNativeInterval()) {
      alert('Bạn đang phá hệ thống');
      window.location.reload();
    }
  });

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status);
    if (code === 400) {
      redirect('/400');
    }

    if (code === 500) {
      throw new Error(error.response.data.Message);
    }
  });

  $axios.onResponse((response) => {
    return response.data;
  });
}
