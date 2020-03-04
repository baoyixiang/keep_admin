import { addRule, queryUsersList, recommendUser, updateRule } from './service';
import { isResponseSuccess } from '@/utils/axios';
import { message } from 'antd';

const Model = {
  namespace: 'usersList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUsersList, payload);
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

    *recommend({ payload, callback }, { call, put }) {
      const response = yield call(recommendUser, payload);
      if (isResponseSuccess(response)) {
        message.success('设置成功');
        yield put({
          type: 'save',
          payload: response,
        });
      } else {
        message.error(`设置失败:${response.data.message}`);
      }
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
        list: payload,
        pagination: {
          total: payload.total,
          pageSize: 10,
          current: payload.pageNum,
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
