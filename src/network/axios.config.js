import axios from 'axios';
import NProgress from 'nprogress';

// 创建axios实例，最多12秒的请求时延
const http = axios.create({
  timeout: 1000 * 12,
});

/**
 * 请求拦截器
 */
http.interceptors.request.use(
  (config) => {
    // 请求开始时，启动加载条
    NProgress.start();
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

/**
 * 响应拦截器
 */
http.interceptors.response.use(
  (config) => {
    // 请求响应时，关闭进度条
    NProgress.done();
    if (config.status === 200) {
      const { data } = config;
      const { code } = data;
      if (code === 20000) {
        return Promise.resolve(data.result);
      }
    }
    return Promise.reject(config.data);
  },
  (error) => {
    // 请求响应时，关闭进度条
    NProgress.done();
    const { response } = error;

    if (response) {
      // 请求已发出，但是不在2xx的范围
      return Promise.reject(response);
    }
    return Promise.reject(error);
  },
);

export default http;
