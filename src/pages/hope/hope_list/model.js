import { queryHopeList, deleteHope } from './service';

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
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteHope, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
  reducers: {
    queryList(state, action) {
      console.log('payload:', action.payload);
      return { ...state, list: action.payload };
    },
    save(state, action) {
      return { ...state, data: action.payload };
    },
  },
};
export default Model;
