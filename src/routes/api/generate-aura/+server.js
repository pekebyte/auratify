// src/routes/api/generate-aura/+server.js
import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

export async function POST({ request }) {
  try {
    // Parse the incoming request
    const { genres } = await request.json();
    
    // Validate that we have genres
    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      return json({ error: 'No genres provided' }, { status: 400 });
    }
    
    // Create the prompt for DALL-E
    const prompt = `Generate an image that creates a mystic aura, blending neon lights, vibrant colors, and dynamic abstract shapes. The design should evoke inspiration from these music genres: ${genres.join(", ")}.`;
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        model: "dall-e-3",
        size: "1024x1792"
      })
    });

    // Check if the OpenAI API call was successful
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return json({ 
        error: errorData.error?.message || 'Failed to generate image from OpenAI' 
      }, { status: response.status });
    }

    // Parse the successful response
    const data = await response.json();
    
    // Return the image URL
    return json({ 
      imageUrl: data.data[0].url,
      success: true 
    });
    
  } catch (error) {
    console.error('Server error generating aura:', error);
    return json({ 
      error: 'Internal server error. Please try again later.' 
    }, { status: 500 });
  }
}