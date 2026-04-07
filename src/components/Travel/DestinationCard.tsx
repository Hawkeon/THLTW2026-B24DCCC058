import React from 'react';
import { Card, Rate, Tag, Typography, Space } from 'antd';
import { TravelPlanning } from '@/services/Travel/travelService';
import { EnvironmentOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface DestinationCardProps {
	destination: TravelPlanning.Destination;
	onClick?: () => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onClick }) => {
	const getTypeColor = (type: string) => {
		switch (type) {
			case 'biển': return 'blue';
			case 'núi': return 'green';
			case 'thành phố': return 'orange';
			default: return 'default';
		}
	};

	return (
		<Card
			hoverable
			className="glass-card"
			cover={
				<div style={{ position: 'relative', overflow: 'hidden' }}>
					<img
						alt={destination.name}
						src={destination.image}
						style={{ height: 240, width: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
						className="destination-img"
					/>
					<div className="destination-image-overlay">
						<Tag color={getTypeColor(destination.type)} style={{ marginBottom: 8, border: 'none', backdropFilter: 'blur(4px)' }}>
							{destination.type.toUpperCase()}
						</Tag>
						<Title level={4} style={{ color: 'white', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
							{destination.name}
						</Title>
					</div>
				</div>
			}
			onClick={onClick}
			style={{ marginBottom: 16 }}
		>
			<div style={{ padding: '0 4px' }}>
				<Space direction="vertical" size="small" style={{ width: '100%' }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Rate disabled defaultValue={destination.rating} allowHalf style={{ fontSize: 12 }} />
						<Text strong style={{ color: '#faad14' }}>{destination.rating}</Text>
					</div>
					
					<Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ fontSize: '13px', minHeight: '40px' }}>
						{destination.description}
					</Paragraph>
					
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 }}>
						<div>
							<Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>CHI PHÍ ƯỚC TÍNH</Text>
							<Text strong style={{ color: '#1890ff', fontSize: 18 }}>
								{destination.priceEstimate.toLocaleString()}đ
							</Text>
						</div>
						<Tag icon={<EnvironmentOutlined />} color="default" style={{ borderRadius: 12 }}>
							{destination.visitDuration}h
						</Tag>
					</div>
				</Space>
			</div>
		</Card>
	);
};

const { Title } = Typography;

export default DestinationCard;
