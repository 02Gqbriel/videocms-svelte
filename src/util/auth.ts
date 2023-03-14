import { url } from '../stores';
import { get, writable } from 'svelte/store';
import toast from 'svelte-french-toast';
import dayjs from 'dayjs';

const storedToken = (sessionStorage.token as string) ?? undefined;
export const token = writable<string>(storedToken);

token.subscribe((v) => v !== 'undefined' && (sessionStorage.token = v));

const storedTokenExp = (sessionStorage.tokenExp as string) ?? undefined;
export const tokenExp = writable<string>(storedTokenExp);

tokenExp.subscribe((v) => v !== 'undefined' && (sessionStorage.tokenExp = v));

export async function login(username: string, password: string) {
	const formData = new FormData();

	formData.append('username', username);
	formData.append('password', password);

	const response = await toast.promise(
		fetch(`${url}/api/auth/login`, {
			method: 'POST',
			body: formData,
		}),
		{
			loading: 'Logging in',
			error: "Counldn't login",
			success: 'Succesfully logged in',
		}
	);

	if (response.ok) {
		const { exp, token: tokenNew } = (await response.json()) as {
			exp: string;
			token: string;
		};

		token.set(tokenNew);

		tokenExp.set(Date.parse(exp).toString());

		return;
	}

	return response.ok;
}

export async function checkAuth() {
	if (get(token) == 'undefined') return;

	const response = await toast.promise(
		fetch(`${url}/api/auth/check`, {
			headers: {
				Authorization: 'Basic ' + get(token),
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		}),
		{
			loading: 'Validating token',
			error: 'Token invalid',
			success: 'Token valid',
		}
	);

	if (response.ok) {
		const json = (await response.json()) as { exp: string; username: string };

		const { exp } = json;

		tokenExp.set(Date.parse(exp).toString());

		return;
	}

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
			setTimeout(refreshAuth, dayjs(Number(get(tokenExp)), 'x').diff() - 5000);
		}

		return;
	}

	toast.error("Token couldn't be renewed");

	return token.set('undefined');
}
