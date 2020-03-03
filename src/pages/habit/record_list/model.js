import { deleteCheckin, updateRule, queryCheckinList } from './service';
import { message } from 'antd';
import { isResponseSuccess } from '@/utils/axios';

const Model = {
  namespace: 'recordList',
  state: {
    data: {
      list: [],
      checkInToday: 0,
      joinCount: 0,
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryCheckinList, payload);
      yield put({
        type: 'list',
        payload: response,
      });
    },

    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteCheckin, payload);
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
        list: payload.checkInOutVOS,
        joinCount: payload.joinCount,
        checkInToday: payload.checkInToday,
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
