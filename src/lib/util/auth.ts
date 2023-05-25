import { get, writable } from 'svelte/store';
import toast from 'svelte-french-toast';
import dayjs from 'dayjs';
import { url } from './stores';
import { browser } from '$app/environment';

export const token = writable<string>(browser ? localStorage.token ?? '' : '');
export const expires = writable<number>(browser ? Number(localStorage.exp ?? 0) : 0);

token.subscribe((v) => {
	if (!browser) return;

	if (v.length > 0) {
		localStorage.token = v;
	} else {
		localStorage.removeItem('token');
	}
});

expires.subscribe((v) => {
	if (!browser) return;

	if (v !== 0) {
		localStorage.exp = v;
	} else {
		localStorage.removeItem('exp');
	}
});

export async function login(username: string, password: string) {
	const loading = toast.loading(`Loggin in as ${username}`);

	const formData = new FormData();

	formData.append('username', username);
	formData.append('password', password);

	const res = await fetch(`${url}/api/auth/login`, {
		method: 'POST',
		body: formData
	});

	toast.remove(loading);

	if (res.status === 200) {
		interface IResData {
			token: string;
			exp: string;
		}

		const { exp, token: newToken } = <IResData>await res.json();

		token.set(newToken);

		expires.set(Date.parse(exp));

		toast.success(`User ${username} logged in successfully`);
		return true;
	} else {
		toast.error(`User ${username} couldn't be logged in`);
		return false;
	}
}

export async function checkAuth(fetch = window.fetch) {
	if (get(token).length === 0) return;

	const res = await fetch(`${url}/api/auth/check`, {
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true'
		}
	});

	if (res.status === 200) {
		const isExpNaN = Number.isNaN(Number(get(expires)));
		const isExpInTheFuture = dayjs(Number(get(expires)), 'x').diff() > 0;

		if (!isExpNaN && isExpInTheFuture) {
			setTimeout(refresh, dayjs(Number(get(expires)), 'x').diff() - 7500);
		}

		return;
	}

	toast.error('Token is invalid');
	token.set('');
	expires.set(0);
}

export async function isLoggedIn() {
	if (get(token).length === 0) return;

	const res = await fetch(`${url}/api/auth/check`, {
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true'
		}
	});

	return res.status === 200;
}

export async function refresh() {
	const res = await fetch(`${url}/api/auth/refresh`, {
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true'
		}
	});

	if (res.status === 200) {
		interface IResData {
			exp: string;
			token: string;
		}

		const { exp, token: tkn } = <IResData>await res.json();

		token.set(tkn);
		expires.set(Date.parse(exp));

		const isExpNaN = Number.isNaN(get(expires));
		const isExpInTheFuture = dayjs(get(expires), 'x').diff() > 0;

		if (!isExpNaN && isExpInTheFuture) {
			setTimeout(refresh, dayjs(get(expires), 'x').diff() - 7500);
		}

		return;
	}

	toast.error("Token couldn't be renewed");
	token.set('');
	expires.set(0);
}
