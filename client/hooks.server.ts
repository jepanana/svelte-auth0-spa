// This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
// For client work, contact us at hello@jepanana.com.

import { BACKEND_HOST } from '$app/env/private';
import type { Handle } from '@sveltejs/kit/hooks';

async function modifyRequest(request: Request, url: string, headers: Headers) {
	const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.blob();

	return new Request(url, {
		headers: headers,
		body: body,
		method: request.method,
		mode: request.mode,
		credentials: request.credentials,
		cache: request.cache,
		redirect: request.redirect,
		referrer: request.referrer,
		referrerPolicy: request.referrerPolicy,
		integrity: request.integrity,
		keepalive: request.keepalive,
		signal: request.signal
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, fetch, request, url } = event;

	if (url.pathname.startsWith('/api/')) {
		const token = cookies.get('api_token');
		const newUrl = `${BACKEND_HOST}${url.pathname}${url.search}`;
		const headers = new Headers(request.headers);
		if (token) headers.set('Authorization', `Bearer ${token}`);

		return fetch(await modifyRequest(request, newUrl, headers));
	}

	return resolve(event);
};
