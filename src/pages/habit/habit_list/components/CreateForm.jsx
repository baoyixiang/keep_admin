import { Form, Icon, Input, Modal, Select, Upload, message } from 'antd';
import React, { Component } from 'react';
import { picUploadUrl } from '@/utils/axios';
import { log } from 'lodash-decorators/utils';
// import {picUploadUrl} from "@/utils/axios";
// import {getToken} from "@/utils/authority";

const FormItem = Form.Item;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片必须小于2M!');
  }
  return isJpgOrPng && isLt2M;
}

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      fileList: [],
    };
  }

  okHandle = () => {
    const { handleAdd, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    // this.setState({
    //   fileList: info
    // });
    console.log('tupian:', info);
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
      console.log('url:', this.state.imageUrl);
    }
    if (info.file.status === 'error') {
      message.error('图片上传失败：' + info.file.response.message);
    }
  };

  render() {
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 15,
      },
    };
    const { imageUrl, fileList } = this.state;
    const { modalVisible, form, handleModalVisible } = this.props;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <Modal
        destroyOnClose
        title="新建习惯"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={handleModalVisible}
      >
        <FormItem {...formItemLayout} label="习惯名称">
          {form.getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入习惯名称！',
                // min: 2,
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="习惯logo">
          {form.getFieldDecorator('logo', {
            rules: [
              {
                required: true,
                message: '请选择习惯logo！',
              },
            ],
          })(
            <Upload
              // action={picUploadUrl}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
              showUploadList={false}
              // fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
              // headers={{
              //   authorization: getToken(),
              // }}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="logo" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>,
          )}
          请上传1:1、小于2M的图片
        </FormItem>
        <FormItem {...formItemLayout} label="习惯分类">
          {form.getFieldDecorator('tags')(
            <Select placeholder="请选择" defaultValue={0} style={{ width: 150 }}>
              {/*<Option value={0}>无分类</Option>*/}
              <Option value={1}>学习</Option>
              <Option value={2}>运动</Option>
              <Option value={3}>音乐</Option>
            </Select>,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
