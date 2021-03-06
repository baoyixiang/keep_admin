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
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}

export async function queryCheckinList(params) {
  return api.post(`api/checkin/checkInList`, params);
}

export async function deleteCheckin(params) {
  return api.delete(`/api/checkin/deleteCheckIn/${params}`);
}
