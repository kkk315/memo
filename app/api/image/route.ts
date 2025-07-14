import { NextRequest } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { statSync } from 'fs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const article = searchParams.get('article');
  const name = searchParams.get('name');

  if (!category || !article || !name) {
    return new Response('Missing parameters', { status: 400 });
  }

  const filePath = join(process.cwd(), 'content', category, article, name);

  try {
    if (!statSync(filePath).isFile()) {
      return new Response('Not found', { status: 404 });
    }
    const image = await readFile(filePath);
    // 拡張子からContent-Type判定
    const ext = name.split('.').pop()?.toLowerCase();
    const type = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'gif' ? 'image/gif' : 'application/octet-stream';
    return new Response(image, {
      headers: { 'Content-Type': type }
    });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}
