import api from '../../../utils/axios';

export async function queryHabitList(params) {
  return api.post('/backApi/custom/list', params);
}

export async function addHabit(params) {
  return api.post('/backApi/custom/add', params);
}

export async function deleteHabit(params) {
  console.log('params', params);
  return api.delete(`/backApi/custom/delete/${params}`);
}
