import api from '@/utils/axios';

export async function queryHopeList(params) {
  return api.post('/backApi/hope/allHopesList', params);
}

export async function deleteHope(params) {
  return api.post('/backApi/hope/delHope', params);
}
