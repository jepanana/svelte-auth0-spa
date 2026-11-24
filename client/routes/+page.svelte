<!--
	This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
	For client work, contact us at hello@jepanana.com.
-->

<script lang="ts">
	import { getAuth } from '#lib/state/Auth.svelte.js';
	import { me } from '#lib/api/index.js';

	const auth = getAuth();

	let apiResult = $state('');

	const callApi = async () => {
		const { data, error } = await me();
		apiResult = JSON.stringify(data ?? error, null, 2);
	};
</script>

{#if auth.loggedIn}
	<p>Welcome back, {auth.user.name}!</p>
	<a href="/auth/logout">Log out</a>
{:else}
	<p>You are browsing as a guest.</p>
	<a href="/auth/login">Log in</a>
{/if}

<p><button onclick={callApi}>Call GET /api/me</button></p>
{#if apiResult}<pre>{apiResult}</pre>{/if}
