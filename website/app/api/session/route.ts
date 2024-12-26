// app/api/session/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { sessions, PosterSession } from '@/lib/session-storage';

export async function fetchAlbumData(albumId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/get-info?id=${albumId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch album data: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse the JSON string in the 'result' key
    const result = JSON.parse(data.result);

    return {
      id: albumId,
      album_name: result['album-name'] || '',
      artist_name: result['artist-name'] || '',
      cover_url: result['cover-url'] || '',
      tracklist: result.tracklist || [],
      copyright_text: result.copyright || ''
    };
  } catch (error) {
    console.error('Error fetching album data:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
      const { albumId } = await request.json();
      console.log('Creating session for album:', albumId);
      
      const albumData = await fetchAlbumData(albumId);
    //   console.log('Album Info:\n', albumData);
      
      const sessionId = uuidv4();
      const session: PosterSession = {
          id: sessionId,
          created_at: new Date(),
          last_modified: new Date(),
          album_data: albumData,
          customization: {
              font_size: 16,
              color_scheme: 1
          }
      };
      
      sessions.set(sessionId, session);
      
      setTimeout(() => {
          sessions.delete(sessionId);
      }, 30/60 * 60 * 60 * 1000); // 5 minutes for testing

      console.log(`Session created with id: ${sessionId}`);
      console.log('Current sessions:', sessions.size);
      
      return NextResponse.json({ sessionId, session });
      
  } catch (error) {
      console.error('Error creating session:', error);
      return NextResponse.json(
          { error: 'Failed to create session' },
          { status: 500 }
      );
  }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');
    
    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }
    
    const session = sessions.get(sessionId);
    // console.log(`Getting session ${sessionId}`, session ? 'found' : 'not found');
    // console.log('Current sessions:', sessions.size);
    
    if (!session) {
        return NextResponse.json(
            { error: `Session not found: ${sessionId}` }, 
            { status: 404 }
        );
    }
    
    return NextResponse.json(session);
}

export async function PUT(request: Request) {
    const { sessionId, updates } = await request.json();
    const session = sessions.get(sessionId);
    
    if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    const updatedSession = {
        ...session,
        last_modified: new Date(),
        ...updates
    };
    
    sessions.set(sessionId, updatedSession);
    console.log(`Updated session ${sessionId}`);
    
    return NextResponse.json(updatedSession);
}