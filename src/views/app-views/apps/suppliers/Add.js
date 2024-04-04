import React, { useState, useEffect } from "react";
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
import { GetApi, PostApi } from "services/api";


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

  const onFinish = async (values) => {
    const result = await PostApi("/api/suppliers", values);
    if (result && result.status === 200) {
      handleCancel();
    }
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
          <p style={{ marginBottom: "2px" }}>
            {" "}
            <span style={{ color: "red", marginRight: "2px" }}>*</span>Company
            Name
          </p>
          <Form.Item
            hasFeedback
            // label="Company Name"
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
          <p style={{ marginBottom: "2px" }}>
            <span style={{ color: "red", marginRight: "2px" }}>*</span>Phone
            Number
          </p>
          <Form.Item
            style={{ width: "100%" }}
            name="phoneNumber"
            label=""
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
                    <Select.Option value={countryCode}>
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
                    <Select.Option value="+61">
                      <FlagIcon code="AU" />
                      <span style={{ marginLeft: 8 }}>+61</span>
                    </Select.Option>
                    {/* Add more country codes as needed */}
                  </Select>
                </Form.Item>
              }
              placeholder="Phone Number"
            />
          </Form.Item>

          <Form.Item
            label="Catagory"
            name="catagory"
            rules={[{ required: true, message: "Please select an Catagory" }]}
            hasFeedback
          >
            <Select>
              <Select.Option value="spices">Spices</Select.Option>
            </Select>
          </Form.Item>

          <p style={{ marginBottom: "2px" }}>
            <span style={{ color: "red", marginRight: "2px" }}>*</span>
            Product
          </p>
          <Form.Item
            hasFeedback
            // label="GST Number"
            name="product"
            validateDebounce={1000}
            rules={[{ required: true, message: "Product Name Required" }]}
          >
            <Input placeholder="Product Name" />
          </Form.Item>

          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "Please select an State" }]}
            hasFeedback
          >
            <Select>
              <Select.Option value="gujrat">Gujrat</Select.Option>
            </Select>
          </Form.Item>

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
