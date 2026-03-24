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
	{
		name: 'Quản lý văn bằng',
		path: '/quan-ly-van-bang',
		icon: 'ReadOutlined',
		routes: [
			{
				name: 'Sổ văn bằng',
				path: 'so-van-bang',
				component: './DiplomaManagement/RegistryList',
			},
			{
				name: 'Quyết định tốt nghiệp',
				path: 'quyet-dinh',
				component: './DiplomaManagement/DecisionList',
			},
			{
				name: 'Cấu hình biểu mẫu',
				path: 'cau-hinh',
				component: './DiplomaManagement/TemplateConfig',
			},
			{
				name: 'Thông tin văn bằng',
				path: 'thong-tin',
				component: './DiplomaManagement/DiplomaList',
			},
			{
				name: 'Tra cứu văn bằng',
				path: 'tra-cuu',
				component: './DiplomaManagement/DiplomaLookup',
			},
		],
	},
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
