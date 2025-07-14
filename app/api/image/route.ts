import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { statSync } from 'fs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.nextUrl);
    const category = searchParams.get('category');
    const article = searchParams.get('article');
    const name = searchParams.get('name');

    if (!category || !article || !name) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const filePath = join(process.cwd(), 'content', category, article, name);

    if (!statSync(filePath).isFile()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    
    const image = await readFile(filePath);
    // 拡張子からContent-Type判定
    const ext = name.split('.').pop()?.toLowerCase();
    const type = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'gif' ? 'image/gif' : 'application/octet-stream';
    
    return new NextResponse(image, {
      headers: { 'Content-Type': type }
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export const dynamic = "error";
