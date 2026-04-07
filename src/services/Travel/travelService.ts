export namespace TravelPlanning {
	export interface Destination {
		destinationId: string;
		name: string;
		image: string;
		type: 'biển' | 'núi' | 'thành phố';
		priceEstimate: number;
		rating: number;
		description: string;
		visitDuration: number; // in hours
		costFood: number;
		costTransport: number;
		costAccommodation: number;
	}

	export interface PlanItem {
		id: string; // unique for DND
		destinationId: string;
		day: number;
	}

	export interface Itinerary {
		id: string;
		name: string;
		totalBudget: number;
		maxBudget: number;
		items: PlanItem[];
		createdAt: string;
	}

	export interface BudgetDistribution {
		food: number;
		transport: number;
		accommodation: number;
		other: number;
	}
}

const STORAGE_KEYS = {
	DESTINATIONS: 'tp_destinations',
	ITINERARIES: 'tp_itineraries',
	CURRENT_PLAN_ID: 'tp_current_plan_id',
};

const getFromStorage = <T>(key: string, defaultValue: T): T => {
	const data = localStorage.getItem(key);
	if (!data) return defaultValue;
	try {
		return JSON.parse(data);
	} catch (e) {
		return defaultValue;
	}
};

const saveToStorage = <T>(key: string, data: T) => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const travelService = {
	// Destinations
	getDestinations: (): TravelPlanning.Destination[] => getFromStorage(STORAGE_KEYS.DESTINATIONS, []),
	saveDestinations: (destinations: TravelPlanning.Destination[]) => saveToStorage(STORAGE_KEYS.DESTINATIONS, destinations),

	// Itineraries
	getItineraries: (): TravelPlanning.Itinerary[] => getFromStorage(STORAGE_KEYS.ITINERARIES, []),
	saveItineraries: (itineraries: TravelPlanning.Itinerary[]) => saveToStorage(STORAGE_KEYS.ITINERARIES, itineraries),

	// Seed data
	seedIfEmpty: () => {
		const destinations = travelService.getDestinations();
		const currentVersion = localStorage.getItem('tp_data_version');

		if (destinations.length === 0 || currentVersion !== '4') {
			const initialDestinations: TravelPlanning.Destination[] = [
				{
					destinationId: 'd1',
					name: 'Sa Pa - Thung Lũng Mường Hoa',
					image: 'https://images.unsplash.com/photo-1649530928914-c2df337e3007?auto=format&fit=crop&w=1200&q=80',
					type: 'núi',
					priceEstimate: 3500000,
					rating: 4.9,
					description: 'Chiêm ngưỡng những thửa ruộng bậc thang hùng vĩ tại thung lũng Mường Hoa - trái tim của vùng cao Sa Pa.',
					visitDuration: 72,
					costFood: 1000000,
					costTransport: 800000,
					costAccommodation: 1700000,
				},
				{
					destinationId: 'd2',
					name: 'Phố Cổ Hội An',
					image: 'https://images.unsplash.com/photo-1682135604357-f64f7311e5c2?auto=format&fit=crop&w=1200&q=80',
					type: 'thành phố',
					priceEstimate: 2800000,
					rating: 4.8,
					description: 'Biểu tượng di sản với những ngôi nhà vàng cổ kính và ánh đèn lồng rực rỡ bên dòng sông thơ mộng.',
					visitDuration: 48,
					costFood: 900000,
					costTransport: 400000,
					costAccommodation: 1500000,
				},
				{
					destinationId: 'd3',
					name: 'Quần Thể Tràng An - Ninh Bình',
					image: 'https://images.unsplash.com/photo-1702885967055-879bff3d8eba?auto=format&fit=crop&w=1200&q=80',
					type: 'núi',
					priceEstimate: 2500000,
					rating: 4.7,
					description: 'Trải nghiệm du thuyền trên dòng sông Sào Khê, xuyên qua những hang động kỳ vĩ giữa lòng di sản thế giới.',
					visitDuration: 24,
					costFood: 700000,
					costTransport: 600000,
					costAccommodation: 1200000,
				},
				{
					destinationId: 'd4',
					name: 'Đồi Cát Bàu Trắng - Mũi Né',
					image: 'https://images.unsplash.com/photo-1735786115754-81080b6f738f?auto=format&fit=crop&w=1200&q=80',
					type: 'biển',
					priceEstimate: 4200000,
					rating: 4.6,
					description: 'Khám phá "tiểu sa mạc" trắng xóa với những hồ sen bao la và trải nghiệm xe Jeep trên cát đầy phấn khích.',
					visitDuration: 48,
					costFood: 1200000,
					costTransport: 1000000,
					costAccommodation: 2000000,
				},
				{
					destinationId: 'd5',
					name: 'Vịnh Lăng Cô - Hải Vân Quan',
					image: 'https://images.unsplash.com/photo-1528606589862-7d68b7e3c95a?auto=format&fit=crop&w=1200&q=80',
					type: 'biển',
					priceEstimate: 3800000,
					rating: 4.8,
					description: 'Chiêm ngưỡng toàn cảnh vịnh biển đẹp nhất thế giới từ đỉnh đèo Hải Vân hùng vĩ.',
					visitDuration: 36,
					costFood: 900000,
					costTransport: 700000,
					costAccommodation: 2200000,
				},
				{
					destinationId: 'd6',
					name: 'Hồ Hoàn Kiếm - Hà Nội',
					image: 'https://images.unsplash.com/photo-1763218412689-7140df124269?auto=format&fit=crop&w=1200&q=80',
					type: 'thành phố',
					priceEstimate: 2500000,
					rating: 4.6,
					description: 'Biểu tượng ngàn năm văn hiến với Tháp Rùa cổ kính và đền Ngọc Sơn giữa lòng thủ đô.',
					visitDuration: 48,
					costFood: 700000,
					costTransport: 300000,
					costAccommodation: 1200000,
				},
				{
					destinationId: 'd7',
					name: 'Hồ Tuyền Lâm - Đà Lạt',
					image: 'https://images.unsplash.com/photo-1687930353766-381b7ba4ec6b?auto=format&fit=crop&w=1200&q=80',
					type: 'núi',
					priceEstimate: 2000000,
					rating: 4.5,
					description: 'Vẻ đẹp mộng mơ của hồ nước lớn nhất Đà Lạt ẩn mình giữa rừng thông xanh ngắt và sương mù bao quanh.',
					visitDuration: 72,
					costFood: 600000,
					costTransport: 400000,
					costAccommodation: 1000000,
				},
				{
					destinationId: 'd8',
					name: 'Bãi Sao - Phú Quốc',
					image: 'https://images.unsplash.com/photo-1730270567793-9903004e0f15?auto=format&fit=crop&w=1200&q=80',
					type: 'biển',
					priceEstimate: 4500000,
					rating: 4.9,
					description: 'Đắm mình trong làn nước trong vắt và bãi cát trắng mịn màng tại bãi biển đẹp nhất đảo ngọc.',
					visitDuration: 96,
					costFood: 1200000,
					costTransport: 800000,
					costAccommodation: 2500000,
				},
			];
			travelService.saveDestinations(initialDestinations);
			localStorage.setItem('tp_data_version', '4');
		}

		if (travelService.getItineraries().length === 0 || localStorage.getItem('tp_itineraries_version') !== '2') {
			const initialItinerary: TravelPlanning.Itinerary = {
				id: 'i1',
				name: 'Hành trình Khám phá Việt Nam',
				totalBudget: 0,
				maxBudget: 15000000,
				items: [
					{ id: 'item1', destinationId: 'd1', day: 1 },
					{ id: 'item2', destinationId: 'd2', day: 2 },
					{ id: 'item3', destinationId: 'd3', day: 3 },
				],
				createdAt: new Date().toISOString(),
			};
			travelService.saveItineraries([initialItinerary]);
			localStorage.setItem('tp_itineraries_version', '2');
		}
	},
};
