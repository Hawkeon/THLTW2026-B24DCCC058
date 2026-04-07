import React, { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { Row, Col, Input, Select, Slider, Typography, Card, Empty, Space } from 'antd';
import { SearchOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { TravelPlanning } from '@/services/Travel/travelService';
import DestinationCard from '@/components/Travel/DestinationCard';

const { Title, Text } = Typography;
const { Option } = Select;

const ExplorePage: React.FC = () => {
	const { destinations, loading, fetchDestinations } = useModel('travel' as any);
	const [searchText, setSearchText] = useState('');
	const [typeFilter, setTypeFilter] = useState<string>('all');
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
	const [sortBy, setSortBy] = useState<string>('rating');

	useEffect(() => {
		fetchDestinations();
	}, [fetchDestinations]);

	const filteredDestinations = destinations
		.filter((d: TravelPlanning.Destination) => {
			const matchesSearch = d.name.toLowerCase().includes(searchText.toLowerCase());
			const matchesType = typeFilter === 'all' || d.type === typeFilter;
			const matchesPrice = d.priceEstimate >= priceRange[0] && d.priceEstimate <= priceRange[1];
			return matchesSearch && matchesType && matchesPrice;
		})
		.sort((a: TravelPlanning.Destination, b: TravelPlanning.Destination) => {
			if (sortBy === 'rating') return b.rating - a.rating;
			if (sortBy === 'price-low') return a.priceEstimate - b.priceEstimate;
			if (sortBy === 'price-high') return b.priceEstimate - a.priceEstimate;
			return 0;
		});

	return (
		<div className="travel-container">
			<Card className="glass-card" style={{ marginBottom: 24 }}>
				<Row gutter={[16, 16]} align="middle">
					<Col span={24}>
						<Title level={4} className="premium-gradient-text">KHÁM PHÁ ĐIỂM ĐẾN</Title>
					</Col>
					<Col xs={24} md={8}>
						<Input
							placeholder="Tìm kiếm điểm đến..."
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							size="large"
						/>
					</Col>
					<Col xs={12} md={5}>
						<Select
							style={{ width: '100%' }}
							value={typeFilter}
							onChange={setTypeFilter}
							placeholder="Loại hình"
							size="large"
							suffixIcon={<FilterOutlined />}
						>
							<Option value="all">Tất cả loại hình</Option>
							<Option value="biển">Vùng biển</Option>
							<Option value="núi">Vùng núi</Option>
							<Option value="thành phố">Thành phố</Option>
						</Select>
					</Col>
					<Col xs={12} md={5}>
						<Select
							style={{ width: '100%' }}
							value={sortBy}
							onChange={setSortBy}
							placeholder="Sắp xếp"
							size="large"
							suffixIcon={<SortAscendingOutlined />}
						>
							<Option value="rating">Đánh giá cao nhất</Option>
							<Option value="price-low">Giá thấp đến cao</Option>
							<Option value="price-high">Giá cao đến thấp</Option>
						</Select>
					</Col>
					<Col xs={24} md={6}>
						<Space direction="vertical" style={{ width: '100%' }}>
							<Text type="secondary">Khoảng giá (VNĐ)</Text>
							<Slider
								range
								min={0}
								max={10000000}
								step={500000}
								value={priceRange}
								onChange={(val) => setPriceRange(val as [number, number])}
								tipFormatter={(val) => `${val?.toLocaleString()}đ`}
							/>
						</Space>
					</Col>
				</Row>
			</Card>

			{loading ? (
				<Row gutter={[16, 16]}>
					{[1, 2, 3, 4].map((i) => (
						<Col key={i} xs={24} sm={12} lg={8} xl={6}>
							<Card loading />
						</Col>
					))}
				</Row>
			) : filteredDestinations.length > 0 ? (
				<Row gutter={[16, 16]}>
					{filteredDestinations.map((d: TravelPlanning.Destination) => (
						<Col key={d.destinationId} xs={24} sm={12} lg={8} xl={6}>
							<DestinationCard destination={d} />
						</Col>
					))}
				</Row>
			) : (
				<Empty description="Không tìm thấy điểm đến phù hợp" />
			)}
		</div>
	);
};

export default ExplorePage;
