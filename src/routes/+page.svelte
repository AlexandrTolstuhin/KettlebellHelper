<script lang="ts">
	import { resolve } from '$app/paths';
	import { exercises } from '$lib/exercises';
	import { programs } from '$lib/programs';
</script>

<svelte:head>
	<title>Гиря каждый день</title>
</svelte:head>

<div class="flex flex-col gap-6">
	<p class="opacity-80">
		Ежедневная тренировка на всё тело с одной гирей. Для начала подойдёт гиря от 8 до 12 кг для мужчин и от 6 до 8 кг
		для женщин. Если на следующий день мышцы сильно болят, сделайте разминку и один круг.
	</p>

	{#each programs as program (program.id)}
		<section class="card preset-outlined-surface-200-800 flex flex-col gap-4 p-5">
			<div>
				<h2 class="h4">{program.title}</h2>
				<p class="mt-1 opacity-80">{program.description}</p>
			</div>
			<ol class="list-inside list-decimal space-y-1 text-sm">
				{#each program.circuit as item (item.id)}
					<li>{exercises[item.id].name}</li>
				{/each}
			</ol>
			<a class="btn preset-filled-primary-500" href={resolve('/[program]', { program: program.id })}
				>Начать тренировку</a
			>
		</section>
	{/each}
</div>
