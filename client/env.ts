// This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
// For client work, contact us at hello@jepanana.com.

import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_AUTH0_DOMAIN: { public: true, static: true },
	PUBLIC_AUTH0_CLIENT_ID: { public: true, static: true },
	PUBLIC_AUTH0_REDIRECT_URI: { public: true, static: true },
	PUBLIC_AUTH0_AUDIENCE: { public: true, static: true },
	BACKEND_HOST: {}
});
