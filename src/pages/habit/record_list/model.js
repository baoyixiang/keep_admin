import { addHabit, removeRule, updateRule, queryCheckinList } from './service';
import { message } from 'antd';
import { isResponseSuccess } from '@/utils/axios';

const Model = {
  namespace: 'recordList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    habitList: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCheckinList, payload);
      yield put({
        type: 'list',
        payload: response,
      });
    },

    *add({ payload, callback }, { call, put }) {
      const response = yield call(addHabit, payload);
      if (isResponseSuccess(response)) {
        message.success('添加成功');
        yield put({
          type: 'save',
          payload: response,
        });
      } else {
        message.error(`添加失败:${response.data.message}`);
      }
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
