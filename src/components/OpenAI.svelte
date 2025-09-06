<script>
  // No more API key imports - everything is handled server-side!
  export let topArtists;

  let auraImage = '';
  let aiError = false;
  let generating = false;
  let errorMessage = '';

  async function generateAura() {
    try {
      // Reset states
      generating = true;
      aiError = false;
      auraImage = '';
      errorMessage = '';

      // Extract genres from top artists
      const genres = topArtists.flatMap(artist => artist.genres);
      
      // Validate that we have genres
      if (!genres || genres.length === 0) {
        throw new Error('No music genres found from your top artists');
      }

      // Call our secure server-side API endpoint
      const response = await fetch('/api/generate-aura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ genres })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      // Set the generated image
      auraImage = data.imageUrl;
      
    } catch (error) {
      console.error('Error generating aura:', error);
      aiError = true;
      errorMessage = error.message || 'Something went wrong. Please try again.';
    } finally {
      generating = false;
    }
  }
</script>

<style>
  .get-aura-btn {
    background-color: #ff007f;
    color: white;
    font-size: 1.2em;
    padding: 15px 30px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s ease;
    text-decoration: none;
    display: inline-block;
    font-family: inherit;
  }

  .get-aura-btn:hover:not(:disabled) {
    background-color: #00d4ff;
    text-decoration: none;
    transform: translateY(-1px);
  }

  .get-aura-btn:disabled {
    background-color: #3b3b3b;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .auraimg {
    margin: 40px 0;
    text-align: center;
  }

  .errormsg {
    margin: 40px 0;
  }

  .loading-message {
    margin: 40px 0;
    color: #666;
    font-style: italic;
    text-align: center;
    font-size: 1.1em;
  }

  .error-message {
    color: #ff4444;
    font-weight: bold;
    background-color: #ffe6e6;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #ff4444;
  }

  .aura-image {
    width: 100%;
    max-width: 500px;
    height: auto;
    border-radius: 15px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
  }

  .success-message {
    color: #22c55e;
    font-size: 0.9em;
    margin-top: 10px;
    font-style: italic;
  }

  .genres-preview {
    margin-top: 10px;
    color: #888;
    font-size: 0.9em;
    font-style: italic;
  }
</style>

<div>
  <button on:click={generateAura} disabled={generating} class="get-aura-btn">
    {#if generating}
      🎨 Generating...
    {:else}
      ✨ Generate My Music Aura
    {/if}
  </button>

  {#if topArtists && topArtists.length > 0}
    <div class="genres-preview">
      Based on: {topArtists.flatMap(artist => artist.genres).slice(0, 5).join(", ")}
      {#if topArtists.flatMap(artist => artist.genres).length > 5}
        and more...
      {/if}
    </div>
  {/if}
</div>

{#if generating}
  <div class="loading-message">
    🎵 Analyzing your music taste and creating your unique aura... ✨
    <br>
    <small>This may take 10-30 seconds</small>
  </div>
{/if}

{#if auraImage}
  <div class="auraimg">
    <img src={auraImage} alt="Your Generated Music Aura" class="aura-image" />
    <div class="success-message">
      ✅ Your music aura has been generated!
    </div>
    <br>
    <a href={auraImage} class="get-aura-btn" download="my-music-aura.png" target="_blank">
      💾 Download Image
    </a>
  </div>
{/if}

{#if aiError}
  <div class="errormsg">
    <div class="error-message">
      ❌ {errorMessage}
      <br>
      <small>Please check your connection and try again.</small>
    </div>
  </div>
{/if}