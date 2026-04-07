import React, { useEffect } from 'react';
import { useModel } from 'umi';
import { Row, Col, Card, Statistic, Typography, Space } from 'antd';
import { BarChartOutlined, LineChartOutlined, TeamOutlined, RiseOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';

const { Title, Text } = Typography;

const StatisticsPage: React.FC = () => {
	const { destinations, itineraries, fetchDestinations, fetchItineraries } = useModel('travel' as any);

	useEffect(() => {
		fetchDestinations();
		fetchItineraries();
	}, [fetchDestinations, fetchItineraries]);

	// Mock Data for Charts based on existing data
	const destinationsCount = destinations.length;
	const itinerariesCount = itineraries.length;
	const totalRevenue = destinations.reduce((prev: number, curr: any) => prev + curr.priceEstimate, 0) * 10; // Mock revenue logic

	const popularDestinationsChart = {
		series: [{
			name: 'Lượt tham quan',
			data: destinations.map((d: any) => Math.floor(Math.random() * 100) + 10)
		}],
		options: {
			chart: { type: 'bar' as const, height: 350 },
			plotOptions: { bar: { borderRadius: 4, horizontal: true } },
			dataLabels: { enabled: false },
			xaxis: { categories: destinations.map((d: any) => d.name) },
			colors: ['#1890ff']
		}
	};

	const revenueByCategory = {
		series: [44, 55, 13, 33],
		options: {
			chart: { type: 'pie' as const },
			labels: ['Ăn uống', 'Di chuyển', 'Lưu trú', 'Khác'],
			responsive: [{
				breakpoint: 480,
				options: {
					chart: { width: 200 },
					legend: { position: 'bottom' }
				}
			}]
		}
	};

	const travelTrendsLine = {
		series: [{
			name: 'Lịch trình mới',
			data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
		}],
		options: {
			chart: { height: 350, type: 'line' as const, zoom: { enabled: false } },
			dataLabels: { enabled: false },
			stroke: { curve: 'smooth' as const },
			title: { text: 'Xu hướng tạo lịch trình mới theo tháng', align: 'left' as const },
			grid: { row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 } },
			xaxis: { categories: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9'] }
		}
	};

	return (
		<div style={{ padding: '24px' }}>
			<Title level={3}><BarChartOutlined /> Thống kê & Báo cáo</Title>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={8}>
					<Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
						<Statistic
							title="Tổng số điểm đến"
							value={destinationsCount}
							prefix={<TeamOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
						<Statistic
							title="Lịch trình đã tạo"
							value={itinerariesCount}
							prefix={<RiseOutlined />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
						<Statistic
							title="Doanh thu ước tính (VNĐ)"
							value={totalRevenue}
							precision={0}
							prefix={<LineChartOutlined />}
							valueStyle={{ color: '#f5222d' }}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={14}>
					<Card title="Điểm đến phổ biến nhất" bordered={false} style={{ borderRadius: 12 }}>
						<ReactApexChart
							options={popularDestinationsChart.options}
							series={popularDestinationsChart.series}
							type="bar"
							height={350}
						/>
					</Card>
				</Col>
				<Col xs={24} lg={10}>
					<Card title="Doanh thu theo hạng mục" bordered={false} style={{ borderRadius: 12 }}>
						<ReactApexChart
							options={revenueByCategory.options}
							series={revenueByCategory.series}
							type="pie"
							height={350}
						/>
					</Card>
				</Col>
				<Col span={24}>
					<Card bordered={false} style={{ borderRadius: 12 }}>
						<ReactApexChart
							options={travelTrendsLine.options}
							series={travelTrendsLine.series}
							type="line"
							height={350}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default StatisticsPage;
