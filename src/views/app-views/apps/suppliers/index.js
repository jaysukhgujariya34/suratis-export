import React, { useState, useEffect } from "react";
import { Card, Table, Select, Input, Button, Badge, Menu } from "antd";
import ProductListData from "assets/data/product-list.data.json";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import { useNavigate } from "react-router-dom";
import utils from "utils";
import AddSuppliers from "./Add";
import { GetApi } from "services/api";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "auth/FirebaseAuth";

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

const categories = ["spices", "Bags", "Shoes", "Watches", "Devices"];

const SupplierList = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [add, setAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item onClick={() => viewDetails(row)}>
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item>

      <Menu.Item onClick={() => viewDetails(row)}>
        <Flex alignItems="center">
          <EditOutlined />
          <span className="ml-2">Edit Details</span>
        </Flex>
      </Menu.Item>

      <Menu.Item onClick={() => viewDetails(row)}>
        <Flex alignItems="center">
          <DownloadOutlined />
          <span className="ml-2">Download</span>
        </Flex>
      </Menu.Item>

      <Menu.Item onClick={() => deleteRow(row)}>
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">
            {selectedRows.length > 0
              ? `Delete (${selectedRows.length})`
              : "Delete"}
          </span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const viewDetails = (row) => {
    navigate(`/app/apps/ecommerce/edit-product/${row.id}`);
  };

  const deleteRow = (row) => {
    const objKey = "id";
    let data = list;
    if (selectedRows.length > 1) {
      selectedRows.forEach((elm) => {
        data = utils.deleteArrayRow(data, objKey, elm.id);
        setList(data);
        setSelectedRows([]);
      });
    } else {
      data = utils.deleteArrayRow(data, objKey, row.id);
      setList(data);
    }
  };

  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Users",
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
            {record.name[0]}
          </div>
          {record.name}
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
            href={`https://web.whatsapp.com/send?phone=${record.phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mr-1">{record.prefix}</span>
            {record.phoneNumber}
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
      title: "Country",
      dataIndex: "country",
      sorter: (a, b) => utils.antdTableSorter(a, b, "country"),
    },
    {
      title: "Status",
      dataIndex: "stock",
      render: (stock) => (
        <Flex alignItems="center">{getStockStatus(stock)}</Flex>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "stock"),
    },
    {
      title: "",
      dataIndex: "actions",
      render: (elm) => (
        <div className="text-right">
          {console.log("11111", elm)}
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
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

  useEffect(() => {
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

    fetchDocuments();
  }, [add]);

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
          <AddSuppliers add={newAddBuers} />
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
