import { addHabit, deleteHabit, queryHabitList } from './service';
import { message } from 'antd';
import { isResponseSuccess } from '@/utils/axios';

const Model = {
  namespace: 'habitList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
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

    *delete({ payload }, { call, put }) {
      const response = yield call(deleteHabit, payload);
      if (isResponseSuccess(response)) {
        message.success('删除成功');
        yield put({
          type: 'save',
          payload: response,
        });
      } else {
        message.error(`删除失败:${response.data.message}`);
      }
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
