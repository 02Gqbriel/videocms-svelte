import './app.css';
import App from './App.svelte';

if (typeof document === 'undefined') throw new Error('document is undefined');

const app = new App({
	target: document.getElementById('app'),
});

export default app;
