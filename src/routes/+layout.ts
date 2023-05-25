import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { expires as expStore, refresh, token as tokenStore } from '$lib/util/auth';
import { get } from 'svelte/store';
import dayjs from 'dayjs';
import { url as apiUrl } from '$lib/util/stores';

export const load = (async ({ fetch, url }) => {
	if (url.pathname === '/login') return;

	const [token, expires] = [get(tokenStore), get(expStore)];

	if (token === '' || expires === 0) {
		throw redirect(302, '/login');
	}

	const isExpInTheFuture = dayjs(expires, 'x').diff() > 0;

	if (!isExpInTheFuture) {
		tokenStore.set('');
		expStore.set(0);

		throw redirect(302, '/login');
	}

	const headers = {
		Authorization: 'Basic ' + token,
		'Access-Control-Allow-Headers': 'Authorization',
		'Access-Control-Allow-Credentials': 'true'
	};

	const res = await fetch(`${apiUrl}/api/auth/check`, { headers });

	if (res.status !== 200) {
		tokenStore.set('');
		expStore.set(0);

		throw redirect(302, '/login');
	}

	setTimeout(refresh, dayjs(expires, 'x').diff() - 7500);
}) satisfies LayoutLoad;

export const ssr = false;
