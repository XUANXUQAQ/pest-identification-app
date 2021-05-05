import http from '@/network/axios.config';
import baseURLs from '@/network/baseURLs';
import networkUtils from '@/utils/networkUtils';

const baseURL = baseURLs.yoloURL;

const yolov4Api = {
  uploadImg(file) {
    const data = networkUtils.args.form({ file });
    return http.post(`${baseURL}/uploadPhoto`, {
      data,
    });
  },
  startPredict() {
    return http.post(`${baseURL}/startPredict`);
  },
};

export default yolov4Api;
