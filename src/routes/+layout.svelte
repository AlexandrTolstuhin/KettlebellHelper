<script lang="ts">
	import '../app.css';
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<header class="border-surface-200-800 border-b">
		<div class="mx-auto w-full max-w-xl px-4 py-3">
			<a href={resolve('/')} class="text-lg font-semibold tracking-tight">Гиря каждый день</a>
		</div>
	</header>

	<main class="mx-auto w-full max-w-xl flex-1 px-4 py-6">
		{@render children()}
	</main>

	<footer class="border-surface-200-800 border-t px-4 py-3 text-center text-xs opacity-70">
		При боли в суставах или спине остановитесь. Это не медицинская рекомендация.
	</footer>
</div>
