<script lang="ts">
	interface IPictureData {
		sources: {
			[key in IFormats]: { src: string; w: number }[];
		};

		fallback: {
			w: number;
			h: number;
			src: string;
		};
	}

	type IFormats = 'avif' | 'webp' | 'png' | 'jpg';

	export let image: IPictureData;
	export let alt = '';

	export let width: number | undefined = undefined;
	export let height: number | undefined = undefined;

	const { sources, fallback } = image;
</script>

<picture role="img">
	{#each Object.entries(sources) as [format, images]}
		<source srcset={images.map((i) => i.src + ' ' + i.w + 'w').join(', ')} type="image/{format}" />
	{/each}

	<img src={fallback.src} {alt} loading="eager" decoding="async" {width} {height} />
</picture>
