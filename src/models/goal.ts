import { useState, useEffect } from 'react';
import { makeId } from '@/utils/utils';

export default () => {
	const [data, setData] = useState<Fitness.Goal[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [editingRecord, setEditingRecord] = useState<Fitness.Goal | null>(null);

	const getData = () => {
		const localData = localStorage.getItem('fitness_goals');
		if (localData) {
			setData(JSON.parse(localData));
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const saveData = (newData: Fitness.Goal[]) => {
		setData(newData);
		localStorage.setItem('fitness_goals', JSON.stringify(newData));
	};

	const addGoal = (values: Omit<Fitness.Goal, 'id'>) => {
		const newGoal = { ...values, id: makeId(10) };
		saveData([newGoal, ...data]);
	};

	const updateGoal = (id: string, values: Partial<Fitness.Goal>) => {
		const newData = data.map((item) => (item.id === id ? { ...item, ...values } : item));
		saveData(newData);
	};

	const deleteGoal = (id: string) => {
		const newData = data.filter((item) => item.id !== id);
		saveData(newData);
	};

	return {
		data,
		visible,
		setVisible,
		editingRecord,
		setEditingRecord,
		addGoal,
		updateGoal,
		deleteGoal,
		getData,
	};
};
