<script>
  import Spotify from '../components/Spotify.svelte';
</script>
<svelte:head>
	<title>Auratify</title>
	<meta name="description" content="Create an AI-generated image based on the aura of your top Spotify Artists" />
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
</svelte:head>
<style>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
    min-height: 100vh;
	font-family: 'Roboto', sans-serif;
	background-color: #0f0f0f;
	margin: -8px;
    padding: 0;
    color: #fff;

}

header h1 {
    font-size: 3em;
    color: #ff007f;
}

header p {
    color: #8f8f8f;
    font-size: 1.2em;
    margin-top: 0.5em;
}
</style>
<div class="container">
	<header>
		<h1>Auratify</h1>
		<p>Get your generative AI mystic aura image based on your top Spotify artists.</p>
	</header>
	<Spotify />
</div>
