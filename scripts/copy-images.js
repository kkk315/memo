const fs = require('fs');
const path = require('path');

// ディレクトリを再帰的にコピーする関数
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      // 画像ファイルのみコピー
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${srcPath} -> ${destPath}`);
      }
    }
  }
}

// contentディレクトリからpublic/content-imagesにコピー
function copyContentImages() {
  const contentDir = path.join(process.cwd(), 'content');
  const publicImagesDir = path.join(process.cwd(), 'public', 'content-images');
  
  console.log('🖼️  Copying content images for SSG...');
  
  if (!fs.existsSync(contentDir)) {
    console.log('Content directory not found, skipping image copy.');
    return;
  }
  
  // public/content-imagesをクリア
  if (fs.existsSync(publicImagesDir)) {
    fs.rmSync(publicImagesDir, { recursive: true, force: true });
  }
  
  copyDir(contentDir, publicImagesDir);
  console.log('✅ Content images copied successfully!');
}

copyContentImages();
