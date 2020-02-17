import axios from 'axios';
import { message } from 'antd';
import { isNil, get } from 'lodash';
import CustomConfig from '../env';
import { getToken, hasToken, setToken } from './authority';

axios.defaults.timeout = 15000;

const isAbsolutePath = url => /^(http|https|http:|https:|\/\/)/.test(url);

const { BASE_URL } = CustomConfig;

function fixConfigs(config) {
  const fixConfig = { ...config };
  if (config.baseURL || isAbsolutePath(config.url)) {
    return fixConfig;
  }
  if (hasToken()) {
    fixConfig.headers = {
      ...fixConfig.headers,
      authorization: getToken(),
      'Access-Control-Allow-origin': '*',
    };
  }

  return {
    ...fixConfig,
    baseURL: BASE_URL,
  };
}

function setRequestConfig(config) {
  return Promise.resolve(fixConfigs(config));
}

const handleError = err => {
  console.log('handleError', err);
  if (err.response && err.response.status === 401) {
    message.error('登录过期，请重新登录');
    setToken(null);
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
  }
  if (err.toString() === 'Error: Network Error') {
    setToken(null);
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
  }
  // console.log("handleError", err.response)
  const { response } = err;
  if (!isNil(response)) {
    response.error = true;
  }
  return Promise.resolve(response);
};

axios.interceptors.request.use(config => setRequestConfig(config), error => Promise.reject(error));

axios.interceptors.response.use(response => response.data, error => handleError(error));

export const isResponseSuccess = response => {
  if (isNil(response) || get(response, 'error', false)) {
    return false;
  }
  return true;
};

export const getFailedMessage = response => get(response, ['data', 'message'], '');

export const picUploadUrl = `${BASE_URL}/api/admin/file/uploadImage`;
export const VideoUploadUrl = `${BASE_URL}/api/admin/file/upload_video`;
export const FileUploadUrl = `${BASE_URL}/api/admin/file/upload_file`;

export default axios;
