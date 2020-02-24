import { Button, Card, List, Modal, Typography } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';

const { Paragraph } = Typography;

@connect(({ hopeList, loading }) => ({
  hopeList,
  loading: loading.models.list,
}))
class CardList extends Component {
  state = {
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hopeList/fetch',
      payload: {
        count: 8,
      },
    });
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
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
                      <Button key="option1" type="link" onClick={this.handleModalVisible}>
                        查看详情
                      </Button>,
                      <Button type="link" key="option2">
                        删除
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.images} />}
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
          <Modal
            destroyOnClose
            title="心愿详情"
            visible={this.state.modalVisible}
            onOk={() => this.handleModalVisible()}
            onCancel={() => this.handleModalVisible()}
          >
            <div>aaa</div>
          </Modal>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
