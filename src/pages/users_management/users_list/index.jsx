import { Badge, Button, Card, Col, Form, Input, Row, Select, message, Modal } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import CreateForm from './components/CreateForm';
import StandardTable from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
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
      dataIndex: 'name',
    },
    {
      title: '个性签名',
      dataIndex: 'personalSignature',
    },
    {
      title: '加入习惯数',
      dataIndex: 'id',
      render: val => `${val} 个`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '拥有心愿',
      dataIndex: 'id',
      align: 'center',
      render: val => `${val} 个`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '上次登陆时间',
      dataIndex: 'lastLoginTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: record => (
        <Fragment>
          <a onClick={() => this.handleRecommendModal(record)}>
            {record.recommended ? '取消推荐' : '设置为推荐用户'}
          </a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    const params = {
      pageNo: 0,
      size: 10,
    };
    dispatch({
      type: 'usersList/fetch',
      // payload: params,
    });
  }

  handleRecommendModal = record => {
    Modal.confirm({
      title: '操作',
      content: record.recommended ? '确认取消推荐吗' : '确认将该用户设置为推荐用户吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleRecommend(record),
    });
  };

  handleRecommend = record => {
    const { dispatch } = this.props;
    const userId = record.id;
    console.log('id:', userId);
    dispatch({
      type: 'usersList/recommend',
      payload: { userId: 0 },
    }).then(() => {
      dispatch({
        type: 'usersList/fetch',
        payload: {
          pageNo: 0,
          pageSize: this.state.pageSize,
        },
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

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'userTableList/fetch',
      payload: {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'userTableList/fetch',
        payload: values,
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
    dispatch({
      type: 'userTableList/add',
      payload: {
        desc: fields.desc,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
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
            <FormItem label="关键字">
              {getFieldDecorator('name')(<Input placeholder="编号/手机号/渠道/昵称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择 激活/冻结/未激活/全部"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="0">激活</Option>
                  <Option value="1">冻结</Option>
                  <Option value="2">未激活</Option>
                  <Option value="3">全部</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
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
        </Row>
      </Form>
    );
  }

  render() {
    const {
      usersList: { listData },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={listData}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
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
