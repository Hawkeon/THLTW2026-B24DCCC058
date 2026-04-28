import { useState, useEffect } from 'react';
import { makeId } from '@/utils/utils';

export default () => {
	const [data, setData] = useState<Fitness.HealthRecord[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [editingRecord, setEditingRecord] = useState<Fitness.HealthRecord | null>(null);

	const getData = () => {
		const localData = localStorage.getItem('fitness_health');
		if (localData) {
			setData(JSON.parse(localData));
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const saveData = (newData: Fitness.HealthRecord[]) => {
		setData(newData);
		localStorage.setItem('fitness_health', JSON.stringify(newData));
	};

	const calculateBMI = (weight: number, heightCm: number) => {
		const heightM = heightCm / 100;
		return Number((weight / (heightM * heightM)).toFixed(1));
	};

	const addRecord = (values: Omit<Fitness.HealthRecord, 'id' | 'bmi'>) => {
		const bmi = calculateBMI(values.weight, values.height);
		const newRecord = { ...values, id: makeId(10), bmi };
		saveData([newRecord, ...data]);
	};

	const updateRecord = (id: string, values: Omit<Fitness.HealthRecord, 'id' | 'bmi'>) => {
		const bmi = calculateBMI(values.weight, values.height);
		const newData = data.map((item) => (item.id === id ? { ...values, id, bmi } : item));
		saveData(newData);
	};

	const deleteRecord = (id: string) => {
		const newData = data.filter((item) => item.id !== id);
		saveData(newData);
	};

	return {
		data,
		visible,
		setVisible,
		editingRecord,
		setEditingRecord,
		addRecord,
		updateRecord,
		deleteRecord,
		getData,
	};
};
