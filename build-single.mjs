/**

 * 打包成单个 HTML 文件：发给对方一个文件即可浏览器打开（含离线资源）

 * 用法：node build-single.mjs

 */

import fs from 'fs';

import path from 'path';

import { fileURLToPath } from 'url';



const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = __dirname;

const SRC = path.join(ROOT, 'source.html');

const OUT = path.join(ROOT, 'index.html');



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



function inlineScriptTag(file) {

  const code = safeInlineScript(read(file));

  return `<script defer>\n/* === ${file} === */\n${code}\n</script>`;

}



let html = fs.readFileSync(SRC, 'utf8');



// 登录门禁优先内联（微信/QQ 内置浏览器里大包 JS 加载前也能点击）

html = html.replace(

  '<script src="app-auth.js"></script>',

  () => `<script>\n/* === app-auth.js (early) === */\n${safeInlineScript(read('app-auth.js'))}\n</script>`

);



// KaTeX 样式内联

const katexCss = read('lib/katex.min.css');

html = html.replace(

  /<link rel="stylesheet" href="lib\/katex\.min\.css">/,

  `<style id="katex-css">\n${katexCss}\n</style>`

);



html = html.replace(/\s*<link rel="manifest" href="manifest\.json">\n?/, '\n');



for (const img of ['lwl.jpg', 'wwz.jpg']) {

  const imgPath = path.join(ROOT, img);

  if (fs.existsSync(imgPath)) {

    const dataUri = readB64(img, 'image/jpeg');

    html = html.split(`src="${img}"`).join(`src="${dataUri}"`);

  }

}



const scripts = [

  'gaokao-bank.js',

  'lib/katex.min.js',

  'app-main.js',

  'lib/html2canvas.min.js',

  'sync-config.js',

  'app-sync.js',

  'app-chat.js',

  'app-mobile.js',

  'app-ext.js',

];



const supabaseCdn = `

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"><\/script>`;

if (!html.includes('@supabase/supabase-js')) {

  html = html.replace(

    /<script src="lib\/html2canvas\.min\.js"(?:\s+defer)?><\/script>/,

    `<script src="lib/html2canvas.min.js" defer></script>${supabaseCdn}`

  );

}



for (const file of scripts) {

  const escaped = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const re = new RegExp(`<script src="${escaped}"(?:\\s+defer)?><\\/script>`);

  if (!re.test(html)) {

    console.warn('未找到引用:', file);

    continue;

  }

  html = html.replace(re, () => inlineScriptTag(file));

}



const banner = `<!-- 婉宁老师教学小助手 · 单文件版 · 双击或浏览器打开即可使用 -->\n`;

if (!html.startsWith('<!--')) html = banner + html;



fs.writeFileSync(OUT, html, 'utf8');

const sizeMB = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);

console.log(`\n✓ 已生成：${OUT}`);

console.log(`  大小约 ${sizeMB} MB，可直接发给对方用手机/电脑浏览器打开\n`);


