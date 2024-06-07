import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { FlagIcon } from "react-flag-kit";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore/lite";
import { db } from "auth/FirebaseAuth";

const AddSuppliers = ({
  addModal,
  setAddModal,
  add,
  editmodel,
  setEditModal,
  suppliers,
}) => {
  const [countryCode, setCountryCode] = useState("+91"); // Default country code
  const [form] = Form.useForm();

  useEffect(() => {
    if (suppliers) {
      form.setFieldsValue(suppliers);
    }
  }, [suppliers, form]);

  const onFinish = async (values) => {
    try {
      if (suppliers) {
        await updateDoc(doc(db, "suppliers", suppliers?.id), {
          ...values,
          timestamp: serverTimestamp(),
        });
        setEditModal(false);
      } else {
        await addDoc(collection(db, "suppliers"), {
          ...values,
          timestamp: serverTimestamp(),
        });
        setAddModal(false);
      }

      add(true);

      form.resetFields(); // Clear the suppliers state
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleCancel = () => {
    if (!suppliers) {
      setAddModal(false);
    }
    setEditModal(false);
    // Clear the suppliers state
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
    <Modal
      open={addModal || editmodel}
      title="Add Suppliers"
      onOk={() => form.submit()}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {suppliers ? "Update" : "Add"}
        </Button>,
      ]}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 24 }}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          name: suppliers?.name || "",
          email: suppliers?.email || "",
          phoneNumber: suppliers?.phoneNumber || "",
          prefix: suppliers?.prefix || countryCode,
          catagory: suppliers?.catagory || "",
          product: suppliers?.product || "",
          state: suppliers?.state || "",
        }}
      >
        <Form.Item
          label="Company Name"
          name="name"
          rules={[{ required: true, message: "Supplier Name Is Required" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Supplier Email Is Required" }]}
        >
          <Input placeholder="sample@gmail.com" />
        </Form.Item>

        <p style={{ marginBottom: "2px" }}>
          <span style={{ color: "red", marginRight: "2px" }}>*</span>
          Phone Number
        </p>
        <Form.Item
          // label="Phone Number"
          name="phoneNumber"
          rules={[{ validator: validateNumber, max: 10 }]}
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
                  <Select.Option value="+91">
                    <FlagIcon code="IN" />
                    <span style={{ marginLeft: 8 }}>+91</span>
                  </Select.Option>
                </Select>
              </Form.Item>
            }
            placeholder="Phone Number"
          />
        </Form.Item>

        <Form.Item
          label="Category"
          name="catagory"
          rules={[{ required: true, message: "Please select a Category" }]}
        >
          <Select>
            <Select.Option value="spices">Spices</Select.Option>
            <Select.Option value="bags">Bags</Select.Option>
            <Select.Option value="shoes">Shoes</Select.Option>
            <Select.Option value="watches">Watches</Select.Option>
            <Select.Option value="devices">Devices</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Product"
          name="product"
          rules={[{ required: true, message: "Product Name Required" }]}
        >
          <Input placeholder="Product Name" />
        </Form.Item>

        <Form.Item
          label="State"
          name="state"
          rules={[{ required: true, message: "State Name Required" }]}
        >
          <Input placeholder="State Name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSuppliers;
