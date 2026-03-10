import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import CategoryTab from './components/CategoryTab';
import SubjectTab from './components/SubjectTab';
import QuestionTab from './components/QuestionTab';
import ExamTab from './components/ExamTab';

const { TabPane } = Tabs;

const QuestionBank: React.FC = () => {
    return (
        <PageContainer title="Hệ thống Ngân hàng Câu hỏi Tự luận">
            <Card bordered={false}>
                <Tabs defaultActiveKey="categories">
                    <TabPane tab="Danh mục kiến thức" key="categories">
                        <CategoryTab />
                    </TabPane>
                    <TabPane tab="Môn học" key="subjects">
                        <SubjectTab />
                    </TabPane>
                    <TabPane tab="Ngân hàng câu hỏi" key="questions">
                        <QuestionTab />
                    </TabPane>
                    <TabPane tab="Quản lý đề thi" key="exams">
                        <ExamTab />
                    </TabPane>
                </Tabs>
            </Card>
        </PageContainer>
    );
};

export default QuestionBank;
