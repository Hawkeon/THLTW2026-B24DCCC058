import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Row, Col, Card, Button, Typography, Modal, List, Tag, Space, Empty, message, Alert, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, ScheduleOutlined, DollarCircleOutlined, ClockCircleOutlined, DragOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TravelPlanning } from '@/services/Travel/travelService';

const { Title, Text } = Typography;
const { Option } = Select;

const PlanPage: React.FC = () => {
	const { destinations, itineraries, loading, saveItineraries, fetchDestinations, fetchItineraries } = useModel('travel' as any);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [activeDay, setActiveDay] = useState<number>(1);

	useEffect(() => {
		fetchDestinations();
		fetchItineraries();
	}, [fetchDestinations, fetchItineraries]);

	const currentItinerary: TravelPlanning.Itinerary = itineraries[0] || {
		id: 'default',
		name: 'Lịch trình mới',
		items: [],
		totalBudget: 0,
		maxBudget: 10000000,
	};

	const itemsByDay = Array.from({ length: 5 }, (_, i) => ({
		day: i + 1,
		items: currentItinerary.items.filter((item: TravelPlanning.PlanItem) => item.day === i + 1),
	}));

	const totals = currentItinerary.items.reduce(
		(acc: any, item: TravelPlanning.PlanItem) => {
			const dest = destinations.find((d: any) => d.destinationId === item.destinationId);
			if (dest) {
				acc.cost += dest.priceEstimate;
				acc.time += dest.visitDuration;
			}
			return acc;
		},
		{ cost: 0, time: 0 }
	);

	const onDragEnd = (result: any) => {
		if (!result.destination) return;

		const { source, destination } = result;
		const updatedItems = [...currentItinerary.items];
		
		// Map droppableId back to day number
		const sourceDay = parseInt(source.droppableId.split('-')[1]);
		const destDay = parseInt(destination.droppableId.split('-')[1]);

		// Find the item being moved
		const sourceDayItems = updatedItems.filter(i => i.day === sourceDay);
		const movedItem = sourceDayItems[source.index];

		// If moving to a different day, update its day property
		if (sourceDay !== destDay) {
			movedItem.day = destDay;
		}

		// Reorder all items globally preserving day order and then index within day
		// This is a simplified approach for DND within/across lists
		const otherDayItems = updatedItems.filter(i => i.day !== sourceDay && i.day !== destDay);
		const updatedSourceDayItems = sourceDayItems.filter((_, idx) => idx !== source.index);
		
		let updatedDestDayItems;
		if (sourceDay === destDay) {
			updatedDestDayItems = updatedSourceDayItems;
			updatedDestDayItems.splice(destination.index, 0, movedItem);
		} else {
			updatedDestDayItems = updatedItems.filter(i => i.day === destDay);
			updatedDestDayItems.splice(destination.index, 0, movedItem);
		}

		const finalItems = [
			...otherDayItems,
			...(sourceDay === destDay ? [] : updatedSourceDayItems),
			...updatedDestDayItems
		];

		const updatedItinerary = { ...currentItinerary, items: finalItems };
		saveItineraries([updatedItinerary]);
	};

	const addItem = (destId: string) => {
		const newItem: TravelPlanning.PlanItem = {
			id: `item-${Date.now()}`,
			destinationId: destId,
			day: activeDay,
		};
		const updatedItinerary = { ...currentItinerary, items: [...currentItinerary.items, newItem] };
		saveItineraries([updatedItinerary]);
		message.success('Đã thêm vào lịch trình');
	};

	const removeItem = (itemId: string) => {
		const updatedItinerary = {
			...currentItinerary,
			items: currentItinerary.items.filter((i: TravelPlanning.PlanItem) => i.id !== itemId),
		};
		saveItineraries([updatedItinerary]);
	};

	return (
		<div className="travel-container">
			<Row gutter={24}>
				<Col xs={24} lg={16}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
						<Title level={3} className="premium-gradient-text">
							<ScheduleOutlined style={{ marginRight: 12 }} />
							KẾ HOẠCH HÀNH TRÌNH
						</Title>
						<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} className="vibrant-btn">
							Thêm điểm đến
						</Button>
					</div>

					<DragDropContext onDragEnd={onDragEnd}>
						{itemsByDay.map((dayGroup) => (
							<Card
								key={dayGroup.day}
								title={<Text strong style={{ color: '#1890ff' }}>NGÀY {dayGroup.day}</Text>}
								className="glass-card"
								style={{ marginBottom: 16 }}
								bodyStyle={{ padding: '12px 24px' }}
							>
								<Droppable droppableId={`day-${dayGroup.day}`}>
									{(provided) => (
										<div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: 40 }}>
											{dayGroup.items.length > 0 ? (
												dayGroup.items.map((item: TravelPlanning.PlanItem, index: number) => {
													const dest = destinations.find((d: any) => d.destinationId === item.destinationId);
													return (
														<Draggable key={item.id} draggableId={item.id} index={index}>
															{(providedDraggable) => (
																<div
																	ref={providedDraggable.innerRef}
																	{...providedDraggable.draggableProps}
																	{...providedDraggable.dragHandleProps}
																	style={{
																		userSelect: 'none',
																		padding: 12,
																		marginBottom: 8,
																		background: '#fff',
																		border: '1px solid #d9d9d9',
																		borderRadius: 8,
																		display: 'flex',
																		justifyContent: 'space-between',
																		alignItems: 'center',
																		...providedDraggable.draggableProps.style,
																	}}
																>
																	<div style={{ display: 'flex', alignItems: 'center' }}>
																		<DragOutlined style={{ marginRight: 12, color: '#bfbfbf' }} />
																		{dest ? (
																			<Space>
																				<img src={dest.image} alt={dest.name} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
																				<div>
																					<Text strong>{dest.name}</Text>
																					<br />
																					<Text type="secondary" style={{ fontSize: 'smaller' }}>{dest.type} • {dest.priceEstimate.toLocaleString()}đ</Text>
																				</div>
																			</Space>
																		) : 'Điểm đến không tồn tại'}
																	</div>
																	<Button
																		type="text"
																		danger
																		icon={<DeleteOutlined />}
																		onClick={() => removeItem(item.id)}
																	/>
																</div>
															)}
														</Draggable>
													);
												})
											) : (
												<Empty description="Kéo thả điểm đến vào đây" image={Empty.PRESENTED_IMAGE_SIMPLE} />
											)}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</Card>
						))}
					</DragDropContext>
				</Col>

				<Col xs={24} lg={8}>
					<Card title={<span className="premium-gradient-text">TỔNG QUAN NGÂN SÁCH</span>} className="glass-card" style={{ marginBottom: 24, borderTop: '4px solid #1890ff' }}>
						<Space direction="vertical" style={{ width: '100%' }}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<Text type="secondary"><DollarCircleOutlined /> Tổng chi phí ước tính:</Text>
								<Text strong style={{ color: totals.cost > currentItinerary.maxBudget ? '#cf1322' : '#3f8600' }}>
									{totals.cost.toLocaleString()}đ
								</Text>
							</div>
							<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
								<Text type="secondary"><ClockCircleOutlined /> Tổng thời gian:</Text>
								<Text strong>{totals.time} giờ</Text>
							</div>
							
							{totals.cost > currentItinerary.maxBudget && (
								<Alert
									message="Vượt ngân sách!"
									description="Bạn đã vượt quá ngân sách cho phép. Hãy xem lại lộ trình."
									type="error"
									showIcon
								/>
							)}
							
							<div style={{ marginTop: 12 }}>
								<Text type="secondary">Giới hạn ngân sách:</Text>
								<br />
								<Text strong>{currentItinerary.maxBudget.toLocaleString()}đ</Text>
							</div>
						</Space>
					</Card>
				</Col>
			</Row>

			<Modal
				title="Chọn điểm đến"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
				width={800}
			>
				<List
					loading={loading}
					dataSource={destinations}
					renderItem={(dest: any) => (
						<List.Item
							actions={[
								<Space key="add">
									<span>Thêm vào Ngày:</span>
									<Select value={activeDay} onChange={setActiveDay} style={{ width: 80 }}>
										{[1, 2, 3, 4, 5].map(d => <Option key={d} value={d}>Ngày {d}</Option>)}
									</Select>
									<Button type="link" onClick={() => addItem(dest.destinationId)}>Chọn</Button>
								</Space>
							]}
						>
							<List.Item.Meta
								avatar={<img src={dest.image} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />}
								title={dest.name}
								description={<Tag>{dest.type}</Tag>}
							/>
							<div>{dest.priceEstimate.toLocaleString()}đ</div>
						</List.Item>
					)}
				/>
			</Modal>
		</div>
	);
};

export default PlanPage;
