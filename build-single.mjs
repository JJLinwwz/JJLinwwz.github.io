/**
 * 打包 index.html
 * 默认：轻量多文件版（GitHub Pages 快加载，约 200KB）
 * 离线单文件：node build-single.mjs --offline
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const SRC = path.join(ROOT, 'source.html');
const OUT = path.join(ROOT, 'index.html');
const OFFLINE = process.argv.includes('--offline');

function read(p) {
  return fs.readFileSync(path.join(ROOT, p), 'utf8');
}

function readB64(p, mime) {
  const buf = fs.readFileSync(path.join(ROOT, p));
  return `data:${mime};base64,${buf.toString('base64')}`;
}

function safeInlineScript(code) {
  return code.replace(/<\/script/gi, '<\\/script');
}

function inlineScriptTag(file, defer) {
  const code = safeInlineScript(read(file));
  const d = defer ? ' defer' : '';
  return `<script${d}>\n/* === ${file} === */\n${code}\n</script>`;
}

let html = fs.readFileSync(SRC, 'utf8');

html = html.replace(
  '<script src="app-auth.js"></script>',
  () => `<script>\n/* === app-auth.js (early) === */\n${safeInlineScript(read('app-auth.js'))}\n</script>`
);

html = html.replace(/\s*<link rel="manifest" href="manifest\.json">\n?/, '\n');

if (OFFLINE) {
  const katexCss = read('lib/katex.min.css');
  html = html.replace(
    /<title>/,
    `<style id="katex-css">\n${katexCss}\n</style>\n<title>`
  );
  for (const img of ['lwl.jpg', 'wwz.jpg']) {
    const imgPath = path.join(ROOT, img);
    if (fs.existsSync(imgPath)) {
      const dataUri = readB64(img, 'image/jpeg');
      html = html.split(`src="${img}"`).join(`src="${dataUri}"`);
    }
  }
  const critical = ['app-main.js', 'app-mobile.js', 'app-ext.js', 'app-lazy.js'];
  const lazy = [
    'app-couple.js', 'lib/katex.min.js', 'lib/html2canvas.min.js',
    'sync-config.js', 'app-sync.js', 'app-chat.js',
  ];
  for (const file of critical) {
    const escaped = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`<script src="${escaped}"(?:\\s+defer)?><\\/script>`);
    html = html.replace(re, () => inlineScriptTag(file, true));
  }
  let lazyCode = lazy.map(f => safeInlineScript(read(f))).join('\n');
  lazyCode += `\n/* supabase */\n${safeInlineScript('if(!window.supabase){var s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";document.head.appendChild(s);}')}`;
  html = html.replace(
    '</body>',
    `<script defer>\n/* === lazy-bundle === */\n${lazyCode}\n</script>\n</body>`
  );
} else {
  // GitHub 轻量版：保留外部 js/图片引用，首屏 HTML 更小
}

const banner = `<!-- 婉宁双人小窝 · ${OFFLINE ? '离线单文件' : 'GitHub轻量'}版 -->\n`;
if (!html.startsWith('<!--')) html = banner + html;

fs.writeFileSync(OUT, html, 'utf8');
const sizeMB = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
const sizeKB = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`\n✓ 已生成：${OUT}`);
console.log(`  模式：${OFFLINE ? '离线单文件' : 'GitHub 轻量多文件'}`);
console.log(`  大小约 ${OFFLINE ? sizeMB + ' MB' : sizeKB + ' KB'}\n`);
if (!OFFLINE) {
  console.log('  GitHub 部署：上传整个文件夹（含 lib/ 与各 .js）');
  console.log('  访问 https://你的用户名.github.io 即可\n');
}
if (!fs.existsSync(path.join(ROOT, 'xinyi.mp3'))) {
  console.log('  提示：将《聊表心意》mp3 命名为 xinyi.mp3 放到项目根目录\n');
}
