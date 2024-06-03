import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { PostApi } from "services/api";
import { Navigate } from "react-router-dom";
import { db } from "auth/FirebaseAuth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore/lite";

const AddBuers = ({ add }) => {
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

  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      const res = await addDoc(collection(db, "buyers"), {
        name: values?.name || "",
        email: values?.email || "",
        prefix: values?.prefix || "",
        contactNumber: values?.contactNumber || "", // Fixed typo
        category: values?.category || "",
        product: values?.product || "",
        state: values?.state || "",
        timestamp: serverTimestamp(),
      });

      handleCancel();
      console.log("Document added with ID: ", res.id);
      form.resetFields();
    } catch (error) {
      console.error("Error adding document: ", error);
      // Optionally, you can show an error message to the user here
    }
  };

  const handleCountryCodeChange = (value) => {
    setCountryCode(value);
  };

  // const validatePhoneNumber = (_, value) => {
  //   const phoneNumberRegex = /^[0-9]$/; // Modify this regex according to your phone number format
  //   if (!value || phoneNumberRegex.test(value)) {
  //     return Promise.resolve();
  //   }
  //   return Promise.reject("Please enter a valid phone number");
  // };

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
        title="Add Buers"
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
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          form={form}
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
            name="contectNomber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input your phone number!" },
              // { validator: validatePhoneNumber },?
            ]}
          >
            <Input
              addonBefore={
                <Form.Item name="prefix" noStyle>
                  <Select
                    defaultValue={countryCode}
                    style={{ border: "none" }}
                    value={countryCode}
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
                    <Select.Option value="+971">
                      <FlagIcon code="AE" />
                      <span style={{ marginLeft: 8 }}>+971</span>
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
            name="category"
            rules={[{ required: true, message: "Please select an category" }]}
            hasFeedback
          >
            <Select placeholder="Select an option">
              <Select.Option value="spices">Spices</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Product"
            name="product"
            rules={[{ required: true, message: "Please select an Product" }]}
            hasFeedback
          >
            <Select>
              <Select.Option value="Redchilli">Red chilli</Select.Option>
              <Select.Option value="StarAnise">Star Anise</Select.Option>
              <Select.Option value="Turmeric">Turmeric</Select.Option>
            </Select>
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

          {/* <Form.Item label="TextArea">
            <TextArea rows={4} />
          </Form.Item> */}

          {/* <Form.Item
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
          </Form.Item> */}
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

export default AddBuers;
