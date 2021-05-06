import baseURLs from '@/network/baseURLs';
import http from '@/network/axios.config';

const baseURL = baseURLs.databaseURL;

const databaseApi = {
  selectSpeciesByCode(code) {
    const url = `${baseURL}/species/${code}`;
    return http.get(url);
  },
};

export default databaseApi;
