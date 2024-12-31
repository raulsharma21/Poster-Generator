// lib/session-storage.ts
import { Redis } from '@upstash/redis'

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

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

const SESSION_TTL = 60 * 60; // 1 hour in seconds

export const sessions = {
  async set(sessionId: string, session: PosterSession) {
    await redis.set(sessionId, session, { ex: SESSION_TTL });
  },

  async get(sessionId: string): Promise<PosterSession | null> {
    return redis.get(sessionId);
  },

  async delete(sessionId: string) {
    await redis.del(sessionId);
  }
};