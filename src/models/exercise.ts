import { useState, useEffect } from 'react';
import { makeId } from '@/utils/utils';

const defaultExercises: Fitness.Exercise[] = [
	{
		id: '1',
		name: 'Hít đất (Push-up)',
		muscleGroup: 'Chest',
		difficulty: 'Medium',
		description: 'Bài tập cơ bản giúp phát triển cơ ngực, vai và bắp tay sau.',
		detailedInstructions: '1. Đặt hai tay rộng bằng vai trên sàn.\n2. Giữ chân thẳng và cơ thể tạo thành một đường thẳng.\n3. Hạ thấp người cho đến khi ngực gần chạm sàn.\n4. Đẩy người trở lại vị trí bắt đầu.',
		caloriesPerHour: 400,
	},
	{
		id: '2',
		name: 'Squat',
		muscleGroup: 'Legs',
		difficulty: 'Easy',
		description: 'Bài tập cơ bản cho phần thân dưới, giúp đùi và mông săn chắc.',
		detailedInstructions: '1. Đứng thẳng, chân rộng bằng vai.\n2. Hạ hông xuống như đang ngồi vào một chiếc ghế.\n3. Giữ lưng thẳng và ngực hướng về phía trước.\n4. Đẩy người đứng dậy bằng gót chân.',
		caloriesPerHour: 500,
	},
	{
		id: '3',
		name: 'Plank',
		muscleGroup: 'Core',
		difficulty: 'Medium',
		description: 'Bài tập giữ tư thế giúp tăng cường sức bền cho cơ bụng và lõi.',
		detailedInstructions: '1. Chống khuỷu tay xuống sàn trong tư thế hít đất.\n2. Giữ cơ thể thẳng từ đầu đến gót chân.\n3. Siết chặt cơ bụng và giữ tư thế lâu nhất có thể.',
		caloriesPerHour: 200,
	},
	{
		id: '4',
		name: 'Hít xà (Pull-up)',
		muscleGroup: 'Back',
		difficulty: 'Hard',
		description: 'Bài tập nâng cao giúp phát triển cơ lưng và bắp tay.',
		detailedInstructions: '1. Nắm lấy xà đơn với lòng bàn tay hướng về phía trước.\n2. Kéo người lên cho đến khi cằm vượt qua thanh xà.\n3. Hạ người xuống một cách chậm rãi có kiểm soát.',
		caloriesPerHour: 450,
	},
];

export default () => {
	const [data, setData] = useState<Fitness.Exercise[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [editingRecord, setEditingRecord] = useState<Fitness.Exercise | null>(null);

	const getData = () => {
		const localData = localStorage.getItem('fitness_exercises');
		if (localData) {
			setData(JSON.parse(localData));
		} else {
			setData(defaultExercises);
			localStorage.setItem('fitness_exercises', JSON.stringify(defaultExercises));
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const saveData = (newData: Fitness.Exercise[]) => {
		setData(newData);
		localStorage.setItem('fitness_exercises', JSON.stringify(newData));
	};

	const addExercise = (values: Omit<Fitness.Exercise, 'id'>) => {
		const newExercise = { ...values, id: makeId(10) };
		saveData([newExercise, ...data]);
	};

	const updateExercise = (id: string, values: Omit<Fitness.Exercise, 'id'>) => {
		const newData = data.map((item) => (item.id === id ? { ...values, id } : item));
		saveData(newData);
	};

	const deleteExercise = (id: string) => {
		const newData = data.filter((item) => item.id !== id);
		saveData(newData);
	};

	return {
		data,
		visible,
		setVisible,
		editingRecord,
		setEditingRecord,
		addExercise,
		updateExercise,
		deleteExercise,
		getData,
	};
};
