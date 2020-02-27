import { Badge, Button, Card, Col, Divider, Form, Input, Modal, Row } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import styles from './style.less';
import * as routerRedux from 'react-router-redux';

const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const status = ['无分类', '学习', '运动'];

/* eslint react/no-multi-comp:0 */
@connect(({ habitList, loading }) => ({
  habitList,
  loading: loading.models.rule,
}))
class HabitList extends Component {
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
      title: '习惯名称',
      dataIndex: 'title',
    },
    {
      title: '习惯图片',
      dataIndex: 'logo',
      width: '100px',
      align: 'center',
      render: val => <img src={val ? val.split('|')[0] : null} width="80px" alt={'无'} />,
    },
    {
      title: '加入习惯人数',
      dataIndex: 'createUserId',
      align: 'center',
      render: val => `${val} 万`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '今日打卡人数',
      dataIndex: 'createUserId',
      align: 'center',
      render: val => `${val} 万`,
      needTotal: true,
    },
    {
      title: '分类',
      dataIndex: 'tags',
      render(val) {
        return <div>{status[val[0]]}</div>;
      },
    },
    {
      title: '创建时间',
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
          <a onClick={() => this.handleDetail(record)}>查看打卡记录</a>
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
      type: 'habitList/fetch',
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
      type: 'habitList/fetch',
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
      type: 'habitList/fetch',
      payload: params,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const params = {
        title: fieldsValue.title,
        pageNo: this.state.currentPage,
        pageSize: 10,
      };
      dispatch({
        type: 'habitList/fetch',
        payload: params,
      });
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
      type: 'habitList/add',
      payload: {
        title: fields.title,
        logo:
          'https://lh3.googleusercontent.com/proxy/jB_XAa-oLrBGP-6Kw5BysG_KONxQyJRWYarxlcAoNR3EFmrC4qBMJD5A0IOF9v6EtjXvZUAtNEUtksA4ySthKGxoVwuQMvLHpSK4apOmtlOX5O0OoTlk',
        tags: [fields.tags],
        userId: 0,
      },
    }).then(() => {
      dispatch({
        type: 'habitList/fetch',
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
    const customId = record.id;
    console.log('id:', customId);
    const params = {
      pageNo: this.state.currentPage,
      pageSize: 10,
    };
    dispatch({
      type: 'habitList/delete',
      payload: customId,
    }).then(() => {
      dispatch({
        type: 'habitList/fetch',
        payload: params,
      });
    });
  };

  handleDetail = record => {
    this.props.dispatch(
      routerRedux.push({
        // pathname: `/habit/record_list/${record.id}`,
        pathname: `/habit/record_list`,
      }),
    );
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="习惯名称">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/*<Col md={8} sm={24}>*/}
          {/*  <FormItem label="使用状态">*/}
          {/*    {getFieldDecorator('status')(*/}
          {/*      <Select*/}
          {/*        placeholder="请选择"*/}
          {/*        style={{*/}
          {/*          width: '100%',*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        <Option value="0">关闭</Option>*/}
          {/*        <Option value="1">运行中</Option>*/}
          {/*      </Select>,*/}
          {/*    )}*/}
          {/*  </FormItem>*/}
          {/*</Col>*/}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
            </span>
          </Col>
          <Col md={8} sm={24}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
              新建
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      habitList: { listData },
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
          <div className={styles.habitList}>
            <div className={styles.habitListForm}>{this.renderSimpleForm()}</div>
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

export default Form.create()(HabitList);
