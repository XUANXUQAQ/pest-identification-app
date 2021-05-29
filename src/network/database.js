import baseURLs from '@/network/baseURLs';
import http from '@/network/axios.config';

let baseURL = baseURLs.databaseURL;

const databaseApi = {
  selectSpeciesByCode(code) {
    if (navigator.onLine) {
      baseURL = baseURLs.databaseURL;
    } else {
      baseURL = baseURLs.databaseLocalURL;
    }
    const url = `${baseURL}/species/${code}`;
    return http.get(url);
  },
};

export default databaseApi;
