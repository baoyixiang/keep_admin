import { Badge, Button, Card, Col, Divider, Form, Input, Modal, Row } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Pie } from '@/pages/dashboard/monitor/components/Charts';

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
    title: '',
  };

  columns = [
    {
      title: '编号',
      dataIndex: 'checkInId',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '评论数',
      dataIndex: 'commentCount',
      align: 'center',
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
    },
    {
      title: '打卡内容',
      dataIndex: 'wordContent',
      align: 'center',
      render: val => <span>{val === null ? '——无——' : val}</span>,
    },
    {
      title: '打卡时间',
      dataIndex: 'checkInTime',
      align: 'center',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) =>
        record.wordContent === null ? (
          <div>无法操作</div>
        ) : (
          <Fragment>
            <a onClick={() => this.handleDeleteModalVisible(record)}>删除</a>
          </Fragment>
        ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    this.setState({
      title: this.props.location.state.title,
    });
    const params = {
      customId: this.props.location.state.id,
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
    const checkInId = record.checkInId;
    console.log('id:', checkInId);
    const params = {
      customId: this.props.location.state.id,
      pageNo: this.state.currentPage,
      pageSize: 10,
    };
    dispatch({
      type: 'recordList/delete',
      payload: checkInId,
    }).then(() => {
      dispatch({
        type: 'recordList/fetch',
        payload: params,
      });
    });
  };

  renderPie(joinCount, checkInToday) {
    const percent = joinCount === 0 ? 0 : (checkInToday / joinCount) * 100;
    return (
      <Card
        title={
          <FormattedMessage
            id="今日已打卡比例"
            defaultMessage={'习惯 ' + this.state.title + ' 今日已打卡比例'}
          />
        }
        bordered={false}
        className={styles.pieCard}
      >
        <Pie
          animate={false}
          percent={percent.toFixed(2)}
          title="今日已打卡比例"
          total={percent.toFixed(2) + '%'}
          height={200}
          lineWidth={3}
        />
        <div>{'今日打卡人数：' + checkInToday}</div>
        <div style={{ marginTop: 10 }}>{'加入习惯总人数：' + joinCount}</div>
      </Card>
    );
  }

  render() {
    const {
      recordList: { listData },
      loading,
    } = this.props;
    const joinCount = listData?.joinCount ?? 0;
    const checkInToday = listData?.checkInToday ?? 0;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.recordList}>
            <div className={styles.recordListForm}>{this.renderPie(joinCount, checkInToday)}</div>
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
