// This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
// For client work, contact us at hello@jepanana.com.

import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
	input: './api/openapi.json',
	output: './client/lib/api',
	plugins: ['@hey-api/client-fetch', '@hey-api/sdk']
});
