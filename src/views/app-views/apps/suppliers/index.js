import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Badge,
  Menu,
  Tooltip,
  Popconfirm,
} from "antd";
import ProductListData from "assets/data/product-list.data.json";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import utils from "utils";
import AddSuppliers from "./Add";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore/lite";
import { db } from "auth/FirebaseAuth";

const { Option } = Select;



const categories = ["spices", "Bags", "Shoes", "Watches", "Devices"];

const SupplierList = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [add, setAdd] = useState(false);
  const [editRow, setEditRow] = useState();
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [addModaledit, setAddModaledit] = useState(false);

  const fetchDocuments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "suppliers"));
      const res = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setList(res);
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [add]);

  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, "suppliers", id));
      fetchDocuments();
    } catch (error) {
      console.log(error);
    }
  };

  const tableColumns = [
    {
      title: "Suppliers",
      dataIndex: "name",
      render: (_, record) => (
        <div
          className="d-flex"
          style={{ marginRight: "10px", alignItems: "center" }}
        >
          <div
            style={{
              minWidth: "30px",
              fontWeight: "700",
              backgroundColor: "grey",
              color: "#fff",
              textAlign: "center",
              fontSize: "20px",
              minHeight: "30px",
              borderRadius: "8px",
              textTransform: "capitalize",
              marginRight: "10px",
            }}
          >
            {record?.name[0]}
          </div>
          {record?.name}
          <br />
          {record?.id}
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
    },
    {
      title: "Contect Number",
      dataIndex: "phoneNumber",
      render: (_, record) => (
        <div>
          <a
            href={`https://web.whatsapp.com/send?phone=${record.prefix + record.phoneNumber.replace(
              /\s/g,
              ""
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mr-1">{record?.prefix}</span>
            {record?.phoneNumber}
          </a>
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "phoneNumber"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => utils.antdTableSorter(a, b, "email"),
    },
    {
      title: "Category",
      dataIndex: "catagory",
      sorter: (a, b) => utils.antdTableSorter(a, b, "catagory"),
    },
    {
      title: "Product",
      dataIndex: "product",
      sorter: (a, b) => utils.antdTableSorter(a, b, "price"),
    },
    {
      title: "State",
      dataIndex: "state",
      sorter: (a, b) => utils.antdTableSorter(a, b, "state"),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, elm) => (
        <>
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />}></Button>
          </Tooltip>
          <Tooltip title="Edit Details">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditRow(elm);
                setAddModaledit(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Delete Data">
            <Popconfirm
              title="Are you sure delete this user?"
              onConfirm={() => deleteData(elm.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows);
      setSelectedRowKeys(key);
    },
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = e.currentTarget.value ? list : ProductListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const handleShowCategory = (value) => {
    if (value !== "All") {
      const key = "category";
      const data = utils.filterArray(ProductListData, key, value);
      setList(data);
    } else {
      setList(ProductListData);
    }
  };

  const newAddBuers = (e) => {
    setAdd(e);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        // mobileFlex={false}
      >
        <Flex mobileFlex={false} alignItems="center" justifyContent="center">
          <div>
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
            />
          </div>
          <div>
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowCategory}
              placeholder="Category"
            >
              <Option value="All">All</Option>
              {categories.map((elm) => (
                <Option key={elm} value={elm}>
                  {elm}
                </Option>
              ))}
            </Select>
          </div>
        </Flex>

        <div>
          <Tooltip title="Add Supplier">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setAddModal(true);
              }}
            />
          </Tooltip>

          <AddSuppliers
            editmodel={addModaledit}
            setEditModal={setAddModaledit}
            add={newAddBuers}
            suppliers={editRow}
          />

          <AddSuppliers
            addModal={addModal}
            setAddModal={setAddModal}
            add={newAddBuers}
          />
        </div>
      </Flex>
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={list}
          rowKey="id"
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            type: "checkbox",
            preserveSelectedRowKeys: false,
            ...rowSelection,
          }}
        />
      </div>
    </Card>
  );
};

export default SupplierList;
