import { expect, test } from 'vitest';
import { exercises } from './exercises';
import { programs, steps } from './programs';

test('Beginner_ExpandsSidesAndRoundsWithRestBetween', () => {
	const list = steps(programs[0]);

	expect(list).toHaveLength(3 + 10 * 2 + 1);
	expect(list.map((s) => s.stage).slice(0, 4)).toEqual(['Разминка', 'Разминка', 'Разминка', 'Круг 1 из 2']);
	expect(list.filter((s) => s.exercise === exercises.row).map((s) => s.side)).toEqual([
		'правая рука',
		'левая рука',
		'правая рука',
		'левая рука'
	]);
	expect(list[13]).toMatchObject({ exercise: exercises.rest, seconds: 60 });
	expect(list.at(-1)?.stage).toBe('Круг 2 из 2');
});
