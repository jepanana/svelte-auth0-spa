// This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
// For client work, contact us at hello@jepanana.com.

import { createAuth0Client, type Auth0Client } from '@auth0/auth0-spa-js';
import {
	PUBLIC_AUTH0_DOMAIN,
	PUBLIC_AUTH0_CLIENT_ID,
	PUBLIC_AUTH0_REDIRECT_URI,
	PUBLIC_AUTH0_AUDIENCE
} from '$app/env/public';

let client: Auth0Client | null = null;

export const auth0Client = async (): Promise<Auth0Client> => {
	if (!client) {
		client = await createAuth0Client({
			domain: PUBLIC_AUTH0_DOMAIN,
			clientId: PUBLIC_AUTH0_CLIENT_ID,
			authorizationParams: {
				audience: PUBLIC_AUTH0_AUDIENCE
			},
			useRefreshTokens: true
		});
	}
	return client;
};

export const login = async () => {
	const client = await auth0Client();
	await client.loginWithRedirect({
		authorizationParams: {
			redirect_uri: PUBLIC_AUTH0_REDIRECT_URI
		},
		appState: {
			targetUrl: window.location.pathname
		}
	});
};

export const logout = async () => {
	const client = await auth0Client();
	await client.logout({
		logoutParams: {
			returnTo: window.location.origin
		}
	});
};
