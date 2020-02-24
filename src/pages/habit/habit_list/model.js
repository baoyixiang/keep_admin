import { addRule, removeRule, updateRule, queryHabitList } from './service';

const Model = {
  namespace: 'habitList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    habitList: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryHabitList, payload);
      yield put({
        type: 'list',
        payload: response,
      });
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    },
    list(state, { payload }) {
      console.log('payload:', payload);
      const listData = {
        list: payload.list,
        pagination: {
          total: payload.total,
          pageSize: 10,
          current: payload.pageNo + 1,
        },
      };
      return {
        ...state,
        listData,
      };
    },
  },
};
export default Model;
