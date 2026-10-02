import { error } from '@sveltejs/kit';
import { programs } from '$lib/programs';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => programs.map((p) => ({ program: p.id }));

export const load: PageLoad = ({ params }) => {
	const program = programs.find((p) => p.id === params.program);
	if (!program) error(404);
	return { program };
};
