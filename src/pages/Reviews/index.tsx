import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table, Rate, Input, Button, Modal, message } from 'antd';
import { bookingStorage, Review, Appointment, Staff, Service } from '@/utils/bookingStorage';
import moment from 'moment';

const Reviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reply, setReply] = useState('');

    useEffect(() => {
        setReviews(bookingStorage.getReviews());
        setAppointments(bookingStorage.getAppointments());
        setStaffList(bookingStorage.getStaff());
        setServices(bookingStorage.getServices());
    }, []);

    const submitReview = () => {
        if (!selectedAppt) return;
        const newReview: Review = {
            id: Date.now().toString(),
            appointmentId: selectedAppt.id,
            staffId: selectedAppt.staffId,
            serviceId: selectedAppt.serviceId,
            customerName: selectedAppt.customerName,
            rating,
            comment,
            createdAt: moment().toISOString(),
        };
        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        bookingStorage.saveReviews(updatedReviews);
        setIsReviewModalVisible(false);
        message.success('Gửi đánh giá thành công');
    };

    const submitReply = () => {
        if (!selectedReview) return;
        const updatedReviews = reviews.map(r => r.id === selectedReview.id ? { ...r, staffReply: reply } : r);
        setReviews(updatedReviews);
        bookingStorage.saveReviews(updatedReviews);
        setIsReplyModalVisible(false);
        message.success('Đã gửi phản hồi');
    };

    const columns = [
        {
            title: 'Khách hàng',
            dataIndex: 'customerName',
            key: 'customer',
        },
        {
            title: 'Dịch vụ & Nhân viên',
            key: 'details',
            render: (_: any, record: Review) => (
                <div>
                    <div>{services.find(s => s.id === record.serviceId)?.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>NV: {staffList.find(s => s.id === record.staffId)?.fullName}</div>
                </div>
            )
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (r: number) => <Rate disabled defaultValue={r} />
        },
        {
            title: 'Nội dung',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: 'Phản hồi của NV',
            key: 'reply',
            render: (_: any, record: Review) => (
                record.staffReply ? (
                    <div style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>
                        {record.staffReply}
                    </div>
                ) : (
                    <Button type="link" size="small" onClick={() => {
                        setSelectedReview(record);
                        setReply('');
                        setIsReplyModalVisible(true);
                    }}>Trả lời</Button>
                )
            )
        }
    ];

    // Appointments ready for review (Completed and not yet reviewed)
    const pendingReviews = appointments.filter(a => 
        a.status === 'Hoàn thành' && !reviews.some(r => r.appointmentId === a.id)
    );

    return (
        <PageContainer title="Quản lý đánh giá">
            {pendingReviews.length > 0 && (
                <Card title="Lịch hẹn chờ đánh giá" style={{ marginBottom: 16 }}>
                    <Table 
                        dataSource={pendingReviews} 
                        rowKey="id"
                        pagination={false}
                        columns={[
                            { title: 'Khách hàng', dataIndex: 'customerName' },
                            { title: 'Dịch vụ', render: (_, r) => services.find(s => s.id === r.serviceId)?.name },
                            { 
                                title: 'Hành động', 
                                render: (_, r) => (
                                    <Button type="primary" size="small" onClick={() => {
                                        setSelectedAppt(r);
                                        setRating(5);
                                        setComment('');
                                        setIsReviewModalVisible(true);
                                    }}>Viết đánh giá</Button>
                                ) 
                            }
                        ]}
                    />
                </Card>
            )}

            <Card title="Tất cả đánh giá">
                <Table dataSource={reviews} columns={columns} rowKey="id" />
            </Card>

            <Modal
                title="Viết đánh giá"
                visible={isReviewModalVisible}
                onCancel={() => setIsReviewModalVisible(false)}
                onOk={submitReview}
            >
                <div style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 8 }}>Mức độ hài lòng:</div>
                    <Rate value={rating} onChange={setRating} />
                </div>
                <div>
                    <div style={{ marginBottom: 8 }}>Nhận xét:</div>
                    <Input.TextArea rows={4} value={comment} onChange={e => setComment(e.target.value)} placeholder="Hãy chia sẻ trải nghiệm của bạn..." />
                </div>
            </Modal>

            <Modal
                title="Phản hồi khách hàng"
                visible={isReplyModalVisible}
                onCancel={() => setIsReplyModalVisible(false)}
                onOk={submitReply}
            >
                <Input.TextArea rows={4} value={reply} onChange={e => setReply(e.target.value)} placeholder="Cảm ơn quý khách đã tin dùng dịch vụ..." />
            </Modal>
        </PageContainer>
    );
};

export default Reviews;
