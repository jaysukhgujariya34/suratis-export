import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import { FlagIcon } from "react-flag-kit";

const AddSuppliers = () => {
  const [open, setOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("+1"); // Default country code

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const validateNumber = (_, value) => {
    if (!value || value.trim() === "") {
      return Promise.reject(new Error("Number is required"));
    }
    return Promise.resolve();
  };

  const handleCountryCodeChange = (value) => {
    setCountryCode(value);
  };

  return (
    <>
      <Space>
        <Button type="primary" onClick={showModal}>
          <PlusOutlined />
          {/* <span className="buttoneSize"> Add Supplier</span> */}
        </Button>
      </Space>
      <Modal
        open={open}
        title="Add Suppliers"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button>Custom Button</Button>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            hasFeedback
            label="Name"
            name="name"
            validateDebounce={1000}
            rules={[{ required: true, message: "Supplier Name Is Required" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Email"
            name="email"
            validateDebounce={1000}
            rules={[{ required: true, message: "Supplier Email Is Required" }]}
          >
            <Input placeholder="sampale@gmail.com" />
          </Form.Item>

          <Form.Item
            style={{ width: "100%" }}
            name="phoneNumber"
            label="Phone Number"
            rules={[{ validator: validateNumber, max: 10 }]}
          >
            <Input
              addonBefore={
                <Form.Item name="prefix" noStyle>
                  <Select
                    defaultValue={countryCode}
                    style={{ border: "none" }}
                    onChange={handleCountryCodeChange}
                    dropdownRender={(menu) => <div>{menu}</div>}
                  >
                    <Select.Option value="+1">
                      <FlagIcon code="US" />
                      <span style={{ marginLeft: 8 }}>+1</span>
                    </Select.Option>
                    <Select.Option value="+44">
                      <FlagIcon code="GB" />
                      <span style={{ marginLeft: 8 }}>+44</span>
                    </Select.Option>
                    <Select.Option value="+91">
                      <FlagIcon code="IN" />
                      <span style={{ marginLeft: 8 }}>+91</span>
                    </Select.Option>
                    {/* Add more country codes as needed */}
                  </Select>
                </Form.Item>
              }
              placeholder="Phone Number"
            />
          </Form.Item>

          <Form.Item label="Catagory">
            <Select>
              <Select.Option value="spices">Spices</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="product">
            <Select>
              <Select.Option value="Redchilli">Red chilli</Select.Option>
              <Select.Option value="StarAnise">Star Anise</Select.Option>
              <Select.Option value="Turmeric">Turmeric</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="State">
            <Select>
              <Select.Option value="gujrat">Gujrat</Select.Option>
            </Select>
          </Form.Item>

          {/* <Form.Item label="TextArea">
            <TextArea rows={4} />
          </Form.Item> */}

          <Form.Item
            label="Document"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload action="/upload.do" listType="picture-card">
              <button style={{ border: 0, background: "none" }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          </Form.Item>
          <Form.Item label=" " colon={false}>
            <Button style={{ float: "right" }} type="primary" htmlType="submit">
              Add
            </Button>
            <Button
              style={{ float: "right", marginRight: "10px" }}
              type="default"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddSuppliers;
