<!--
	This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
	For client work, contact us at hello@jepanana.com.
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { GenericError } from '@auth0/auth0-spa-js';

	import { auth0Client, login } from '#lib/utils/auth.js';
	import { getAuth } from '#lib/state/Auth.svelte.js';

	const RETRY_KEY = 'auth.callback.retried';
	const RETRYABLE_ERRORS = new Set([
		'missing_transaction',
		'state_mismatch',
		'invalid_grant',
		'login_required',
		'consent_required',
		'interaction_required',
		'timeout'
	]);

	const isRetryable = (error: unknown) =>
		error instanceof GenericError && RETRYABLE_ERRORS.has(error.error);

	const auth = getAuth();

	onMount(async () => {
		const auth0 = await auth0Client();
		try {
			let redirectUrl = '/';
			const params = new URLSearchParams(window.location.search);

			if (params.has('code') && params.has('state')) {
				const result = await auth0.handleRedirectCallback();
				window.history.replaceState(window.history.state, '', window.location.pathname);
				const target = result?.appState?.targetUrl;
				if (typeof target === 'string' && target.startsWith('/') && !target.startsWith('//')) {
					redirectUrl = target;
				}
				if (redirectUrl.startsWith('/auth')) redirectUrl = '/';
			}

			const token = await auth0.getTokenSilently();

			if (token) {
				await fetch('/auth/token', {
					method: 'POST',
					body: JSON.stringify({ token })
				});
				auth.token = token;
			} else {
				await fetch('/auth/token', {
					method: 'DELETE'
				});
				auth.clear();
			}

			auth.user = await auth0.getUser();

			sessionStorage.removeItem(RETRY_KEY);
			goto(redirectUrl);
		} catch (error) {
			auth.clear();

			if (isRetryable(error) && !sessionStorage.getItem(RETRY_KEY)) {
				sessionStorage.setItem(RETRY_KEY, '1');
				try {
					await login();
					return;
				} catch (loginError) {}
			}

			sessionStorage.removeItem(RETRY_KEY);
			goto(`/auth/error`);
		}
	});
</script>
