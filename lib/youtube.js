import { Innertube, UniversalCache } from 'youtubei.js';

// Reuse satu client across request (di dalam 1 lifecycle serverless function)
// supaya tidak init ulang tiap request.
let clientPromise;
function getClient() {
  if (!clientPromise) {
    clientPromise = Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true,
    });
  }
  return clientPromise;
}

/**
 * Ambil video ID dari berbagai format link YouTube:
 * - https://www.youtube.com/shorts/VIDEOID
 * - https://www.youtube.com/watch?v=VIDEOID
 * - https://youtu.be/VIDEOID
 */
export function extractVideoId(url) {
  const patterns = [
    /shorts\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function fetchVideoInfo(rawUrl) {
  const videoId = extractVideoId(rawUrl);
  if (!videoId) {
    throw new Error('Link YouTube tidak valid. Pastikan format link Shorts atau video biasa.');
  }
  const yt = await getClient();
  return yt.getInfo(videoId);
}

/**
 * Pilih format yang sudah gabungan video+audio (tidak perlu merge manual dengan ffmpeg).
 */
export function pickFormat(info) {
  const format = info.chooseFormat({ type: 'video+audio', quality: 'best' });
  if (!format) {
    throw new Error('Tidak ditemukan format video+audio yang bisa diunduh langsung.');
  }
  return format;
}

export function safeTitle(info) {
  return (info.basic_info?.title || 'video')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .slice(0, 60);
}

/**
 * Dapatkan URL langsung (sudah di-decipher) ke file video di CDN YouTube.
 */
export async function getDirectUrl(info, format) {
  const yt = await getClient();
  return format.decipher(yt.session.player);
}
