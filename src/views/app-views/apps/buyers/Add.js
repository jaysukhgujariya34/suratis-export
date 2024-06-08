import React, { useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { FlagIcon } from "react-flag-kit";
import { db } from "auth/FirebaseAuth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore/lite";

const AddBuers = ({
  addModal,
  setAddModal,
  add,
  editmodel,
  setEditModal,
  buyers,
}) => {
  const [countryCode, setCountryCode] = useState("+1"); // Default country code

  const handleCancel = () => {
    if (buyers) {
      setEditModal(false);
    }
    setAddModal(false);
  };

  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      if (buyers) {
        await updateDoc(doc(db, "buyers", buyers?.id), {
          ...values,
          timestamp: serverTimestamp(),
        });
        setEditModal(false);
        add(true);
      } else {
        await addDoc(collection(db, "buyers"), {
          ...values,
          timestamp: serverTimestamp(),
        });
        setAddModal(false);
        form.resetFields();
        add(true);
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleCountryCodeChange = (value) => {
    setCountryCode(value);
  };

  return (
    <>
      <Modal
        open={addModal || editmodel}
        title="Add Buers"
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {buyers ? "Update" : "Add"}
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          layout="vertical"
          form={form}
          initialValues={{
            name: buyers?.name || "",
            email: buyers?.email || "",
            contectNomber: buyers?.contectNomber || "",
            prefix: buyers?.prefix || "",
            category: buyers?.category || "",
            product: buyers?.product || "",
            country: buyers?.country || "",
          }}
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
            <Input placeholder="sample@gmail.com" />
          </Form.Item>

          <p style={{ marginBottom: "2px" }}>
            <span style={{ color: "red", marginRight: "2px" }}>*</span>
            Phone Number
          </p>
          <Form.Item
            style={{ width: "100%" }}
            name="contectNomber"
            // label="Phone Number"
            rules={[
              { required: true, message: "Please input your phone number!" },
              {
                pattern: /^\d+$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input
              addonBefore={
                <Select
                  defaultValue={countryCode}
                  style={{ border: "none" }}
                  value={buyers?.prefix || countryCode}
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
                </Select>
              }
              placeholder="Phone Number"
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please enter a category" }]}
            hasFeedback
          >
            <Input placeholder="Country" />
          </Form.Item>

          <Form.Item
            label="Product"
            name="product"
            rules={[{ required: true, message: "Please enter a product" }]}
            hasFeedback
          >
            <Input placeholder="Country" />
          </Form.Item>

          <Form.Item
            label="Country"
            name="country"
            rules={[{ required: true, message: "Please select a country" }]}
            hasFeedback
          >
            <Input placeholder="Country" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddBuers;
