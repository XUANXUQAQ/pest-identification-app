import http from '@/network/axios.config';
import baseURLs from '@/network/baseURLs';

let baseURL = baseURLs.yoloURL;

const yolov4Api = {
  uploadImg(params) {
    if (navigator.onLine) {
      baseURL = baseURLs.yoloURL;
    } else {
      baseURL = baseURLs.yoloLocalURL;
    }
    return http.post(`${baseURL}/uploadPhoto`, params);
  },
  startPredict() {
    if (navigator.onLine) {
      baseURL = baseURLs.yoloURL;
    } else {
      baseURL = baseURLs.yoloLocalURL;
    }
    return http.post(`${baseURL}/startPredict`);
  },
};

export default yolov4Api;
