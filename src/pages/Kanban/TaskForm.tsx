import { DatePicker, Form, Input, Modal, Select, Tag } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Task } from './types';

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<Task>) => void;
  initialValues?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          deadline: initialValues.deadline ? moment(initialValues.deadline) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null,
      });
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={initialValues ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
        >
          <Input placeholder="Nhập tên công việc" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Nhập mô tả công việc" />
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Hạn chót"
          rules={[{ required: true, message: 'Vui lòng chọn hạn chót' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Độ ưu tiên"
          rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}
          initialValue="Medium"
        >
          <Select>
            <Select.Option value="High">Cao</Select.Option>
            <Select.Option value="Medium">Trung bình</Select.Option>
            <Select.Option value="Low">Thấp</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="tags" label="Nhãn (Tags)">
          <Select mode="tags" style={{ width: '100%' }} placeholder="Thêm nhãn">
            <Select.Option value="Frontend">Frontend</Select.Option>
            <Select.Option value="Backend">Backend</Select.Option>
            <Select.Option value="Design">Design</Select.Option>
            <Select.Option value="Bug">Bug</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;
