import { exercises, type Exercise, type ExerciseId } from './exercises';

type Dose = { reps: number } | { seconds: number };

type Item = Dose & { id: ExerciseId; perSide?: true };

export type Program = {
	id: string;
	title: string;
	description: string;
	warmup: Item[];
	circuit: Item[];
	rounds: number;
	rest: number;
};

export type Step = Dose & { exercise: Exercise; stage: string; side?: string };

export const programs: Program[] = [
	{
		id: 'beginner',
		title: 'Начальная',
		description:
			'Для первых недель. Разминка и два круга из семи простых упражнений, около 20 минут. Когда станет легко, берите гирю тяжелее.',
		warmup: [
			{ id: 'march', seconds: 45 },
			{ id: 'hinge', reps: 10 },
			{ id: 'squat', reps: 10 }
		],
		circuit: [
			{ id: 'deadlift', reps: 10 },
			{ id: 'goblet', reps: 8 },
			{ id: 'row', reps: 8, perSide: true },
			{ id: 'press', reps: 8, perSide: true },
			{ id: 'bridge', reps: 12 },
			{ id: 'plank', seconds: 20 },
			{ id: 'carry', seconds: 30, perSide: true }
		],
		rounds: 2,
		rest: 60
	}
];

export function steps(program: Program): Step[] {
	const result: Step[] = [];
	const add = (items: Item[], stage: string) => {
		for (const { id, perSide, ...dose } of items) {
			const sides = perSide ? ['правая рука', 'левая рука'] : [undefined];
			for (const side of sides) result.push({ ...dose, exercise: exercises[id], stage, side });
		}
	};

	add(program.warmup, 'Разминка');
	for (let round = 1; round <= program.rounds; round++) {
		if (round > 1) result.push({ seconds: program.rest, exercise: exercises.rest, stage: 'Отдых' });
		add(program.circuit, `Круг ${round} из ${program.rounds}`);
	}
	return result;
}
