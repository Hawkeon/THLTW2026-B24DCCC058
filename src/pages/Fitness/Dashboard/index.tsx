import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Timeline, Typography, Empty } from 'antd';
import { useModel } from 'umi';
import { FireOutlined, ThunderboltOutlined, TrophyOutlined, HistoryOutlined } from '@ant-design/icons';
import moment from 'moment';
import ColumnChart from '@/components/Chart/ColumnChart';
import LineChart from '@/components/Chart/LineChart';
import './style.less';

const { Title, Text } = Typography;

const FitnessDashboard: React.FC = () => {
	const { data: workouts, calculateStreak } = useModel('workout');
	const { data: healthRecords } = useModel('health');
	const { data: goals } = useModel('goal');

	const stats = useMemo(() => {
		const now = moment();
		const currentMonthWorkouts = workouts.filter((w) => moment(w.date).isSame(now, 'month'));
		const totalCalories = currentMonthWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);
		const streak = calculateStreak();
		
		const completedGoals = goals.filter(g => g.status === 'Completed').length;
		const totalGoals = goals.length;
		const goalPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

		return {
			monthWorkouts: currentMonthWorkouts.length,
			calories: totalCalories,
			streak,
			goalPercentage,
		};
	}, [workouts, goals, calculateStreak]);

	const workoutChartData = useMemo(() => {
		const now = moment();
		const weeks: Record<string, number> = {};
		workouts.filter(w => moment(w.date).isSame(now, 'month')).forEach(w => {
			const weekNum = moment(w.date).week();
			const weekLabel = `Tuần ${weekNum - moment(now).startOf('month').week() + 1}`;
			weeks[weekLabel] = (weeks[weekLabel] || 0) + 1;
		});

		const labels = Object.keys(weeks).sort();
		const values = labels.map(label => weeks[label]);

		return {
			xAxis: labels,
			yAxis: [values],
			yLabel: ['Buổi tập'],
		};
	}, [workouts]);

	const weightChartData = useMemo(() => {
		const sortedRecords = [...healthRecords].sort((a, b) => moment(a.date).diff(moment(b.date)));
		const labels = sortedRecords.map(r => moment(r.date).format('DD/MM'));
		const values = sortedRecords.map(r => r.weight);

		return {
			xAxis: labels,
			yAxis: [values],
			yLabel: ['Cân nặng (kg)'],
		};
	}, [healthRecords]);

	const recentWorkouts = useMemo(() => {
		return [...workouts]
			.sort((a, b) => moment(b.date).diff(moment(a.date)))
			.slice(0, 5);
	}, [workouts]);

	return (
		<div className='fitness-dashboard'>
			<Row gutter={[16, 16]} className='stat-cards'>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="Buổi tập (Tháng này)"
							value={stats.monthWorkouts}
							prefix={<ThunderboltOutlined style={{ color: '#1890ff' }} />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="Calo đã đốt"
							value={stats.calories}
							suffix="kcal"
							prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="Chuỗi tập luyện (Streak)"
							value={stats.streak}
							suffix="ngày"
							prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card>
						<Statistic
							title="Hoàn thành mục tiêu"
							value={stats.goalPercentage}
							suffix="%"
							prefix={<HistoryOutlined style={{ color: '#52c41a' }} />}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={16}>
					<Row gutter={[0, 16]}>
						<Col span={24}>
							<Card title="Số buổi tập theo tuần (Tháng này)">
								<div style={{ height: 300 }}>
									{workoutChartData.xAxis.length > 0 ? (
										<ColumnChart {...workoutChartData} height={300} formatY={(val) => `${val}`} />
									) : (
										<Empty description="Chưa có dữ liệu tập luyện tháng này" />
									)}
								</div>
							</Card>
						</Col>
						<Col span={24}>
							<Card title="Thay đổi cân nặng theo thời gian">
								<div style={{ height: 300 }}>
									{weightChartData.xAxis.length > 0 ? (
										<LineChart {...weightChartData} height={300} formatY={(val) => `${val} kg`} />
									) : (
										<Empty description="Chưa có dữ liệu cân nặng" />
									)}
								</div>
							</Card>
						</Col>
					</Row>
				</Col>
				<Col xs={24} lg={8}>
					<Card title="Buổi tập gần đây" className='timeline-container'>
						{recentWorkouts.length > 0 ? (
							<Timeline mode="left">
								{recentWorkouts.map((w) => (
									<Timeline.Item 
										key={w.id} 
										color={w.status === 'Completed' ? 'green' : 'red'}
										label={moment(w.date).format('DD/MM')}
									>
										<Text strong>{w.type}</Text>
										<br />
										<Text type="secondary">{w.duration} phút • {w.calories} kcal</Text>
									</Timeline.Item>
								))}
							</Timeline>
						) : (
							<Empty description="Chưa có buổi tập nào" />
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default FitnessDashboard;
