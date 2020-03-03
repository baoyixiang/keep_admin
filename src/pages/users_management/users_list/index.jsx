import { Badge, Button, Card, Col, Form, Input, Row, Select, message, Modal } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ usersList, loading }) => ({
  usersList,
  loading: loading.models.rule,
}))
class UsersList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '用户名',
      align: 'center',
      render: val => `${val.user.name}`,
    },
    {
      title: '加入习惯数',
      dataIndex: 'customesCount',
      align: 'center',
      render: val => `${val === null ? 0 : val} 个`,
    },
    {
      title: '拥有心愿',
      dataIndex: 'hopesCount',
      align: 'center',
      render: val => `${val === null ? 0 : val} 个`,
    },
    {
      title: '关注用户数',
      dataIndex: 'followingCount',
      align: 'center',
    },
    {
      title: '被关注数',
      dataIndex: 'followedCount',
      align: 'center',
    },
    {
      title: '上次登陆时间',
      // dataIndex: 'lastLoginTime',
      align: 'center',
      render: val => <span>{moment(val.user.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      align: 'center',
      render: record => (
        <Fragment>
          <a onClick={() => this.handleRecommendModal(record)}>
            {record.user.recommended ? '取消推荐' : '设置为推荐用户'}
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {
      pageNo: 0,
      pageSize: 10,
    };
    dispatch({
      type: 'usersList/fetch',
      payload: params,
    });
  }

  handleRecommendModal = record => {
    Modal.confirm({
      title: '操作',
      content: record.user.recommended ? '确认取消推荐吗' : '确认将该用户设置为推荐用户吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleRecommend(record),
    });
  };

  handleRecommend = record => {
    const { dispatch } = this.props;
    const userId = record.user.id;
    console.log('id:', userId);

    const params = {
      pageNo: 0,
      pageSize: 10,
    };
    dispatch({
      type: 'usersList/recommend',
      payload: { userId },
    }).then(() => {
      dispatch({
        type: 'usersList/fetch',
        payload: params,
      });
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'userTableList/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userTableList/add',
      payload: {
        desc: fields.desc,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
  };

  render() {
    const {
      usersList: { listData },
      loading,
    } = this.props;
    const { modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              loading={loading}
              data={listData}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(UsersList);
