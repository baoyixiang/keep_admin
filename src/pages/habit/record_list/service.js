import request from '@/utils/request';
import api from '../../../utils/axios';

export async function queryRule(params) {
  return request('/api/rule', {
    params,
  });
}
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

export async function queryCheckinList(params) {
  console.log(params);
  console.log('id:', params.customId);
  return api.get(`api/checkin/checkInList/${params.customId}`, params);
}
