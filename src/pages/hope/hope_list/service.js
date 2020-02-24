import api from '@/utils/axios';

export async function queryHopeList(params) {
  return api.get('/backapi/hope/hopesList', params);
}
