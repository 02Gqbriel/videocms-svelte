<div
	class="progress-bar"
	role="progressbar"
	aria-valuenow={75}
	aria-valuemin={0}
	aria-valuemax={100}
/>

<style>
	@property --progress-value {
		syntax: '<integer>';
		initial-value: 0;
		inherits: false;
	}

	@keyframes progress {
		to {
			--progress-value: 75;
		}
	}

	.progress-bar {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: radial-gradient(closest-side, white 79%, transparent 80% 100%),
			conic-gradient(hotpink calc(var(--progress-value) * 1%), pink 0);
		animation: progress 2s 1 forwards;
	}

	.progress-bar::before {
		counter-reset: percentage var(--progress-value);
		content: counter(percentage) '%';
		animation: progress 2s 1 forwards;
	}
</style>
