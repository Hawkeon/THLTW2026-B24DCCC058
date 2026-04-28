declare namespace Fitness {
	export interface Workout {
		id: string;
		date: string;
		type: 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
		duration: number; // minutes
		calories: number;
		notes?: string;
		status: 'Completed' | 'Missed';
	}

	export interface HealthRecord {
		id: string;
		date: string;
		weight: number; // kg
		height: number; // cm
		bmi: number;
		heartRate: number; // bpm
		sleepHours: number;
	}

	export interface Goal {
		id: string;
		name: string;
		type: 'Weight loss' | 'Muscle gain' | 'Endurance' | 'Other';
		targetValue: number;
		currentValue: number;
		deadline: string;
		status: 'In progress' | 'Completed' | 'Cancelled';
	}

	export interface Exercise {
		id: string;
		name: string;
		muscleGroup: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
		difficulty: 'Easy' | 'Medium' | 'Hard';
		description: string;
		detailedInstructions?: string;
		caloriesPerHour: number;
	}
}
