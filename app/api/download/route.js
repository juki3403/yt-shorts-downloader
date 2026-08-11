import { NextResponse } from 'next/server';
import { fetchVideoInfo, pickFormat, safeTitle, getDirectUrl } from '../../../lib/youtube';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL wajib diisi' }, { status: 400 });
    }

    const info = await fetchVideoInfo(url);
    const format = pickFormat(info);
    const title = safeTitle(info);
    const directUrl = await getDirectUrl(info, format);

    // Ambil video dari CDN YouTube, lalu relay stream-nya langsung ke browser.
    const upstream = await fetch(directUrl);
    if (!upstream.ok || !upstream.body) {
      throw new Error(`Gagal mengambil video dari YouTube (status ${upstream.status})`);
    }

    return new NextResponse(upstream.body, {
      headers: {
        'Content-Type': format.mime_type || 'video/mp4',
        'Content-Disposition': `attachment; filename="${title}.mp4"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Gagal memproses video' },
      { status: 500 }
    );
  }
}
