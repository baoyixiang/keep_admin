import { Button, Card, Descriptions, List, Modal, Spin, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import moment from 'moment';

const { Paragraph } = Typography;

@connect(({ hopeList, loading }) => ({
  hopeList,
  loading: loading.models.list,
}))
class CardList extends Component {
  state = {
    modalVisible: false,
    hopeDetail: {},
    loading: false,
    hasMore: true,
    pageSize: 6,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hopeList/fetch',
      payload: {
        pageNo: 0,
        pageSize: this.state.pageSize,
      },
    });
  }

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      hopeDetail: record || {},
    });
    console.log('hope:', this.state.hopeDetail);
  };

  handleDeleteModalVisible = record => {
    Modal.confirm({
      title: '操作',
      content: '确定删除这一心愿吗',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.handleDelete(record),
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    const hopeId = record.id;
    console.log('id:', hopeId);
    dispatch({
      type: 'hopeList/delete',
      payload: { hopeId },
    }).then(() => {
      dispatch({
        type: 'hopeList/fetch',
        payload: {
          pageNo: 0,
          pageSize: this.state.pageSize,
        },
      });
    });
  };

  handleInfiniteOnLoad = () => {
    console.log('我在加载。。。');
    const {
      hopeList: { list },
      dispatch,
    } = this.props;
    this.setState({
      loading: true,
      pageSize: this.state.pageSize + 6,
    });
    if (list.length > 14) {
      message.warning('无更多心愿');
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    dispatch({
      type: 'hopeList/fetch',
      payload: {
        pageNo: 0,
        pageSize: this.state.pageSize,
      },
    }).then(() => {
      this.setState({
        loading: false,
      });
    });
  };

  render() {
    const {
      hopeList: { list },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper>
        <div className={styles.cardList}>
          <div className={styles.infinite}>
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleInfiniteOnLoad}
              hasMore={!this.state.loading && this.state.hasMore}
              useWindow={false}
            >
              <List
                rowKey="id"
                loading={loading}
                grid={{
                  gutter: 24,
                  lg: 3,
                  md: 2,
                  sm: 1,
                  xs: 1,
                }}
                dataSource={[...list]}
                renderItem={item => {
                  return (
                    <List.Item key={item.id}>
                      <Card
                        hoverable
                        className={styles.card}
                        actions={[
                          <Button
                            key="option1"
                            type="link"
                            onClick={() => {
                              this.handleModalVisible(true, item);
                            }}
                          >
                            查看详情
                          </Button>,
                          <Button
                            type="link"
                            key="option2"
                            onClick={() => {
                              this.handleDeleteModalVisible(item);
                            }}
                          >
                            删除
                          </Button>,
                        ]}
                      >
                        <Card.Meta
                          avatar={
                            <img alt="未设置" className={styles.cardAvatar} src={item.avatar} />
                          }
                          title={<a>{item.createUserId}</a>}
                          description={
                            <Paragraph
                              className={styles.item}
                              ellipsis={{
                                rows: 3,
                              }}
                            >
                              {item.wordContent}
                            </Paragraph>
                          }
                        />
                      </Card>
                    </List.Item>
                  );
                }}
              />
              {this.state.loading && this.state.hasMore && (
                <div className={styles.loading}>
                  <Spin />
                </div>
              )}
            </InfiniteScroll>
          </div>
          <Modal
            destroyOnClose
            title="心愿详情"
            visible={this.state.modalVisible}
            onOk={() => this.handleModalVisible()}
            onCancel={() => this.handleModalVisible()}
          >
            <Descriptions>
              <Descriptions.Item label="文字内容">
                {this.state.hopeDetail.wordContent}
              </Descriptions.Item>
              <Descriptions.Item label="图片">
                {this.state.hopeDetail.images === null ? this.state.hopeDetail.images : '无'}
              </Descriptions.Item>
              <Descriptions.Item label="录音">
                {this.state.hopeDetail.voice === null ? this.state.hopeDetail.voice : '无'}
              </Descriptions.Item>
              <Descriptions.Item label="点赞数">
                {this.state.hopeDetail.likeCount}
              </Descriptions.Item>
              <Descriptions.Item label="评论数">
                {this.state.hopeDetail.commentCount}
              </Descriptions.Item>
              <Descriptions.Item label="是否匿名">
                {this.state.hopeDetail.isAnonymous === true ? '已匿名' : '未匿名'}
              </Descriptions.Item>
              <Descriptions.Item label="发表时间">
                <span>
                  {moment(this.state.hopeDetail.createTime).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
