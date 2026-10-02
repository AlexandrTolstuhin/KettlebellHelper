<script lang="ts">
	let { seconds }: { seconds: number } = $props();

	let elapsed = $state(0);
	let interval: ReturnType<typeof setInterval> | undefined = $state();
	let startedAt = 0;
	let audio: AudioContext | undefined;

	const left = $derived(Math.max(0, seconds * 1000 - elapsed));
	const shown = $derived(Math.ceil(left / 1000));

	function start() {
		audio ??= new AudioContext();
		startedAt = Date.now() - elapsed;
		interval = setInterval(tick, 100);
	}

	function pause() {
		clearInterval(interval);
		interval = undefined;
	}

	function reset() {
		pause();
		elapsed = 0;
	}

	function tick() {
		elapsed = Date.now() - startedAt;
		if (left > 0) return;
		pause();
		beep();
		navigator.vibrate?.([300, 150, 300]);
	}

	function beep() {
		if (!audio) return;
		const osc = audio.createOscillator();
		osc.frequency.value = 880;
		osc.connect(audio.destination);
		osc.start();
		osc.stop(audio.currentTime + 0.6);
	}

	$effect(() => pause);
</script>

<div class="flex flex-col items-center gap-4">
	<div class="text-7xl font-bold tabular-nums" class:text-success-500={left === 0}>
		{Math.floor(shown / 60)}:{String(shown % 60).padStart(2, '0')}
	</div>
	<div class="flex gap-2">
		{#if interval}
			<button class="btn preset-filled-warning-500" onclick={pause}>Пауза</button>
		{:else if left > 0}
			<button class="btn preset-filled-primary-500" onclick={start}>Старт</button>
		{/if}
		<button class="btn preset-tonal" onclick={reset} disabled={elapsed === 0}>Сначала</button>
	</div>
</div>
