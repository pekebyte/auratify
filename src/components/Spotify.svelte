<script>
	import axios from 'axios';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import OpenAI from './OpenAI.svelte';
	import { PUBLIC_SPOTIFYCLIENTID } from '$env/static/public'; // This is OK to keep!
	
	let accessToken = '';
	let topArtists = [];
	let apiError = false;
	let apiCall = false;
	let loadingArtists = false;

	// URL for Spotify authentication
	const redirectURL = $page.url.origin + $page.url.pathname;
	const authURL = `https://accounts.spotify.com/authorize?client_id=${PUBLIC_SPOTIFYCLIENTID}&response_type=token&redirect_uri=${encodeURIComponent(redirectURL)}&scope=user-top-read`;

	// Redirect user to Spotify to authenticate
	function loginSpotify() {
		window.location.href = authURL;
	}

	// Fetch user's top artists from Spotify
	async function getTopArtists() {
		try {
			loadingArtists = true;
			apiError = false;
			
			const response = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=5', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});
			
			topArtists = response.data.items;
			apiCall = true;
		} catch (error) {
			console.error('Spotify API error:', error);
			apiError = true;
			apiCall = true;
		} finally {
			loadingArtists = false;
		}
	}

	onMount(() => {
		// Extract access token from URL hash
		if (window.location.hash) {
			const hashParams = new URLSearchParams(window.location.hash.substring(1));
			accessToken = hashParams.get('access_token') || '';
			
			if (accessToken) {
				// Clean URL without refresh
				window.history.pushState('', document.title, window.location.pathname);
			}
		}
	});

	// Reactive statement to fetch artists when token is available
	$: if (accessToken && !loadingArtists && !apiCall) {
		getTopArtists();
	}
</script>

<style>
	.login-btn {
		background-color: #1db954; /* Spotify green */
		color: white;
		font-size: 1.2em;
		padding: 15px 30px;
		border: none;
		border-radius: 30px;
		cursor: pointer;
		margin-top: 20px;
		transition: all 0.3s ease;
		font-family: inherit;
		display: inline-flex;
		align-items: center;
		gap: 10px;
	}

	.login-btn:hover {
		background-color: #1ed760;
		transform: translateY(-1px);
	}

	.login-section {
		text-align: center;
		margin: 40px 0;
	}

	.login-section h2 {
		color: #1db954;
		margin-bottom: 10px;
	}

	.login-section p {
		color: #666;
		margin-bottom: 20px;
	}

	#content {
		margin-top: 40px;
	}

	.artists-list {
		list-style: none;
		padding: 0;
		margin: 20px 0;
	}

	.artist-item {
		font-size: 1.2em;
		margin: 15px 0;
		padding: 15px;
		background-color: #ffffff;
		border: 1px solid #e0e0e0;
		border-radius: 10px;
		border-left: 4px solid #1db954;
		transition: all 0.2s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.artist-item:hover {
		transform: translateX(5px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.artist-item strong {
		color: #222;
		font-weight: 600;
	}

	.artist-genres {
		font-size: 0.9em;
		color: #666;
		margin-top: 8px;
		font-style: italic;
	}

	.loading-message {
		text-align: center;
		color: #666;
		font-style: italic;
		margin: 40px 0;
		font-size: 1.1em;
	}

	.error-message {
		color: #ff4444;
		font-weight: bold;
		background-color: #ffe6e6;
		padding: 20px;
		border-radius: 10px;
		border-left: 4px solid #ff4444;
		margin: 20px 0;
	}

	.success-header {
		color: #1db954;
		margin-bottom: 20px;
	}

	.retry-btn {
		background-color: #ff6b6b;
		margin-top: 15px;
	}

	.retry-btn:hover {
		background-color: #ff5252;
	}
</style>

{#if !accessToken}
	<div class="login-section">
		<h2>🎵 Connect Your Spotify Account</h2>
		<p>Login to generate your personalized music aura based on your top artists</p>
		<button class="login-btn" on:click={loginSpotify}>
			<span>🎵</span>
			Login with Spotify
		</button>
	</div>
{:else if loadingArtists}
	<div class="loading-message">
		🎵 Fetching your top artists from Spotify...
	</div>
{:else if topArtists.length > 0}
	<div id="content">
		<h2 class="success-header">🎉 Your Top Artists:</h2>
		<ul class="artists-list">
			{#each topArtists as artist}
				<li class="artist-item">
					<strong>{artist.name}</strong>
					{#if artist.genres && artist.genres.length > 0}
						<div class="artist-genres">
							Genres: {artist.genres.slice(0, 3).join(" • ")}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
		
		<OpenAI {topArtists} />
	</div>
{:else if apiCall && (topArtists.length === 0 || apiError)}
	<div id="content">
		<div class="error-message">
			❌ We couldn't retrieve your top artists from Spotify.
			<br><br>
			<small>
				This might happen if:
				<br>• You don't have enough listening history
				<br>• Your Spotify account is new
				<br>• There was a temporary connection issue
			</small>
			<br>
			<button class="login-btn retry-btn" on:click={() => window.location.reload()}>
				🔄 Try Again
			</button>
		</div>
	</div>
{/if}