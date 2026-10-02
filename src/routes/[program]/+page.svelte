<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import Figure from '$lib/Figure.svelte';
	import Timer from '$lib/Timer.svelte';
	import { steps } from '$lib/programs';

	let { data } = $props();

	const list = $derived(steps(data.program));
	let index = $state(0);
	const step = $derived(list[index]);

	onMount(() => {
		let lock: WakeLockSentinel | undefined;
		const acquire = () => {
			if (document.visibilityState === 'visible') navigator.wakeLock?.request('screen').then((l) => (lock = l), () => {});
		};
		acquire();
		document.addEventListener('visibilitychange', acquire);
		return () => {
			document.removeEventListener('visibilitychange', acquire);
			lock?.release();
		};
	});
</script>

<svelte:head>
	<title>{data.program.title}: тренировка</title>
</svelte:head>

<div class="bg-surface-200-800 mb-4 h-1.5 overflow-hidden rounded-full">
	<div class="bg-primary-500 h-full transition-all" style="width: {(index / list.length) * 100}%"></div>
</div>

{#if step}
	<div class="flex flex-col gap-5">
		<div>
			<div class="text-sm opacity-70">
				{index + 1} из {list.length}. {step.stage}{step.side ? `, ${step.side}` : ''}
			</div>
			<h1 class="h3">{step.exercise.name}</h1>
		</div>

		{#key index}
			{#if step.exercise.poses}
				<Figure poses={step.exercise.poses} kb={step.exercise.kb} cycle={step.exercise.cycle} />
			{/if}

			{#if 'seconds' in step}
				<Timer seconds={step.seconds} />
			{:else}
				<div class="text-center">
					<div class="text-sm opacity-70">Повторения</div>
					<div class="text-7xl font-bold tabular-nums">{step.reps}</div>
				</div>
			{/if}
		{/key}

		<ul class="list-inside list-disc space-y-1">
			{#each step.exercise.cues as cue (cue)}
				<li>{cue}</li>
			{/each}
		</ul>

		<div class="grid grid-cols-2 gap-3">
			<button class="btn preset-tonal" onclick={() => index--} disabled={index === 0}>Назад</button>
			<button class="btn preset-filled-primary-500" onclick={() => index++}>
				{index === list.length - 1 ? 'Завершить' : 'Далее'}
			</button>
		</div>
	</div>
{:else}
	<div class="flex flex-col items-center gap-4 py-10 text-center">
		<h1 class="h3">Тренировка завершена</h1>
		<p class="opacity-70">Отличная работа. До завтра.</p>
		<div class="flex gap-3">
			<button class="btn preset-tonal" onclick={() => index--}>Назад</button>
			<a class="btn preset-filled-primary-500" href={resolve('/')}>На главную</a>
		</div>
	</div>
{/if}
