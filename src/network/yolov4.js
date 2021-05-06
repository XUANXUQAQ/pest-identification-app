import http from '@/network/axios.config';
import baseURLs from '@/network/baseURLs';

const baseURL = baseURLs.yoloURL;

const yolov4Api = {
  uploadImg(params) {
    return http.post(`${baseURL}/uploadPhoto`, params);
  },
  startPredict() {
    return http.post(`${baseURL}/startPredict`);
  },
};

export default yolov4Api;
