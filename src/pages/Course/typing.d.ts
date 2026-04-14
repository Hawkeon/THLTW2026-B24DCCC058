export declare namespace Course {
  export interface IRecord {
    _id: string;
    courseId: string;
    courseName: string;
    instructor: string;
    studentCount: number;
    status: 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';
    description: string;
  }
}
