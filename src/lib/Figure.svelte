<script lang="ts">
	import type { Pose, Pt } from './exercises';

	let { poses, kb = false, cycle = 2.4 }: { poses: Pose[]; kb?: boolean; cycle?: number } = $props();

	const dir = (deg: number): Pt => [Math.sin((deg * Math.PI) / 180), -Math.cos((deg * Math.PI) / 180)];
	const add = (a: Pt, b: Pt, k = 1): Pt => [a[0] + b[0] * k, a[1] + b[1] * k];
	const fmt = (p: Pt) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

	const elbowBehind = -1;
	const kneeInFront = 1;

	function joint(from: Pt, to: Pt, l1: number, l2: number, bend: number): Pt {
		const dist = Math.hypot(to[0] - from[0], to[1] - from[1]);
		const u: Pt = [(to[0] - from[0]) / dist, (to[1] - from[1]) / dist];
		const d = Math.min(dist, l1 + l2);
		const along = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
		const h = Math.sqrt(Math.max(0, l1 * l1 - along * along));
		return add(add(from, u, along), [u[1], -u[0]], bend * h);
	}

	function solve(p: Pose) {
		const neck = add(p.hip, dir(p.torso), 50);
		const limb = (root: Pt, end: Pt, l1: number, l2: number, bend: number) =>
			`M${fmt(root)}L${fmt(joint(root, end, l1, l2, bend))}L${fmt(end)}`;
		const side = (i: 0 | 1) =>
			limb(neck, p.hands[i], 28, 26, elbowBehind) +
			limb(p.hip, p.feet[i], 40, 40, kneeInFront) +
			`L${fmt(add(p.feet[i], [9, 0]))}`;
		return {
			far: side(0),
			near: `M${fmt(p.hip)}L${fmt(neck)}` + side(1),
			head: add(neck, dir(p.head ?? p.torso), 16),
			kb: p.hands[1]
		};
	}

	const frames = $derived([...poses, poses[0]].map(solve));
	const anim = $derived({
		dur: `${cycle}s`,
		repeatCount: 'indefinite',
		calcMode: 'spline',
		keyTimes: frames.map((_, i) => i / (frames.length - 1)).join(';'),
		keySplines: frames.slice(1).map(() => '.45 0 .55 1').join(';')
	});
	const values = (pick: (f: (typeof frames)[number]) => string) => frames.map(pick).join(';');
</script>

<svg
	viewBox="0 0 200 200"
	class="mx-auto h-52 w-full"
	aria-hidden="true"
	fill="none"
	stroke="currentColor"
	stroke-width="7"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	<line x1="0" y1="180" x2="200" y2="180" stroke-width="2" opacity=".25" />
	<path d={frames[0].far} opacity=".4">
		<animate attributeName="d" values={values((f) => f.far)} {...anim} />
	</path>
	{#if kb}
		<g class="fill-primary-500 stroke-primary-500" stroke-width="3" transform="translate({fmt(frames[0].kb)})">
			<animateTransform attributeName="transform" type="translate" values={values((f) => fmt(f.kb))} {...anim} />
			<path d="M-6 9Q-7-1 0-1Q7-1 6 9" fill="none" />
			<circle cy="14" r="9" stroke="none" />
		</g>
	{/if}
	<circle r="10" cx={frames[0].head[0]} cy={frames[0].head[1]} fill="currentColor" stroke="none">
		<animate attributeName="cx" values={values((f) => f.head[0].toFixed(1))} {...anim} />
		<animate attributeName="cy" values={values((f) => f.head[1].toFixed(1))} {...anim} />
	</circle>
	<path d={frames[0].near}>
		<animate attributeName="d" values={values((f) => f.near)} {...anim} />
	</path>
</svg>
