import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Tag } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';
import { Course } from './typing';

const CoursePage = () => {
  const { page, limit, deleteModel, handleEdit } = useModel('course');

  const columns: IColumn<Course.IRecord>[] = [
    {
      title: 'Mã khóa học',
      dataIndex: 'courseId',
      width: 120,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'courseName',
      width: 250,
      filterType: 'string',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructor',
      width: 180,
      filterType: 'select',
      filterData: ['Nguyễn Văn A', 'Trần Thị B', 'Phạm Văn C', 'Lê Văn D'],
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'studentCount',
      width: 150,
      align: 'center',
      sortable: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 150,
      align: 'center',
      filterType: 'select',
      filterData: [
        { label: 'Đang mở', value: 'Đang mở' },
        { label: 'Đã kết thúc', value: 'Đã kết thúc' },
        { label: 'Tạm dừng', value: 'Tạm dừng' },
      ],
      render: (status: string) => {
        let color = 'blue';
        if (status === 'Đã kết thúc') color = 'gray';
        if (status === 'Tạm dừng') color = 'orange';
        if (status === 'Đang mở') color = 'green';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (record: Course.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id)}
              title="Bạn có chắc chắn muốn xóa khóa học này?"
              placement="topLeft"
              disabled={record.studentCount > 0}
            >
              <Button 
                danger 
                type="link" 
                icon={<DeleteOutlined />} 
                onClick={() => {
                  if (record.studentCount > 0) {
                    // Logic error feedback is handled in deleteModel, but we can also prevent here
                  }
                }}
              />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="course"
      title="Quản lý khóa học"
      Form={Form}
      formType="Modal"
      widthDrawer={800}
    />
  );
};

export default CoursePage;
