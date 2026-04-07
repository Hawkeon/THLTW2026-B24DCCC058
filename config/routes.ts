export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/travel-planning',
		name: 'Lập kế hoạch Du lịch',
		icon: 'CompassOutlined',
		routes: [
			{
				path: '/travel-planning/explore',
				name: 'Khám phá Điểm đến',
				component: './Travel/Explore',
			},
			{
				path: '/travel-planning/plan',
				name: 'Lập Lịch trình',
				component: './Travel/Plan',
			},
			{
				path: '/travel-planning/budget',
				name: 'Quản lý Ngân sách',
				component: './Travel/Budget',
			},
			{
				path: '/travel-planning/admin',
				name: 'Quản trị hệ thống',
				routes: [
					{
						path: '/travel-planning/admin/destinations',
						name: 'Quản lý Điểm đến',
						component: './Travel/Admin/DestinationList',
					},
					{
						path: '/travel-planning/admin/statistics',
						name: 'Thống kê & Báo cáo',
						component: './Travel/Admin/Statistics',
					},
				],
			},
		],
	},
	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
