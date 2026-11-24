// This code is provided free, courtesy of MB Jepanana (https://www.jepanana.lt/), a software agency.
// For client work, contact us at hello@jepanana.com.

import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { RequestHandler } from './$types';

const tokenMaxAgeSeconds = (token: string | undefined): number => {
	if (!token) return 0;

	try {
		const decoded = jwt.decode(token) as JwtPayload | null;
		if (!decoded || typeof decoded.exp !== 'number') {
			return 0;
		}
		const now = Math.floor(Date.now() / 1000);
		return Math.max(0, decoded.exp - now);
	} catch {
		return 0;
	}
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { token } = await request.json();

	const maxAge = tokenMaxAgeSeconds(token);
	if (maxAge === 0) return Response.json({}, { status: 400 });

	cookies.set('api_token', token, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
		sameSite: 'strict',
		maxAge
	});

	return Response.json({ token: true }, { status: 201 });
};

export const DELETE: RequestHandler = ({ cookies }) => {
	cookies.delete('api_token', {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV !== 'development',
		sameSite: 'strict'
	});

	return Response.json({ token: false }, { status: 200 });
};
