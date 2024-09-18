<script>
	import axios from 'axios';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import OpenAI from './OpenAI.svelte';
	import { PUBLIC_SPOTIFYCLIENTID } from '$env/static/public';
	//Access Token
	let accessToken = '';

	// URL for Spotify authentication (update your client ID and redirect URL)
	const redirectURL = $page.url;
	const authURL = `https://accounts.spotify.com/authorize?client_id=${PUBLIC_SPOTIFYCLIENTID}&response_type=token&redirect_uri=${redirectURL}&scope=user-top-read`;

	// Redirect user to Spotify to authenticate
	function loginSpotify() {
		window.location.href = authURL;
	}

	// Fetch user's top artists from Spotify
	let topArtists = [];
	let apiError = false;
	let apiCall = false;
	async function getTopArtists() {
		try {
		const response = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=5', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		topArtists = response.data.items;
		apiCall = true;
		} catch (error) {
			apiError = true;
			apiCall = true;
		}
	}

	onMount(() => {
		// Extract access token from URL
		if (window.location.hash) {
			accessToken = window.location.hash.split('=')[1].split('&')[0];
			window.history.pushState('', document.title, window.location.pathname);
		}
	});

	$: if (accessToken) {
		getTopArtists();
	}
</script>
<style>
	.login-btn {
    background-color: #ff007f;
    color: white;
    font-size: 1.2em;
    padding: 15px 30px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s ease;
}

.login-btn:hover {
    background-color: #00d4ff;
}

#content {
    margin-top: 40px;
}

#artist-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

#artist-list li {
    font-size: 1.2em;
    margin: 10px 0;
}
</style>
{#if !accessToken}
	<div class="login-section">
		<button id="login-btn" class="login-btn" on:click={loginSpotify}>Login with Spotify</button>
	</div>
{:else if topArtists.length > 0}
	<div id="content">
		<h2>Your Top Artists are:</h2>
		<ul>
		{#each topArtists as artist}
			<li>{artist.name}</li>
		{/each}
		</ul>
		{#if typeof topArtists !== 'undefined'}
			<OpenAI {topArtists} />
		{/if}
	</div>
{:else if (apiCall === true) && (topArtists.length == 0 || apiError === true) }
<div id="content">
	<div class="errormsg"><span style="color:red;"><strong>We couldn't retrive your Top Artists from Spotify, please try again later.</strong></span></div>
</div>
{/if}
