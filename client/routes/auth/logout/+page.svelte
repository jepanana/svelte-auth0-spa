<!--
	This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
	For client work, contact us at hello@jepanana.com.
-->

<script lang="ts">
	import { onMount } from 'svelte';

	import { logout } from '#lib/api/index.js';
	import { logout as logoutAuth } from '#lib/utils/auth.js';
	import { getAuth } from '#lib/state/Auth.svelte.js';

	const auth = getAuth();

	onMount(async () => {
		try {
			await logout();
		} catch (error) {}

		try {
			await fetch('/auth/token', { method: 'DELETE' });
		} catch (error) {}

		auth.clear();

		try {
			await logoutAuth();
		} catch (error) {}
	});
</script>

Logging out...
