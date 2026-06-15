// 手机触屏优化：复制、导出图片/长图、分享、验证门禁、语音笔记
const TEACHER_NICK = '婉儿';
const TEACHER_FULL = '蔺婉宁';
const TEACHER_NAME = TEACHER_NICK;
const AUTH_PASS_L1 = ['060303', '060126'];
const AUTH_PASS_L2 = '123';
const AUTH_KEY_L1 = 'math-auth-l1';
const AUTH_KEY = 'math-auth-session';

const AUTH_PARTICLES = ['💕', '💗', '💖', '❤️', '🩷', '✨', '⭐', '🌟', '💫', '♡'];

function isAuthedL1() {
  try { return sessionStorage.getItem(AUTH_KEY_L1) === '1'; } catch { return false; }
}

function isAuthed() {
  try { return sessionStorage.getItem(AUTH_KEY) === '1'; } catch { return false; }
}

function spawnAuthBurst(x, y) {
  const icons = ['💕', '💖', '✨', '⭐', '♡', '🌟'];
  for (let i = 0; i < 7; i++) {
    const el = document.createElement('span');
    el.className = 'auth-burst';
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    const angle = (Math.PI * 2 * i) / 7 + Math.random() * 0.4;
    const dist = 28 + Math.random() * 36;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--by', Math.sin(angle) * dist + 'px');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }
}

function spawnAuthHeartBurst(x, y, big) {
  const icons = ['💕', '💖', '❤️', '🩷', '✨', '⭐', '♡', '🌟', '💗'];
  const n = big ? 20 : 12;
  for (let i = 0; i < n; i++) {
    const el = document.createElement('span');
    el.className = big ? 'auth-burst auth-burst-big' : 'auth-burst';
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    const angle = (Math.PI * 2 * i) / n + Math.random() * 0.5;
    const dist = (big ? 55 : 32) + Math.random() * (big ? 90 : 42);
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--by', Math.sin(angle) * dist + 'px');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), big ? 1200 : 900);
  }
}

function launchWelcomeHeartFireworks() {
  const icons = ['💕', '💖', '❤️', '🩷', '✨', '♡', '💗', '🌹', '🌻', '🌸'];
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (let b = 0; b < 6; b++) {
    setTimeout(() => {
      const x = w * (0.15 + Math.random() * 0.7);
      const y = h * (0.2 + Math.random() * 0.4);
      for (let i = 0; i < 14; i++) {
        const el = document.createElement('span');
        el.className = 'welcome-fw';
        el.textContent = icons[Math.floor(Math.random() * icons.length)];
        const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.35;
        const dist = 45 + Math.random() * 95;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
        el.style.setProperty('--fy', Math.sin(angle) * dist + 'px');
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1500);
      }
    }, b * 260);
  }
}

function bindAuthHeartBtn(id) {
  const btn = document.getElementById(id);
  if (!btn || btn._heartBound) return;
  btn._heartBound = true;
  const pop = e => {
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    spawnAuthHeartBurst(x, y, true);
    btn.classList.add('heart-pop');
    setTimeout(() => btn.classList.remove('heart-pop'), 350);
    e.preventDefault();
  };
  btn.addEventListener('click', pop);
  btn.addEventListener('touchend', e => { pop(e); }, { passive: false });
}

function startAuthFloat(containerId) {
  const box = document.getElementById(containerId);
  if (!box || box._floatOn) return;
  box._floatOn = true;
  const spawn = () => {
    if (!box.isConnected) return;
    const el = document.createElement('span');
    el.className = 'auth-float-item';
    el.textContent = AUTH_PARTICLES[Math.floor(Math.random() * AUTH_PARTICLES.length)];
    el.style.left = (Math.random() * 100) + '%';
    el.style.bottom = '-24px';
    el.style.fontSize = (.7 + Math.random() * .9) + 'rem';
    el.style.animationDuration = (9 + Math.random() * 8) + 's';
    el.style.animationDelay = (Math.random() * 2) + 's';
    box.appendChild(el);
    setTimeout(() => el.remove(), 20000);
  };
  for (let i = 0; i < 6; i++) setTimeout(spawn, i * 400);
  box._floatTimer = setInterval(spawn, 1800);
}

function stopAuthFloat(containerId) {
  const box = document.getElementById(containerId);
  if (!box) return;
  if (box._floatTimer) clearInterval(box._floatTimer);
  box._floatOn = false;
}

function showAuthSuccess(onDone) {
  const modal = document.getElementById('authSuccessModal');
  if (!modal) { onDone?.(); return; }
  modal.classList.add('show');
  setTimeout(() => {
    modal.classList.remove('show');
    setTimeout(onDone, 350);
  }, 2200);
}

function unlockApp(onUnlock) {
  const gate = document.getElementById('authGate');
  const gate2 = document.getElementById('authGate2');
  const app = document.querySelector('.app');
  stopAuthFloat('authParticlesL1');
  stopAuthFloat('authParticlesL2');
  gate2?.classList.add('auth-out');
  gate?.classList.add('auth-out');
  setTimeout(() => {
    gate?.remove();
    gate2?.remove();
    document.getElementById('authSuccessModal')?.remove();
    document.body.classList.remove('auth-pending');
    if (app) { app.style.display = ''; app.classList.add('ready'); }
    onUnlock?.();
  }, 380);
}

function showLevel2Gate() {
  const gate = document.getElementById('authGate');
  const gate2 = document.getElementById('authGate2');
  if (!gate2) return;
  gate?.classList.add('auth-out');
  setTimeout(() => {
    if (gate) gate.style.display = 'none';
    gate2.style.display = 'flex';
    gate2.classList.remove('auth-out');
    startAuthFloat('authParticlesL2');
    document.getElementById('authPwd2')?.focus();
  }, 350);
}

function bindLevel2Auth(onUnlock) {
  const inp = document.getElementById('authPwd2');
  const msg = document.getElementById('authMsg2');
  const btn = document.getElementById('authBtn2');
  const submit = () => {
    const v = (inp?.value || '').trim();
    if (!v) {
      if (msg) { msg.textContent = '请输入双人专属密码哦'; msg.style.color = 'var(--danger)'; }
      return;
    }
    if (v === AUTH_PASS_L2) {
      try {
        sessionStorage.setItem(AUTH_KEY_L1, '1');
        sessionStorage.setItem(AUTH_KEY, '1');
      } catch {}
      window._freshLogin = true;
      const rect = btn?.getBoundingClientRect();
      if (rect) spawnAuthHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, true);
      showAuthSuccess(() => unlockApp(onUnlock));
      return;
    }
    if (msg) {
      msg.style.color = 'var(--danger)';
      msg.textContent = '暗号不对哦，再试试我们的小约定吧';
    }
    if (inp) { inp.value = ''; inp.focus(); }
  };
  btn?.addEventListener('click', e => {
    const r = btn.getBoundingClientRect();
    spawnAuthBurst(r.left + r.width / 2, r.top + r.height / 2);
    submit();
  });
  inp?.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  inp?.addEventListener('focus', e => {
    spawnAuthBurst(e.target.getBoundingClientRect().left + 40, e.target.getBoundingClientRect().top);
  });
  bindAuthHeartBtn('authHeartL2');
}

function bindAuthUiEffects() {
  const gate = document.getElementById('authGate');
  const gate2 = document.getElementById('authGate2');
  if (gate && gate.style.display !== 'none' && gate.isConnected) {
    startAuthFloat('authParticlesL1');
    bindAuthHeartBtn('authHeartL1');
  }
  if (gate2 && gate2.style.display !== 'none' && gate2.isConnected) {
    startAuthFloat('authParticlesL2');
    bindAuthHeartBtn('authHeartL2');
  }
}

let voiceRec = null;
let voiceCanvasActive = false;
let voiceNoteActive = false;
let _voiceTapGuard = 0;
let _voiceStopping = false;
let _voiceRestartTimer = null;
let _voiceNoSpeechRetries = 0;
let _voiceSession = null;

const VOICE_ERR_MSG = {
  network: '语音识别需要联网哦，连上网后再试～',
  'not-allowed': '请允许麦克风权限哦',
  'service-not-allowed': '当前浏览器不支持语音，请用 Chrome 打开',
  'audio-capture': '找不到麦克风，请检查手机设置',
  'not-supported': '浏览器不支持语音输入',
};

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function weakVoiceBrowserHint() {
  const ua = navigator.userAgent || '';
  if (/MicroMessenger/i.test(ua)) return '微信里语音常不可用，请点右上角「⋯」→ 在浏览器打开';
  if (/QQ\//i.test(ua)) return 'QQ 内置浏览器可能不支持语音，请用 Chrome 打开';
  return null;
}

function checkVoiceReadySync() {
  const weak = weakVoiceBrowserHint();
  if (weak) return { ok: false, msg: weak };
  if (!getSpeechRecognition()) {
    return { ok: false, msg: '当前浏览器不支持语音，请用手机 Chrome 打开本页' };
  }
  if (!window.isSecureContext && location.protocol !== 'file:') {
    return { ok: false, msg: '语音需要在 https 安全链接下使用' };
  }
  return { ok: true };
}

function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function setVoiceBtnActive(on) {
  document.querySelectorAll('#drawVoiceBtn,#drawVoiceBtn2').forEach(b => b?.classList.toggle('on', on));
}

function clearVoiceRestartTimer() {
  if (_voiceRestartTimer) { clearTimeout(_voiceRestartTimer); _voiceRestartTimer = null; }
}

function stopVoiceInput(showToast) {
  _voiceStopping = true;
  voiceCanvasActive = false;
  voiceNoteActive = false;
  _voiceSession = null;
  clearVoiceRestartTimer();
  if (voiceRec) {
    const rec = voiceRec;
    voiceRec = null;
    rec.onend = rec.onerror = rec.onresult = rec.onstart = null;
    try { rec.stop(); } catch {}
  }
  setVoiceBtnActive(false);
  setTimeout(() => { _voiceStopping = false; }, 200);
  if (showToast) toast('语音已结束');
}

function handleVoiceError(ev, onFatal) {
  const err = ev?.error || '';
  if (_voiceStopping || err === 'aborted') return false;
  if (err === 'no-speech') {
    if (_voiceNoSpeechRetries < 12) {
      _voiceNoSpeechRetries++;
      return 'retry';
    }
    return 'retry';
  }
  const msg = VOICE_ERR_MSG[err];
  if (msg) { onFatal?.(msg); return 'fatal'; }
  if (_voiceNoSpeechRetries < 4) {
    _voiceNoSpeechRetries++;
    return 'retry';
  }
  onFatal?.('语音暂时不可用，请换 Chrome 浏览器或检查网络');
  return 'fatal';
}

function scheduleVoiceRestart(run) {
  clearVoiceRestartTimer();
  _voiceRestartTimer = setTimeout(() => {
    _voiceRestartTimer = null;
    if (voiceCanvasActive || voiceNoteActive) run();
  }, 350);
}

function runVoiceSession(cfg) {
  const SR = getSpeechRecognition();
  if (!SR || (!voiceCanvasActive && !voiceNoteActive)) return;
  if (_voiceStopping) return;

  const rec = new SR();
  voiceRec = rec;
  rec.lang = 'zh-CN';
  rec.continuous = !isIOSDevice();
  rec.interimResults = true;
  rec.maxAlternatives = 1;

  if (cfg.mode === 'note' && cfg.textarea && !cfg._noteBase) {
    let b = cfg.textarea.value;
    if (b && !b.endsWith('\n')) b += '\n';
    cfg._noteBase = b;
  }

  const onListening = () => {
    _voiceNoSpeechRetries = 0;
    cfg.onListening?.();
  };

  rec.onstart = () => onListening();

  rec.onresult = e => {
    _voiceNoSpeechRetries = 0;
    if (cfg.mode === 'canvas') {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) drawTextOnCanvas(e.results[i][0].transcript);
      }
    } else if (cfg.mode === 'note' && cfg.textarea) {
      let fin = '', interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) fin += t;
        else interim += t;
      }
      if (fin) cfg._noteBase = (cfg._noteBase || '') + fin;
      cfg.textarea.value = (cfg._noteBase || '') + interim;
    }
  };

  rec.onerror = ev => {
    const r = handleVoiceError(ev, msg => stopVoiceInput(false) || toast(msg));
    if (r === 'retry' && (voiceCanvasActive || voiceNoteActive) && !_voiceStopping) {
      voiceRec = null;
      scheduleVoiceRestart(() => runVoiceSession(cfg));
    }
  };

  rec.onend = () => {
    voiceRec = null;
    if (_voiceStopping) return;
    if (voiceCanvasActive || voiceNoteActive) {
      scheduleVoiceRestart(() => runVoiceSession(cfg));
    } else {
      cfg.onIdle?.();
    }
  };

  try {
    rec.start();
  } catch {
    voiceRec = null;
    if (voiceCanvasActive || voiceNoteActive) {
      scheduleVoiceRestart(() => runVoiceSession(cfg));
    }
  }
}

function startVoiceEngine(mode, options = {}) {
  if (mode === 'note' && voiceNoteActive) { stopVoiceInput(true); return false; }
  if (mode === 'canvas' && voiceCanvasActive) { stopVoiceInput(true); return false; }

  const ready = checkVoiceReadySync();
  if (!ready.ok) { toast(ready.msg); return false; }

  if (mode === 'canvas') {
    voiceNoteActive = false;
    voiceCanvasActive = true;
  } else {
    voiceCanvasActive = false;
    voiceNoteActive = true;
  }
  _voiceStopping = false;
  _voiceNoSpeechRetries = 0;

  const cfg = {
    mode,
    textarea: options.textarea || null,
    onListening: options.onListening,
    onIdle: options.onIdle,
    _noteBase: mode === 'note' && options.textarea
      ? (() => { let b = options.textarea.value; return b && !b.endsWith('\n') ? b + '\n' : b; })()
      : '',
  };
  _voiceSession = cfg;

  runVoiceSession(cfg);
  return true;
}

function startVoiceToText(textareaSelector, statusSelector) {
  const ta = typeof textareaSelector === 'string' ? document.querySelector(textareaSelector) : textareaSelector;
  const st = statusSelector ? (typeof statusSelector === 'string' ? document.querySelector(statusSelector) : statusSelector) : null;
  if (!ta) return null;
  const started = startVoiceEngine('note', {
    textarea: ta,
    onListening: () => { if (st) st.textContent = '正在听你说… 🎤'; },
    onIdle: () => { if (st) st.textContent = ''; },
  });
  if (started) toast('开始听啦，点「停止」结束');
  return voiceRec;
}
window.startVoiceToText = startVoiceToText;
window.stopVoiceInput = stopVoiceInput;
window.checkVoiceReady = checkVoiceReadySync;

function mapVoiceMath(text) {
  const pairs = [
    ['根号', '√'], ['派', 'π'], ['圆周率', 'π'], ['无穷大', '∞'], ['无穷', '∞'],
    ['大于等于', '≥'], ['小于等于', '≤'], ['不等于', '≠'], ['平行于', '∥'], ['平行', '∥'], ['垂直', '⊥'],
    ['阿尔法', 'α'], ['贝塔', 'β'], ['西塔', 'θ'], ['德尔塔', 'Δ'], ['三角形', '△'],
    ['所以', '∴'], ['因为', '∵'], ['的平方', '²'], ['平方', '²'], ['立方', '³'],
    ['加', '+'], ['减', '-'], ['乘', '×'], ['除以', '÷'], ['等于', '=']
  ];
  let t = text;
  pairs.forEach(([k, v]) => { t = t.split(k).join(v); });
  return t.replace(/\s+/g, ' ').trim();
}

function drawTextOnCanvas(text) {
  const canvas = document.getElementById('drawCanvas');
  if (!canvas || typeof drawCtx === 'undefined' || !drawCtx || !text) return;
  const penEl = document.getElementById('penSize');
  const colorEl = document.getElementById('penColor');
  const psz = penEl ? +penEl.value : 8;
  const mapped = mapVoiceMath(text);
  const fontSize = Math.max(22, psz * 3.2);
  drawCtx.font = `${fontSize}px "PingFang SC","Microsoft YaHei",sans-serif`;
  drawCtx.fillStyle = colorEl?.value || '#45403c';
  const maxW = canvas.clientWidth - 32;
  const x = 16;
  let line = '';
  const flush = () => {
    if (!line) return;
    if (typeof voiceDrawY === 'undefined') voiceDrawY = 40;
    drawCtx.fillText(line, x, voiceDrawY);
    voiceDrawY += fontSize + 10;
    if (voiceDrawY > canvas.clientHeight - 24) voiceDrawY = 40;
    line = '';
  };
  for (const ch of mapped) {
    const test = line + ch;
    if (drawCtx.measureText(test).width > maxW && line) { flush(); line = ch; }
    else line = test;
  }
  flush();
  if (typeof pushDrawHistory === 'function') pushDrawHistory();
  if (typeof syncOnVoiceText === 'function') syncOnVoiceText(mapped);
  if (typeof window.syncScheduleSnapshot === 'function') window.syncScheduleSnapshot();
}

function toggleVoiceOnCanvas(statusSelector) {
  const now = Date.now();
  if (now - _voiceTapGuard < 500) return;
  _voiceTapGuard = now;
  if (voiceCanvasActive) { stopVoiceInput(true); return; }
  const st = typeof statusSelector === 'string' ? document.querySelector(statusSelector) : statusSelector;
  const hint = '点「语音」说话，公式文字会出现在画布上';
  const started = startVoiceEngine('canvas', {
    onListening: () => {
      setVoiceBtnActive(true);
      if (st) st.textContent = '正在听你说… 说完自动写到画布 🎤';
    },
    onIdle: () => {
      setVoiceBtnActive(false);
      if (st) st.textContent = hint;
    },
  });
  if (started) toast('开始听啦，说「根号」「派」会转符号，再点停止');
}
window.toggleVoiceOnCanvas = toggleVoiceOnCanvas;
window.startVoiceOnCanvas = toggleVoiceOnCanvas;
window.drawTextOnCanvas = drawTextOnCanvas;

function copyText(text) {
  const done = () => toast('已复制到剪贴板 ✓');
  const fail = () => toast('请长按内容手动复制');
  if (!text) { toast('内容为空'); return; }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done, fail));
  } else fallbackCopy(text, done, fail);
}
function copyLatexRaw(text) {
  const done = () => toast('LaTeX 原样已复制 ✓');
  const fail = () => toast('复制失败，请全选输入框手动复制');
  if (!text) { toast('内容为空'); return; }
  fallbackCopy(text, done, fail);
}
window.copyLatexRaw = copyLatexRaw;
function fallbackCopy(text, done, fail) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;left:-9999px;top:0;font-family:Consolas,monospace';
  document.body.appendChild(ta);
  ta.focus();
  ta.setSelectionRange(0, text.length);
  try { document.execCommand('copy') ? done() : fail(); } catch { fail(); }
  document.body.removeChild(ta);
}

async function domToCanvas(el, scale) {
  if (typeof html2canvas === 'undefined') throw new Error('html2canvas missing');
  return html2canvas(el, {
    scale: scale || (window.devicePixelRatio > 1 ? 2 : 1.5),
    backgroundColor: getComputedStyle(document.body).getPropertyValue('--surface').trim() || '#fdfcfb',
    logging: false, useCORS: true, allowTaint: true
  });
}

async function saveCanvasAsImage(canvas, filename) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) { reject(); return; }
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: filename }).then(resolve).catch(() => downloadBlob(blob, filename).then(resolve));
      } else downloadBlob(blob, filename).then(resolve);
    }, 'image/png', 0.95);
  });
}

function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  toast('图片已保存，可到相册分享');
  return Promise.resolve();
}

async function exportElementImage(selector, filename) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) { toast('未找到导出区域'); return; }
  try {
    toast('正在生成图片…');
    const canvas = await domToCanvas(el);
    await saveCanvasAsImage(canvas, filename || `导出_${today()}.png`);
  } catch (e) { toast('导出失败，请重试'); console.warn(e); }
}

async function copyElementAsImage(selector) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return;
  try {
    const canvas = await domToCanvas(el);
    canvas.toBlob(async blob => {
      if (!blob) { toast('生成图片失败'); return; }
      if (navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          toast('图片已复制 ✓');
          return;
        } catch {}
      }
      await downloadBlob(blob, `公式_${today()}.png`);
    }, 'image/png');
  } catch { toast('复制图片失败，请用「保存图片」'); }
}

async function exportLongImage(selector, filename) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) { toast('未找到内容'); return; }
  try {
    toast('正在生成长图…');
    const canvas = await domToCanvas(el);
    await saveCanvasAsImage(canvas, filename || `长图_${today()}.png`);
  } catch (e) { toast('长图导出失败'); }
}

// 手写板数学符号戳印
const MATH_STAMPS = ['±','√','π','Δ','∞','≤','≥','≠','∈','⊥','∥','°','²','³','½','α','β','θ','λ','∴','∵','→','⇒','|','(',')'];

function speakSweetAlert(text, gender) {
  if (!text || typeof speechSynthesis === 'undefined') return;
  try { speechSynthesis.cancel(); } catch {}
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = gender === 'female' ? 1.05 : 0.95;
  u.pitch = gender === 'female' ? 1.15 : 0.85;
  u.volume = 1;
  try { speechSynthesis.speak(u); } catch {}
}

window.speakSweetAlert = speakSweetAlert;
