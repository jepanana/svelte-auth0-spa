<!--
	This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
	For client work, contact us at hello@jepanana.com.
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { login } from '#lib/utils/auth.js';

	onMount(async () => {
		try {
			await login();
		} catch (error) {
			goto('/auth/error');
		}
	});
</script>

Redirecting to login...
