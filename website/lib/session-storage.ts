// lib/session-storage.ts
export interface PosterSession {
  id: string;
  created_at: Date;
  last_modified: Date;
  album_data: {
    id: string;
    album_name: string;
    artist_name: string;
    cover_url: string;
    tracklist: string[];
    copyright_text?: string;
  };
  customization: {
    font_size: number;
    color_scheme: number;
  };
}

// Using a global variable to persist the sessions across API route invocations
declare global {
  // eslint-disable-next-line no-var
  var sessions: Map<string, PosterSession>;
}

if (!global.sessions) {
  global.sessions = new Map<string, PosterSession>();
}

export const sessions = global.sessions;