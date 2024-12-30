import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { sessions } from '@/lib/session-storage';

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  const session = sessions.get(sessionId);

  if (!session) {
    return NextResponse.json(
      { error: `Session not found: ${sessionId}` },
      { status: 404 }
    );
  }

  try {
    const sessionResponse = await fetch(`http://localhost:3000/api/session?id=${sessionId}`);

    if (!sessionResponse.ok) {
      throw new Error('Failed to fetch session data');
    }

    const sessionData = await sessionResponse.json();
    const { album_data } = sessionData;

    const [imageData, scannableResponse] = await Promise.all([
      getImage(album_data.cover_url),
      getScannable(album_data.id)
    ]);

    if (!scannableResponse.success) {
      throw new Error(`Failed to get scannable: ${scannableResponse.error}`);
    }

    // Convert image data to base64
    const imageBase64 = Buffer.from(imageData).toString('base64');
    const scannableBase64 = Buffer.from(scannableResponse.data).toString('base64');

    // Make POST request to Flask endpoint with data in body
    const posterResponse = await fetch('http://127.0.0.1:5000/poster', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        album_name: album_data.album_name,
        artist_name: album_data.artist_name,
        tracklist: album_data.tracklist || '',
        copyright_text: album_data.copyright_text || '',
        scannable: scannableBase64,
        image: imageBase64
      })
    });

    if (!posterResponse.ok) {
      const errorText = await posterResponse.text();
      throw new Error(`Failed to generate poster: ${errorText}`);
    }

    // Get the poster image data as an array buffer
    const posterData = await posterResponse.arrayBuffer();

    // Return the poster image
    return new Response(posterData, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': Buffer.byteLength(posterData).toString(),
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Error generating poster:', error);
    return NextResponse.json(
      { error: 'Failed to generate poster', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

interface ScannableResponse {
  data: Uint8Array;
  success: boolean;
  error?: string;
}

async function getScannable(id: string, bg_color: string = 'DED8CE'): Promise<ScannableResponse> {
  const format = 'png';
  const size = 512;
  const code_color = 'black';
  const spotify_uri = `spotify:album:${id}`;

  try {
    const url = `https://scannables.scdn.co/uri/plain/${format}/${bg_color}/${code_color}/${size}/${spotify_uri}`;
    const response = await fetch(url);

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Verify PNG signature
      const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
      const isPNG = pngSignature.every((byte, i) => uint8Array[i] === byte);

      if (!isPNG) {
        console.error("Invalid PNG data received from Spotify API");
        return {
          data: new Uint8Array(),
          success: false,
          error: 'Invalid PNG format'
        };
      }

      return {
        data: uint8Array,
        success: true
      };
    } else {
      console.error("Failed to get scannable image. Status code:", response.status);
      return {
        data: new Uint8Array(),
        success: false,
        error: `Failed with status: ${response.status}`
      };
    }
  } catch (error) {
    console.error("Error fetching scannable:", error);
    return {
      data: new Uint8Array(),
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function getImage(imageUrl: string): Promise<Uint8Array> {
  try {
    const response = await fetch(imageUrl);

    if (response.ok) {
      const imageBuffer = await response.arrayBuffer();
      return new Uint8Array(imageBuffer);
    } else {
      throw new Error(`Failed to retrieve image: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}