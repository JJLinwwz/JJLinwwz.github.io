// 登录门禁 · 轻量优先加载 + 聊表心意 BGM
(function () {
  const PASS_L1 = ['060303', '060126'];
  const PASS_L2 = '123';
  const KEY_L1 = 'math-auth-l1';
  const KEY = 'math-auth-session';
  const BGM_FILE = 'liaobiaoxinyi.mp3';

  let bgm = null;
  let bgmPlaying = false;
  let bgmRetryTimer = null;

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

  function heartPoint(t, scale) {
    const x = 16 * Math.pow(Math.sin(t), 3) * scale;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;
    return { x, y };
  }

  function launchHeartFireworks() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const icons = ['💕', '💖', '❤️', '🩷', '♥', '💗', '✨'];
    const dotColors = ['#ff6b9d', '#ff8fab', '#ffb3c6', '#e8457a', '#ffc0cb', '#f472b6'];
    const centers = [
      { x: w * 0.5, y: h * 0.4, scale: Math.min(w, h) * 0.011 },
      { x: w * 0.28, y: h * 0.58, scale: Math.min(w, h) * 0.008 },
      { x: w * 0.72, y: h * 0.58, scale: Math.min(w, h) * 0.008 },
    ];

    centers.forEach((center, bi) => {
      setTimeout(() => {
        const glow = document.createElement('div');
        glow.className = 'bgm-heart-glow';
        glow.style.left = center.x + 'px';
        glow.style.top = center.y + 'px';
        document.body.appendChild(glow);
        setTimeout(() => glow.remove(), 2000);

        const steps = 48;
        for (let i = 0; i < steps; i++) {
          const t = (Math.PI * 2 * i) / steps;
          const pt = heartPoint(t, center.scale);
          const px = center.x + pt.x;
          const py = center.y + pt.y;
          const burst = 1.6 + Math.random() * 0.8;
          const hx = pt.x * burst + (Math.random() - 0.5) * 24;
          const hy = pt.y * burst + (Math.random() - 0.5) * 24;

          if (i % 3 === 0) {
            const dot = document.createElement('span');
            dot.className = 'bgm-heart-dot';
            dot.style.left = px + 'px';
            dot.style.top = py + 'px';
            dot.style.background = dotColors[i % dotColors.length];
            dot.style.setProperty('--hx', hx + 'px');
            dot.style.setProperty('--hy', hy + 'px');
            dot.style.animationDelay = (Math.random() * 0.15) + 's';
            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), 2200);
          }

          const el = document.createElement('span');
          el.className = 'bgm-heart-particle';
          el.textContent = icons[i % icons.length];
          el.style.left = px + 'px';
          el.style.top = py + 'px';
          el.style.setProperty('--hx', hx + 'px');
          el.style.setProperty('--hy', hy + 'px');
          el.style.animationDelay = (Math.random() * 0.12) + 's';
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 2200);
        }
      }, bi * 450);
    });
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
    el.preload = 'auto';
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
      launchHeartFireworks();
    });
    el.addEventListener('error', () => {
      hidePlayingBadge();
    });
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
    ensureBgm();
    startBgm();
    setupWeixinAutoplay();
    let tries = 0;
    stopBgmRetry();
    bgmRetryTimer = setInterval(() => {
      tries++;
      if (bgmPlaying || tries > 40) {
        stopBgmRetry();
        return;
      }
      startBgm();
    }, 800);
  }

  function unlock(onDone) {
    const gate = document.getElementById('authGate');
    const gate2 = document.getElementById('authGate2');
    const app = document.querySelector('.app');
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
      if (window._bootAppFn && !window._bootAppCalled) {
        window._bootAppCalled = true;
        window._bootAppFn();
      }
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
    gate?.classList.add('auth-out');
    setTimeout(() => {
      if (gate) gate.style.display = 'none';
      gate2.style.display = 'flex';
      gate2.classList.remove('auth-out');
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
      }
    } else {
      bindLevel1();
    }

    window._authEarlyBound = true;
    scheduleBgm();
  }

  bootEarlyAuth();

  window.initAuthGate = function (onUnlock) {
    window._bootAppFn = onUnlock;
    if (isAuthed() || window._authEarlyDone) {
      if (!window._bootAppCalled) {
        window._bootAppCalled = true;
        onUnlock?.();
      }
      return;
    }
    if (!window._authEarlyBound) bootEarlyAuth();
  };

  window.launchHeartFireworks = launchHeartFireworks;
})();
