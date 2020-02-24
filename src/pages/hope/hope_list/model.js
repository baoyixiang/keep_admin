import { queryHopeList } from './service';

const Model = {
  namespace: 'hopeList',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryHopeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },
  reducers: {
    queryList(state, action) {
      console.log('payload:', action.payload);
      return { ...state, list: action.payload };
    },
  },
};
export default Model;
