import request from '@/utils/request';
import api from '../../../utils/axios';

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}

export async function queryUsersList(params) {
  return api.get('/backApi/hope/listUsers', params);
}

export async function recommendUser(params) {
  return api.post('/backApi/user/recommend', params);
}
