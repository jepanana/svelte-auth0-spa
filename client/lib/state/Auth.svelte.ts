// This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
// For client work, contact us at hello@jepanana.com.

import { PersistentState } from '@friendofsvelte/state';
import { getContext, setContext } from 'svelte';

interface AuthState {
	user: any | null;
	expiresAt: number | null;
}

const AUTH_STATE_KEY = 'state.auth';
const AUTH_CONTEXT_KEY = 'auth';

class Auth {
	#state = new PersistentState<AuthState>(AUTH_STATE_KEY, {
		user: null,
		expiresAt: null
	});

	get user() {
		return this.#state.current.user;
	}

	set user(user) {
		this.#state.current.user = user;
	}

	get loggedIn() {
		return !!this.#state.current.user;
	}

	set token(token: string | null) {
		this.#state.current.expiresAt = token ? this.#extractExp(token) : null;
	}

	get #isExpired() {
		const { expiresAt } = this.#state.current;
		return expiresAt !== null && Math.floor(Date.now() / 1000) >= expiresAt;
	}

	#extractExp(token: string): number | null {
		try {
			const parts = token.split('.');
			if (parts.length !== 3) return null;

			const payload = parts[1];
			const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
			return JSON.parse(atob(padded)).exp ?? null;
		} catch {
			return null;
		}
	}

	check(): boolean {
		if (this.#isExpired) {
			this.clear();
			return true;
		}
		return false;
	}

	clear() {
		this.#state.current.user = null;
		this.#state.current.expiresAt = null;
	}
}

export const setAuth = () => setContext(AUTH_CONTEXT_KEY, new Auth());
export const getAuth = () => getContext<ReturnType<typeof setAuth>>(AUTH_CONTEXT_KEY);
