import request from '@/utils/request';
import api from '../../../utils/axios';

// export async function queryRule(params) {
//   return request('/api/rule', {
//     params,
//   });
// }

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
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
export async function queryRule1(params) {
  return api.post('/api/admin/user/list', params);
}
export async function queryUsersList(params) {
  return api.post('/backApi/hope/listUsers', params);
}