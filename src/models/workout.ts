import { useState, useEffect } from 'react';
import { makeId } from '@/utils/utils';
import moment from 'moment';

export default () => {
	const [data, setData] = useState<Fitness.Workout[]>([]);
	const [visible, setVisible] = useState<boolean>(false);
	const [editingRecord, setEditingRecord] = useState<Fitness.Workout | null>(null);

	const getData = () => {
		const localData = localStorage.getItem('fitness_workouts');
		if (localData) {
			setData(JSON.parse(localData));
		}
	};

	useEffect(() => {
		getData();
	}, []);

	const saveData = (newData: Fitness.Workout[]) => {
		setData(newData);
		localStorage.setItem('fitness_workouts', JSON.stringify(newData));
	};

	const addWorkout = (values: Omit<Fitness.Workout, 'id'>) => {
		const newWorkout = { ...values, id: makeId(10) };
		saveData([newWorkout, ...data]);
	};

	const updateWorkout = (id: string, values: Omit<Fitness.Workout, 'id'>) => {
		const newData = data.map((item) => (item.id === id ? { ...values, id } : item));
		saveData(newData);
	};

	const deleteWorkout = (id: string) => {
		const newData = data.filter((item) => item.id !== id);
		saveData(newData);
	};

	const calculateStreak = () => {
		if (data.length === 0) return 0;
		const sortedWorkouts = [...data]
			.filter((w) => w.status === 'Completed')
			.sort((a, b) => moment(b.date).diff(moment(a.date)));

		if (sortedWorkouts.length === 0) return 0;

		let streak = 0;
		let currentDate = moment().startOf('day');

		// Check if there was a workout today or yesterday to continue the streak
		const lastWorkoutDate = moment(sortedWorkouts[0].date).startOf('day');
		if (currentDate.diff(lastWorkoutDate, 'days') > 1) {
			return 0;
		}

		let checkDate = lastWorkoutDate;
		let i = 0;

		while (i < sortedWorkouts.length) {
			const workoutDate = moment(sortedWorkouts[i].date).startOf('day');
			if (workoutDate.isSame(checkDate, 'day')) {
				streak++;
				checkDate = checkDate.subtract(1, 'days');
				// Skip other workouts on the same day
				while (i < sortedWorkouts.length && moment(sortedWorkouts[i].date).isSame(workoutDate, 'day')) {
					i++;
				}
			} else {
				break;
			}
		}

		return streak;
	};

	return {
		data,
		visible,
		setVisible,
		editingRecord,
		setEditingRecord,
		addWorkout,
		updateWorkout,
		deleteWorkout,
		calculateStreak,
		getData,
	};
};
