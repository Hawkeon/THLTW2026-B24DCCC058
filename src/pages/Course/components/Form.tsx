import { Button, Form, Input, InputNumber, Select } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import TinyEditor from '@/components/TinyEditor';
import { Course } from '../typing';

const CourseForm = () => {
  const [form] = Form.useForm();
  const { record, edit, postModel, putModel, setVisibleForm } = useModel('course');

  useEffect(() => {
    if (edit && record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [record, edit]);

  const onFinish = async (values: any) => {
    if (edit && record?._id) {
      await putModel(record._id, values);
    } else {
      await postModel(values);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>{edit ? 'Chỉnh sửa khóa học' : 'Thêm mới khóa học'}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'Đang mở', studentCount: 0 }}
      >
        <Form.Item
          name="courseId"
          label="Mã khóa học"
          rules={[{ required: true, message: 'Vui lòng nhập mã khóa học' }]}
        >
          <Input placeholder="VD: CS101" />
        </Form.Item>

        <Form.Item
          name="courseName"
          label="Tên khóa học"
          rules={[
            { required: true, message: 'Vui lòng nhập tên khóa học' },
            { max: 100, message: 'Tên khóa học không được vượt quá 100 ký tự' }
          ]}
        >
          <Input placeholder="Nhập tên khóa học" />
        </Form.Item>

        <Form.Item
          name="instructor"
          label="Giảng viên"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
        >
          <Select placeholder="Chọn giảng viên">
            <Select.Option value="Nguyễn Văn A">Nguyễn Văn A</Select.Option>
            <Select.Option value="Trần Thị B">Trần Thị B</Select.Option>
            <Select.Option value="Phạm Văn C">Phạm Văn C</Select.Option>
            <Select.Option value="Lê Văn D">Lê Văn D</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="studentCount"
          label="Số lượng học viên"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select>
            <Select.Option value="Đang mở">Đang mở</Select.Option>
            <Select.Option value="Đã kết thúc">Đã kết thúc</Select.Option>
            <Select.Option value="Tạm dừng">Tạm dừng</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả khóa học"
          valuePropName="value"
          getValueFromEvent={(val) => val}
        >
          <TinyEditor height={300} />
        </Form.Item>

        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Button onClick={() => setVisibleForm(false)} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            {edit ? 'Lưu thay đổi' : 'Thêm mới'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CourseForm;
