<!--
	This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
	For client work, contact us at hello@jepanana.com.
-->

<script lang="ts">
	import { getAuth, setAuth } from '#lib/state/Auth.svelte.js';

	let { children } = $props();

	setAuth();

	const auth = $state(getAuth());

	$effect(() => {
		auth.check();
	});
</script>

{@render children?.()}
