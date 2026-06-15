// 登录门禁 · 轻量优先加载 + 聊表心意 BGM + 登录页爱心特效
(function () {
  const PASS_L1 = ['060303', '060126'];
  const PASS_L2 = '123';
  const KEY_L1 = 'math-auth-l1';
  const KEY = 'math-auth-session';
  const BGM_FILE = 'liaobiaoxinyi.mp3';
  const AUTH_PARTICLES = ['💕', '💗', '💖', '❤️', '🩷', '✨', '⭐', '🌟', '💫', '♡'];
  const APP_SCRIPTS = ['app-main.js', 'app-mobile.js', 'app-lazy.js'];

  let bgm = null;
  let bgmPlaying = false;
  let bgmRetryTimer = null;
  let appScriptsLoading = null;

  function ssGet(k) {
    try { return sessionStorage.getItem(k); } catch { return null; }
  }
  function ssSet(k, v) {
    try { sessionStorage.setItem(k, v); } catch {}
  }
  function isAuthedL1() { return ssGet(KEY_L1) === '1'; }
  function isAuthed() { return ssGet(KEY) === '1'; }

  function tap(el, fn) {
    if (!el || el._authTap) return;
    el._authTap = true;
    el.addEventListener('click', fn);
    el.addEventListener('touchend', e => { e.preventDefault(); fn(e); }, { passive: false });
  }

  function showMsg(id, text, danger) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    if (danger !== undefined) el.style.color = danger ? 'var(--danger, #c47a7a)' : '';
  }

  function loadAppScripts() {
    if (window._appScriptsReady) return Promise.resolve();
    if (appScriptsLoading) return appScriptsLoading;
    appScriptsLoading = new Promise(resolve => {
      let i = 0;
      const next = () => {
        if (i >= APP_SCRIPTS.length) {
          window._appScriptsReady = true;
          resolve();
          return;
        }
        const src = APP_SCRIPTS[i++];
        if (document.querySelector(`script[src="${src}"]`)) { next(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.async = false;
        s.onload = next;
        s.onerror = () => { console.warn('script load:', src); next(); };
        document.body.appendChild(s);
      };
      next();
    });
    return appScriptsLoading;
  }

  function runBootApp() {
    if (window._bootAppFn && !window._bootAppCalled) {
      window._bootAppCalled = true;
      window._bootAppFn();
    }
  }

  /* ── 登录页 · 点击爱心 / 飘落粒子 ── */
  function spawnAuthHeartBurst(x, y, big) {
    const icons = ['💕', '💖', '❤️', '🩷', '✨', '⭐', '♡', '🌟', '💗'];
    const n = big ? 24 : 14;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');
      el.className = big ? 'auth-burst auth-burst-big' : 'auth-burst';
      el.textContent = icons[Math.floor(Math.random() * icons.length)];
      const angle = (Math.PI * 2 * i) / n + Math.random() * 0.5;
      const dist = (big ? 55 : 32) + Math.random() * (big ? 100 : 42);
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
      el.style.setProperty('--by', Math.sin(angle) * dist + 'px');
      document.body.appendChild(el);
      setTimeout(() => el.remove(), big ? 1300 : 950);
    }
  }

  function bindAuthHeartBtn(id) {
    const btn = document.getElementById(id);
    if (!btn || btn._heartBound) return;
    btn._heartBound = true;
    const pop = e => {
      const r = btn.getBoundingClientRect();
      spawnAuthHeartBurst(r.left + r.width / 2, r.top + r.height / 2, true);
      btn.classList.add('heart-pop');
      setTimeout(() => btn.classList.remove('heart-pop'), 350);
      e.preventDefault();
      e.stopPropagation();
    };
    btn.addEventListener('click', pop);
    btn.addEventListener('touchend', pop, { passive: false });
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

  function bindAuthUiEffects() {
    const gate = document.getElementById('authGate');
    const gate2 = document.getElementById('authGate2');
    if (gate && gate.style.display !== 'none') {
      startAuthFloat('authParticlesL1');
      bindAuthHeartBtn('authHeartL1');
    }
    if (gate2 && gate2.style.display !== 'none') {
      startAuthFloat('authParticlesL2');
      bindAuthHeartBtn('authHeartL2');
    }
  }

  /* ── BGM 角标 ── */
  function showPlayingBadge() {
    let badge = document.getElementById('authBgmBadge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'authBgmBadge';
      badge.className = 'auth-bgm-badge';
      badge.textContent = '🎵 聊表心意';
      document.body.appendChild(badge);
    }
    badge.style.display = 'block';
  }

  function hidePlayingBadge() {
    const badge = document.getElementById('authBgmBadge');
    if (badge) badge.style.display = 'none';
  }

  /* ── 播完 · 浪漫终章烟花 ── */
  function heartPoint(t, scale) {
    const x = 16 * Math.pow(Math.sin(t), 3) * scale;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
    return { x, y };
  }

  function spawnHeartShape(cx, cy, scale, steps) {
    const icons = ['💕', '💖', '❤️', '🩷', '♥', '💗', '✨'];
    const dotColors = ['#ff6b9d', '#ff8fab', '#ffb3c6', '#e8457a', '#ffc0cb', '#f472b6'];
    const glow = document.createElement('div');
    glow.className = 'bgm-heart-glow';
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    document.body.appendChild(glow);
    setTimeout(() => glow.remove(), 2200);
    for (let i = 0; i < steps; i++) {
      const t = (Math.PI * 2 * i) / steps;
      const pt = heartPoint(t, scale);
      const px = cx + pt.x;
      const py = cy + pt.y;
      const burst = 1.5 + Math.random() * 1.0;
      const hx = pt.x * burst + (Math.random() - 0.5) * 28;
      const hy = pt.y * burst + (Math.random() - 0.5) * 28;
      if (i % 2 === 0) {
        const dot = document.createElement('span');
        dot.className = 'bgm-heart-dot';
        dot.style.left = px + 'px';
        dot.style.top = py + 'px';
        dot.style.background = dotColors[i % dotColors.length];
        dot.style.setProperty('--hx', hx + 'px');
        dot.style.setProperty('--hy', hy + 'px');
        dot.style.animationDelay = (Math.random() * 0.18) + 's';
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 2400);
      }
      const el = document.createElement('span');
      el.className = 'bgm-heart-particle';
      el.textContent = icons[i % icons.length];
      el.style.left = px + 'px';
      el.style.top = py + 'px';
      el.style.setProperty('--hx', hx + 'px');
      el.style.setProperty('--hy', hy + 'px');
      el.style.animationDelay = (Math.random() * 0.15) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2400);
    }
  }

  function launchBalloons() {
    const colors = ['#ff6b9d', '#ff8fab', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98', '#ffc0cb', '#f9a8d4'];
    for (let i = 0; i < 16; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'bgm-balloon';
        el.style.left = (5 + Math.random() * 88) + '%';
        el.style.background = `radial-gradient(circle at 35% 30%, rgba(255,255,255,.55), ${colors[i % colors.length]})`;
        el.style.setProperty('--sway', ((Math.random() - 0.5) * 60) + 'px');
        el.style.animationDuration = (4.5 + Math.random() * 3) + 's';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 9000);
      }, i * 180);
    }
  }

  function showLoveYouFinale() {
    const wrap = document.createElement('div');
    wrap.className = 'bgm-love-wrap';
    wrap.innerHTML = '<div class="bgm-love-text">Love You</div>';
    document.body.appendChild(wrap);
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w * 0.5;
    const cy = h * 0.5;
    for (let i = 0; i < 36; i++) {
      setTimeout(() => {
        const angle = (Math.PI * 2 * i) / 36;
        const dist = 80 + Math.random() * 60;
        const px = cx + Math.cos(angle) * dist;
        const py = cy + Math.sin(angle) * dist * 0.55;
        const el = document.createElement('span');
        el.className = 'bgm-heart-particle';
        el.textContent = ['💕', '💖', '❤️', '♥'][i % 4];
        el.style.left = px + 'px';
        el.style.top = py + 'px';
        el.style.fontSize = (1 + Math.random() * 0.6) + 'rem';
        el.style.setProperty('--hx', (Math.cos(angle) * 40) + 'px');
        el.style.setProperty('--hy', (Math.sin(angle) * 30 - 20) + 'px');
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2600);
      }, i * 40);
    }
    setTimeout(() => wrap.remove(), 4500);
  }

  function buildCouplePoints() {
    const pts = [];
    const addCircle = (cx, cy, r, n) => {
      for (let i = 0; i < n; i++) {
        const a = (2 * Math.PI * i) / n;
        pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
      }
    };
    const addLine = (x1, y1, x2, y2, steps) => {
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        pts.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t });
      }
    };
    const addFill = (cx, cy, rx, ry, n) => {
      for (let j = 0; j < n; j++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random());
        pts.push({ x: cx + rx * r * Math.cos(a), y: cy + ry * r * Math.sin(a) });
      }
    };
    addCircle(0.34, 0.16, 0.058, 22);
    addCircle(0.66, 0.14, 0.054, 22);
    addFill(0.34, 0.38, 0.075, 0.15, 35);
    addFill(0.66, 0.36, 0.07, 0.14, 35);
    addLine(0.34, 0.22, 0.34, 0.60, 14);
    addLine(0.66, 0.20, 0.66, 0.58, 14);
    addLine(0.24, 0.28, 0.34, 0.36, 10);
    addLine(0.22, 0.36, 0.20, 0.54, 8);
    addLine(0.42, 0.32, 0.58, 0.32, 12);
    addLine(0.76, 0.28, 0.66, 0.34, 10);
    addLine(0.78, 0.34, 0.80, 0.52, 8);
    addLine(0.50, 0.34, 0.46, 0.42, 6);
    addLine(0.46, 0.42, 0.54, 0.42, 6);
    addLine(0.32, 0.60, 0.26, 0.90, 10);
    addLine(0.36, 0.60, 0.38, 0.90, 10);
    addLine(0.62, 0.58, 0.56, 0.90, 10);
    addLine(0.70, 0.58, 0.76, 0.90, 10);
    for (let t = 0; t <= 1; t += 0.05) {
      pts.push({ x: 0.50 + 0.16 * Math.cos(Math.PI + t * Math.PI), y: 0.34 + 0.14 * Math.sin(t * Math.PI) });
    }
    return pts;
  }

  function launchCoupleSilhouette() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = w * 0.5;
    const cy = h * 0.48;
    const scale = Math.min(w, h) * 1.08;
    const pts = buildCouplePoints();
    const hold = [];

    const glow = document.createElement('div');
    glow.className = 'bgm-couple-glow';
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    document.body.appendChild(glow);
    setTimeout(() => glow.remove(), 5000);

    pts.forEach((p, i) => {
      setTimeout(() => {
        const px = cx + (p.x - 0.5) * scale;
        const py = cy + (p.y - 0.38) * scale;
        const dot = document.createElement('span');
        dot.className = 'bgm-couple-solid-dot';
        dot.style.left = px + 'px';
        dot.style.top = py + 'px';
        dot.style.animationDelay = (i * 0.006) + 's';
        document.body.appendChild(dot);
        hold.push(dot);
        if (i % 3 === 0) {
          const el = document.createElement('span');
          el.className = 'bgm-couple-solid';
          el.textContent = ['❤️', '💕', '💖', '🩷'][i % 4];
          el.style.left = px + 'px';
          el.style.top = py + 'px';
          el.style.animationDelay = (i * 0.006) + 's';
          document.body.appendChild(el);
          hold.push(el);
        }
      }, i * 6);
    });

    const chestX = cx;
    const chestY = cy + (0.36 - 0.38) * scale;
    setTimeout(() => {
      spawnHeartShape(chestX, chestY, Math.min(w, h) * 0.022, 68);
      spawnHeartShape(cx, cy - scale * 0.02, Math.min(w, h) * 0.017, 56);
    }, pts.length * 6 + 900);
    setTimeout(() => hold.forEach(el => el.remove()), 8500);
  }

  function launchRomanticFinale() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const base = Math.min(w, h);
    const positions = [
      { x: w * 0.5, y: h * 0.35, s: base * 0.013 },
      { x: w * 0.22, y: h * 0.28, s: base * 0.009 },
      { x: w * 0.78, y: h * 0.28, s: base * 0.009 },
      { x: w * 0.15, y: h * 0.55, s: base * 0.008 },
      { x: w * 0.85, y: h * 0.55, s: base * 0.008 },
      { x: w * 0.35, y: h * 0.68, s: base * 0.007 },
      { x: w * 0.65, y: h * 0.68, s: base * 0.007 },
      { x: w * 0.5, y: h * 0.18, s: base * 0.010 },
    ];
    positions.forEach((p, i) => setTimeout(() => spawnHeartShape(p.x, p.y, p.s, 52), i * 350));
    setTimeout(launchBalloons, 1200);
    setTimeout(showLoveYouFinale, 3800);
    setTimeout(launchCoupleSilhouette, 6200);
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => spawnHeartShape(
          w * (0.2 + Math.random() * 0.6),
          h * (0.2 + Math.random() * 0.5),
          base * (0.008 + Math.random() * 0.005),
          44
        ), i * 400);
      }
    }, 9000);
  }

  function stopBgmRetry() {
    if (bgmRetryTimer) {
      clearInterval(bgmRetryTimer);
      bgmRetryTimer = null;
    }
  }

  function ensureBgm() {
    if (bgm) return bgm;
    let el = document.getElementById('authBgm');
    if (!el) {
      el = document.createElement('audio');
      el.id = 'authBgm';
      el.style.display = 'none';
      document.body.appendChild(el);
    }
    el.loop = false;
    el.volume = 1;
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', '');
    el.preload = 'none';
    if (!el.src || !el.src.includes(BGM_FILE)) el.src = BGM_FILE;
    bgm = el;
    el.addEventListener('playing', () => {
      bgmPlaying = true;
      stopBgmRetry();
      showPlayingBadge();
    });
    el.addEventListener('ended', () => {
      bgmPlaying = false;
      hidePlayingBadge();
      launchRomanticFinale();
    });
    el.addEventListener('error', () => hidePlayingBadge());
    el.addEventListener('canplay', () => startBgm(), { once: false });
    el.addEventListener('loadeddata', () => startBgm(), { once: false });
    return bgm;
  }

  function startBgm() {
    const a = ensureBgm();
    if (a.ended) return;
    if (bgmPlaying || (!a.paused && a.currentTime > 0)) return;
    a.play().then(() => {
      bgmPlaying = true;
      stopBgmRetry();
      showPlayingBadge();
    }).catch(() => {});
  }

  function setupWeixinAutoplay() {
    const run = () => {
      try {
        window.WeixinJSBridge.invoke('getNetworkType', {}, () => startBgm(), false);
      } catch {
        startBgm();
      }
    };
    if (typeof window.WeixinJSBridge === 'object') run();
    else document.addEventListener('WeixinJSBridgeReady', run, false);
  }

  function scheduleBgm() {
    const go = () => {
      ensureBgm();
      startBgm();
      setupWeixinAutoplay();
      let tries = 0;
      stopBgmRetry();
      bgmRetryTimer = setInterval(() => {
        tries++;
        if (bgmPlaying || tries > 40) { stopBgmRetry(); return; }
        startBgm();
      }, 800);
    };
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(go, { timeout: 1800 });
    } else {
      setTimeout(go, 500);
    }
  }

  function unlock(onDone) {
    const gate = document.getElementById('authGate');
    const gate2 = document.getElementById('authGate2');
    const app = document.querySelector('.app');
    stopAuthFloat('authParticlesL1');
    stopAuthFloat('authParticlesL2');
    gate?.classList.add('auth-out');
    gate2?.classList.add('auth-out');
    setTimeout(() => {
      gate?.remove();
      gate2?.remove();
      document.getElementById('authSuccessModal')?.remove();
      document.body.classList.remove('auth-pending');
      if (app) { app.style.display = ''; app.classList.add('ready'); }
      document.body.classList.add('app-ready');
      window._authEarlyDone = true;
      onDone?.();
      loadAppScripts().then(runBootApp);
    }, 380);
  }

  function showSuccessThenUnlock(onDone) {
    const modal = document.getElementById('authSuccessModal');
    if (!modal) { unlock(onDone); return; }
    modal.classList.add('show');
    setTimeout(() => {
      modal.classList.remove('show');
      setTimeout(() => unlock(onDone), 200);
    }, 1800);
  }

  function showLevel2() {
    const gate = document.getElementById('authGate');
    const gate2 = document.getElementById('authGate2');
    if (!gate2) return;
    stopAuthFloat('authParticlesL1');
    gate?.classList.add('auth-out');
    setTimeout(() => {
      if (gate) gate.style.display = 'none';
      gate2.style.display = 'flex';
      gate2.classList.remove('auth-out');
      startAuthFloat('authParticlesL2');
      bindAuthHeartBtn('authHeartL2');
      startBgm();
      document.getElementById('authPwd2')?.focus();
    }, 300);
  }

  function bindLevel2() {
    const inp = document.getElementById('authPwd2');
    const btn = document.getElementById('authBtn2');
    const submit = () => {
      const v = (inp?.value || '').trim();
      if (!v) { showMsg('authMsg2', '请输入双人专属密码哦', true); return; }
      if (v === PASS_L2) {
        ssSet(KEY_L1, '1');
        ssSet(KEY, '1');
        window._freshLogin = true;
        showSuccessThenUnlock();
        return;
      }
      showMsg('authMsg2', '暗号不对哦，再试试我们的小约定吧', true);
      if (inp) { inp.value = ''; inp.focus(); }
    };
    tap(btn, submit);
    inp?.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  }

  function bindLevel1() {
    let fails = 0;
    const inp = document.getElementById('authPwd');
    const btn = document.getElementById('authBtn');
    const submit = () => {
      const v = (inp?.value || '').trim();
      if (!v) { showMsg('authMsg', '要先输入我们的小口令哦～'); return; }
      if (PASS_L1.includes(v)) {
        ssSet(KEY_L1, '1');
        bindLevel2();
        showLevel2();
        return;
      }
      fails++;
      showMsg('authMsg', fails === 1 ? '入口已上锁，答对才能进～' : '哎呀，口令不对哦～只有婉宁小朋友可以进入的✨');
      if (inp) { inp.value = ''; inp.focus(); }
    };
    tap(btn, submit);
    inp?.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  }

  function bootEarlyAuth() {
    const gate = document.getElementById('authGate');
    const app = document.querySelector('.app');
    if (!gate) {
      document.body.classList.add('app-ready');
      return;
    }

    if (isAuthed()) {
      gate.remove();
      document.getElementById('authGate2')?.remove();
      document.getElementById('authSuccessModal')?.remove();
      document.body.classList.remove('auth-pending');
      app && (app.style.display = '');
      app?.classList.add('ready');
      document.body.classList.add('app-ready');
      window._authEarlyDone = true;
      return;
    }

    document.body.classList.add('auth-pending');
    if (app) app.style.display = 'none';

    if (isAuthedL1()) {
      document.getElementById('authGate').style.display = 'none';
      const gate2 = document.getElementById('authGate2');
      if (gate2) {
        gate2.style.display = 'flex';
        bindLevel2();
        startAuthFloat('authParticlesL2');
        bindAuthHeartBtn('authHeartL2');
      }
    } else {
      bindLevel1();
      bindAuthUiEffects();
    }

    window._authEarlyBound = true;
    scheduleBgm();
  }

  bootEarlyAuth();

  window.initAuthGate = function (onUnlock) {
    window._bootAppFn = onUnlock;
    bindAuthUiEffects();
    if (isAuthed() || window._authEarlyDone) {
      if (!window._bootAppCalled) loadAppScripts().then(runBootApp);
      return;
    }
    if (!window._authEarlyBound) bootEarlyAuth();
  };

  window.spawnAuthHeartBurst = spawnAuthHeartBurst;
  window.launchRomanticFinale = launchRomanticFinale;
  window.launchHeartFireworks = launchRomanticFinale;
})();
