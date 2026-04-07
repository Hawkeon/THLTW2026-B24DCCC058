import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Row, Col, Card, Statistic, Table, Typography, Alert, Space, Progress, List } from 'antd';
import { WalletOutlined, PieChartOutlined, WarningOutlined, DollarOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import { TravelPlanning } from '@/services/Travel/travelService';

const { Title, Text } = Typography;

const BudgetPage: React.FC = () => {
	const { destinations, itineraries, fetchDestinations, fetchItineraries } = useModel('travel' as any);

	useEffect(() => {
		fetchDestinations();
		fetchItineraries();
	}, [fetchDestinations, fetchItineraries]);

	const currentItinerary: TravelPlanning.Itinerary = itineraries[0] || {
		totalBudget: 0,
		maxBudget: 10000000,
		items: [],
	};

	const budgetDistribution = currentItinerary.items.reduce(
		(acc: any, item: TravelPlanning.PlanItem) => {
			const dest = destinations.find((d: any) => d.destinationId === item.destinationId);
			if (dest) {
				acc.food += dest.costFood;
				acc.transport += dest.costTransport;
				acc.accommodation += dest.costAccommodation;
			}
			return acc;
		},
		{ food: 0, transport: 0, accommodation: 0, other: 0 }
	);

	const totalSpent = budgetDistribution.food + budgetDistribution.transport + budgetDistribution.accommodation + budgetDistribution.other;
	const isExceeded = totalSpent > currentItinerary.maxBudget;

	const chartData = {
		series: [budgetDistribution.food, budgetDistribution.transport, budgetDistribution.accommodation, budgetDistribution.other],
		options: {
			labels: ['Ăn uống', 'Di chuyển', 'Lưu trú', 'Khác'],
			colors: ['#ff4d4f', '#1890ff', '#52c41a', '#faad14'],
			legend: { position: 'bottom' as const },
			tooltip: {
				y: {
					formatter: (val: number) => `${val.toLocaleString()}đ`
				}
			},
			responsive: [{
				breakpoint: 480,
				options: {
					chart: { width: 300 },
					legend: { position: 'bottom' }
				}
			}]
		}
	};

	const tableData = [
		{ key: 'food', category: 'Ăn uống', amount: budgetDistribution.food, percent: totalSpent ? Math.round(budgetDistribution.food / totalSpent * 100) : 0 },
		{ key: 'transport', category: 'Di chuyển', amount: budgetDistribution.transport, percent: totalSpent ? Math.round(budgetDistribution.transport / totalSpent * 100) : 0 },
		{ key: 'accommodation', category: 'Lưu trú', amount: budgetDistribution.accommodation, percent: totalSpent ? Math.round(budgetDistribution.accommodation / totalSpent * 100) : 0 },
		{ key: 'other', category: 'Khác', amount: budgetDistribution.other, percent: totalSpent ? Math.round(budgetDistribution.other / totalSpent * 100) : 0 },
	];

	return (
		<div className="travel-container">
			<Title level={3} className="premium-gradient-text"><WalletOutlined /> QUẢN LÝ NGÂN SÁCH</Title>
			
			<Row gutter={[24, 24]}>
				<Col xs={24} md={12} lg={8}>
					<Card className="glass-card">
						<Statistic
							title="Tổng chi phí"
							value={totalSpent}
							suffix="đ"
							valueStyle={{ color: isExceeded ? '#cf1322' : '#3f8600', fontWeight: 700 }}
							prefix={<DollarOutlined />}
						/>
					</Card>
				</Col>
				<Col xs={24} md={12} lg={8}>
					<Card className="glass-card">
						<Statistic
							title="Ngân sách dự kiến"
							value={currentItinerary.maxBudget}
							suffix="đ"
							prefix={<WalletOutlined />}
							valueStyle={{ fontWeight: 700 }}
						/>
					</Card>
				</Col>
				<Col xs={24} lg={8}>
					<Card className="glass-card">
						<Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Mức độ chi tiêu</Text>
						<Progress
							percent={Math.min(100, Math.round((totalSpent / currentItinerary.maxBudget) * 100))}
							status={isExceeded ? 'exception' : 'active'}
							strokeColor={isExceeded ? '#ff4d4f' : '#1890ff'}
							strokeWidth={12}
						/>
					</Card>
				</Col>

				{isExceeded && (
					<Col span={24}>
						<Alert
							message="Cảnh báo chi phí!"
							description={`Bạn hiện đã vượt ngân sách ${ (totalSpent - currentItinerary.maxBudget).toLocaleString() }đ. Hãy cân nhắc giảm số lượng điểm đến hoặc chọn các lựa chọn tiết kiệm hơn.`}
							type="error"
							showIcon
							icon={<WarningOutlined />}
							closable
						/>
					</Col>
				)}

				<Col xs={24} lg={14}>
					<Card title={<Space className="premium-gradient-text"><PieChartOutlined /> PHÂN BỔ CHI PHÍ</Space>} className="glass-card">
						<Row align="middle">
							<Col xs={24} md={10}>
								<ReactApexChart
									options={chartData.options}
									series={chartData.series}
									type="pie"
									height={350}
								/>
							</Col>
							<Col xs={24} md={14}>
								<Table
									dataSource={tableData}
									columns={[
										{ title: 'Hạng mục', dataIndex: 'category', key: 'category' },
										{ title: 'Số tiền', dataIndex: 'amount', key: 'amount', render: (val) => `${val.toLocaleString()}đ` },
										{ title: 'Tỷ lệ', dataIndex: 'percent', key: 'percent', render: (val) => `${val}%` },
									]}
									pagination={false}
								/>
							</Col>
						</Row>
					</Card>
				</Col>

				<Col xs={24} lg={10}>
					<Card title={<span className="premium-gradient-text">GỢI Ý TIẾT KIỆM</span>} className="glass-card">
						<List
							itemLayout="horizontal"
							dataSource={[
								{ title: 'Lưu trú', desc: 'Chọn hostel hoặc homestay thay vì khách sạn 4-5 sao.' },
								{ title: 'Di chuyển', desc: 'Sử dụng phương tiện công cộng (xe buýt, tàu hỏa) thay vì taxi/máy bay.' },
								{ title: 'Ăn uống', desc: 'Khám phá ẩm thực đường phố, quán ăn địa phương.' }
							]}
							renderItem={item => (
								<List.Item>
									<List.Item.Meta
										title={<Text strong>{item.title}</Text>}
										description={item.desc}
									/>
								</List.Item>
							)}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default BudgetPage;
