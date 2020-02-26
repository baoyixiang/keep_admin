import { Badge, Button, Card, Col, Divider, Form, Input, Modal, Row } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Pie } from '@/pages/dashboard/monitor/components/Charts';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ recordList, loading }) => ({
  recordList,
  loading: loading.models.rule,
}))
class RecordList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    currentPage: 0,
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'title',
    },
    {
      title: '评论数',
      dataIndex: 'createUserId',
      align: 'center',
    },
    {
      title: '点赞数',
      dataIndex: 'createUserId',
    },
    {
      title: '打卡内容',
      dataIndex: 'tags',
      render(val) {
        return <div>aaa</div>;
      },
    },
    {
      title: '打卡时间',
      dataIndex: 'createTime',
      align: 'center',
      // sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleDeleteModalVisible(record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDetail(record)}>查看详情</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {
      pageNo: this.state.currentPage,
      pageSize: 10,
    };
    dispatch({
      type: 'recordList/fetch',
      payload: params,
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };

    this.setState({
      currentPage: pagination.current, //pagination.current从1开始计数 后端页码从0开始
    });

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'recordList/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const params = {
      pageNo: this.state.currentPage,
      pageSize: 10,
    };
    form.resetFields();
    dispatch({
      type: 'recordList/fetch',
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
    console.log('add:', fields);
    const params = {
      pageNo: this.state.currentPage,
      pageSize: 10,
    };
    dispatch({
      type: 'recordList/add',
      payload: {
        title: fields.title,
        userId: 0,
      },
    }).then(() => {
      dispatch({
        type: 'recordList/fetch',
        payload: params,
      });
    });
    this.handleModalVisible();
  };

  handleDeleteModalVisible = record => {
    Modal.confirm({
      title: '操作',
      content: '确定删除该习惯吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDelete(record),
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    const habitId = record.id;
    console.log('id:', habitId);
    // dispatch({
    //   type: 'hopeList/delete',
    //   payload: { hopeId },
    // }).then(() => {
    //   dispatch({
    //     type: 'hopeList/fetch',
    //     payload: {
    //       pageNo: 0,
    //       pageSize: this.state.pageSize,
    //     },
    //   });
    // });
  };

  renderPie() {
    return (
      <Card
        title={<FormattedMessage id="今日已打卡比例" defaultMessage="今日已打卡比例" />}
        bordered={false}
        className={styles.pieCard}
      >
        <Pie animate={false} percent={28} title="AAA" total="28%" height={200} lineWidth={3} />
      </Card>
    );
  }

  render() {
    const {
      recordList: { listData },
      loading,
    } = this.props;
    console.log('list:', listData);
    const { modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.recordList}>
            <div className={styles.recordListForm}>{this.renderPie()}</div>
            <StandardTable
              loading={loading}
              data={listData}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(RecordList);
