import { Space, Table } from "antd";
import type { TableProps } from "antd";

interface DataType {
  key: string;
  name: string;
  size: number;
  type: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "文件名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "文件大小",
    dataIndex: "size",
    key: "size",
    align: "center",
  },
  {
    title: "文件类型",
    dataIndex: "type",
    key: "type",
    align: "center",
  },

  {
    title: "操作",
    key: "action",
    align: "right",
    render: () => (
      <Space size="small">
        <a>预览</a>
        <a>下载</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown jkl make is a lanle lng 00-iopljTHKl",
    size: 32,
    type: "PDF",
  },
  {
    key: "2",
    name: "Jim Green",
    size: 42,
    type: "TXT",
  },
  {
    key: "3",
    name: "Joe Black",
    size: 32,
    type: "DOC",
  },
];

type PropsType = {
  className?: string;
  [key: string]: any; // 其他属性
};

const FileList = (props: PropsType) => {
  return (
    <Table<DataType> columns={columns} bordered dataSource={data} {...props} />
  );
};

export default FileList;
