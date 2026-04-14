import { useState } from 'react';
import { message } from 'antd';
import type { TFilter } from '@/components/Table/typing';
import _ from 'lodash';
import { Course } from '@/pages/Course/typing';

export default () => {
  const [danhSach, setDanhSach] = useState<Course.IRecord[]>([]);
  const [record, setRecord] = useState<Course.IRecord>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<TFilter<Course.IRecord>[]>([]);
  const [sort, setSort] = useState<any>();
  const [edit, setEdit] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(true);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<string[]>();

  const STORAGE_KEY = 'online_courses';

  const getModel = async () => {
    setLoading(true);
    try {
      let data: Course.IRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

      // Apply Search & Filters
      if (filters && filters.length > 0) {
        filters.forEach((f) => {
          if (f.active !== false && f.values && f.values.length > 0) {
            const field = Array.isArray(f.field) ? f.field[0] : f.field;
            if (f.operator === 'contain' || f.operator === 'include') {
              data = data.filter((item) => {
                const val = _.get(item, field as string);
                if (!val) return false;
                return f.values!.some((v) => 
                  val.toString().toLowerCase().includes(v.toString().toLowerCase())
                );
              });
            }
          }
        });
      }

      // Apply Sorting
      if (sort) {
        const sortField = Object.keys(sort)[0];
        const sortOrder = sort[sortField] === 1 ? 'asc' : 'desc';
        data = _.orderBy(data, [sortField], [sortOrder]);
      }

      setTotal(data.length);
      
      // Pagination
      const start = (page - 1) * limit;
      const paginatedData = data.slice(start, start + limit);
      
      setDanhSach(paginatedData);
    } catch (error) {
      console.error('Failed to get courses', error);
    } finally {
      setLoading(false);
    }
  };

  const postModel = async (payload: Partial<Course.IRecord>) => {
    const data: Course.IRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Validation: Unique Name
    if (data.some(item => item.courseName === payload.courseName)) {
      message.error('Tên khóa học đã tồn tại!');
      throw new Error('Duplicate course name');
    }

    const newRecord: Course.IRecord = {
      ...payload,
      _id: Math.random().toString(36).substr(2, 9),
    } as Course.IRecord;

    const newData = [newRecord, ...data];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    message.success('Thêm mới khóa học thành công');
    setVisibleForm(false);
    getModel();
    return newRecord;
  };

  const putModel = async (id: string, payload: Partial<Course.IRecord>) => {
    const data: Course.IRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Validation: Unique Name (excluding current)
    if (data.some(item => item.courseName === payload.courseName && item._id !== id)) {
      message.error('Tên khóa học đã tồn tại!');
      throw new Error('Duplicate course name');
    }

    const newData = data.map((item) => (item._id === id ? { ...item, ...payload } : item));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    message.success('Cập nhật khóa học thành công');
    setVisibleForm(false);
    getModel();
  };

  const deleteModel = async (id: string) => {
    const data: Course.IRecord[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const target = data.find(item => item._id === id);

    if (target && target.studentCount > 0) {
      message.error('Không thể xóa khóa học đã có học viên!');
      return;
    }

    const newData = data.filter((item) => item._id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    message.success('Xóa khóa học thành công');
    getModel();
  };

  const handleEdit = (rec: Course.IRecord) => {
    setRecord(rec);
    setEdit(true);
    setIsView(false);
    setVisibleForm(true);
  };

  return {
    danhSach,
    record,
    setRecord,
    page,
    setPage,
    limit,
    setLimit,
    loading,
    total,
    filters,
    setFilters,
    sort,
    setSort,
    edit,
    setEdit,
    isView,
    setIsView,
    visibleForm,
    setVisibleForm,
    getModel,
    postModel,
    putModel,
    deleteModel,
    handleEdit,
    selectedIds,
    setSelectedIds,
    initFilter: [],
  };
};
