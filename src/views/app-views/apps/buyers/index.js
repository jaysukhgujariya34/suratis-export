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
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import { useNavigate } from "react-router-dom";
import utils from "utils";
import { PlusOutlined } from "@ant-design/icons";
import AddBuers from "./Add";
import { db } from "auth/FirebaseAuth";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore/lite";

const { Option } = Select;

const getStockStatus = (stockCount) => {
  if (stockCount >= 10) {
    return (
      <>
        <Badge status="success" />
        <span>In Stock</span>
      </>
    );
  }
  if (stockCount < 10 && stockCount > 0) {
    return (
      <>
        <Badge status="warning" />
        <span>Limited Stock</span>
      </>
    );
  }
  if (stockCount === 0) {
    return (
      <>
        <Badge status="error" />
        <span>Out of Stock</span>
      </>
    );
  }
  return null;
};

const categories = ["Cloths", "Bags", "Shoes", "Watches", "Devices"];

const BuyersList = () => {
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  // api data store

  const [add, setAdd] = useState(false);
  const [editRow, setEditRow] = useState();
  const [addModal, setAddModal] = useState(false);
  const [addModaledit, setAddModaledit] = useState(false);

  const fetchDocuments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "buyers"));
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
  }, []);

  const deleteData = async (id) => {
    try {
      await deleteDoc(doc(db, "buyers", id));
      fetchDocuments();
    } catch (error) {
      console.log(error);
    }
  };

  const tableColumns = [
    {
      title: "Buyers",
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
      dataIndex: "contectNomber",
      render: (_, record) => (
        <div>
          <a
            href={`https://web.whatsapp.com/send?phone=${record?.contectNomber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mr-1">
              {record?.prefix} {record?.contectNomber}
            </span>
          </a>
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "contectNumber"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => utils.antdTableSorter(a, b, "email"),
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => utils.antdTableSorter(a, b, "category"),
    },
    {
      title: "Product",
      dataIndex: "product",
      sorter: (a, b) => utils.antdTableSorter(a, b, "price"),
    },
    {
      title: "Country",
      dataIndex: "country",
      sorter: (a, b) => utils.antdTableSorter(a, b, "country"),
    },
    // {
    //   title: "Document",
    //   dataIndex: "document",
    //   render: (stock) => (
    //     <div style={{textAlign:'center'}}>
    //       <DownloadOutlined />
    //       {/* <Flex alignItems="center">{getStockStatus(stock)}</Flex> */}
    //     </div>
    //   ),
    //   sorter: (a, b) => utils.antdTableSorter(a, b, "stock"),
    // },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, elm) => (
        <>
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
    const searchArray = e.currentTarget.value ? list : list;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  const handleShowCategory = (value) => {
    if (value !== "All") {
      const key = "category";
      const data = utils.filterArray(list, key, value);
      setList(data);
    } else {
      setList(list);
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
        <Flex alignItems="center" mobileFlex={false} justifyContent="center">
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

          <AddBuers
            addModal={addModal}
            setAddModal={setAddModal}
            add={newAddBuers}
          />
          <AddBuers
            editmodel={addModaledit}
            setEditModal={setAddModaledit}
            add={newAddBuers}
            buyers={editRow}
            setSuppliers={setEditRow}
          />
        </div>
      </Flex>
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={list || list}
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

export default BuyersList;
