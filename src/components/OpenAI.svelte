<script>
  import axios from 'axios';
  import { PUBLIC_OPENAIKEY } from '$env/static/public';
	import Page from '../routes/+page.svelte';

  export let topArtists;

  let auraImage = '';
  let aiError = false;
  let generating = false;

  async function generateAura() {
    const prompt = `Generate an image that creates a mystic aura, blending neon lights, vibrant colors, and dynamic abstract shapes. The design should evoke inspiration from ${topArtists.map(artist => artist.genres.join(", ")).join(", ")}.`;
    try {
      generating = true;
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
      prompt,
      n: 1,
      "model": "dall-e-3",
      "size": "1024x1792"
    }, {
      headers: {
        Authorization: `Bearer ${PUBLIC_OPENAIKEY}`,
        'Content-Type': 'application/json',
      },
    });
    auraImage = response.data.data[0].url;
    generating = false;
    }
    catch (error) {
      auraImage = '';
      aiError = true;
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
}


.get-aura-btn:hover {
    background-color: #00d4ff;
    text-decoration: none;
}

.auraimg, .errormsg {
  margin:40px 0;
}
</style>
<button on:click={generateAura} disabled={generating} class="get-aura-btn">Generate Aura</button>

{#if auraImage}
  <div class="auraimg">
    <img src={auraImage} alt="Generated Aura" style="width: 100%; height: auto;" />
    <a download href="{auraImage}" class="get-aura-btn" target="_blank"> Download Image</a>
  </div>

{/if}

{#if generating}
  <div class="auraimg">
    Generating image.. please wait
  </div>
{/if}

{#if aiError}
  <div class="errormsg"><span style="color:red;"><strong>There's a problem fetching your image, please try again</strong></span></div>
{/if}
