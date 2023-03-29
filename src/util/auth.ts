import { url } from '../stores';
import { get, writable } from 'svelte/store';
import toast from 'svelte-french-toast';
import dayjs from 'dayjs';

const storedToken = (sessionStorage.token as string) ?? undefined;
export const token = writable<string>(storedToken);

token.subscribe(v => v !== 'undefined' && (sessionStorage.token = v));

const storedTokenExp = (sessionStorage.tokenExp as string) ?? undefined;
export const tokenExp = writable<string>(storedTokenExp);

tokenExp.subscribe(v => v !== 'undefined' && (sessionStorage.tokenExp = v));

export async function login(username: string, password: string) {
	let loading = toast.loading(`Loggin in as ${username}`);

	const formData = new FormData();

	formData.append('username', username);
	formData.append('password', password);

	const response = await fetch(`${url}/api/auth/login`, {
		method: 'POST',
		body: formData,
	});

	toast.remove(loading);

	if (response.ok) {
		const { exp, token: tokenNew } = (await response.json()) as {
			exp: string;
			token: string;
		};

		token.set(tokenNew);

		tokenExp.set(Date.parse(exp).toString());

		toast.success(`User ${username} logged in successfully`);
	} else {
		toast.error(`User ${username} couldn't be logged in`);
	}

	return response.ok;
}

export async function checkAuth() {
	if (get(token) == 'undefined') return;

	let loading = toast.loading('Validating token');

	const response = await fetch(`${url}/api/auth/check`, {
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
	});

	toast.remove(loading);

	if (response.ok) {
		const { exp } = (await response.json()) as {
			exp: string;
			username: string;
		};

		tokenExp.set(Date.parse(exp).toString());

		toast.success('Token is valid');

		return;
	}

	toast.error('Token is invalid');

	token.set('undefined');
}

export async function refreshAuth() {
	const response = await fetch(`${url}/api/auth/refresh`, {
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
	});

	if (response.ok) {
		const { exp, token: tokenNew } = (await response.json()) as {
			exp: string;
			token: string;
		};

		token.set(tokenNew);
		tokenExp.set(Date.parse(exp).toString());

		if (
			!Number.isNaN(Number(get(tokenExp))) &&
			dayjs(Number(get(tokenExp)), 'x').diff() > 0
		) {
			setTimeout(refreshAuth, dayjs(Number(get(tokenExp)), 'x').diff() - 7500);
		}

		return;
	}

	toast.error("Token couldn't be renewed");

	return token.set('undefined');
}
