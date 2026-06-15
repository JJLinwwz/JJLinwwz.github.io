// 登录门禁 · 轻量优先加载 + 聊表心意 BGM
(function () {
  const PASS_L1 = ['060303', '060126'];
  const PASS_L2 = '123';
  const KEY_L1 = 'math-auth-l1';
  const KEY = 'math-auth-session';
  const BGM_FILE = 'liaobiaoxinyi.mp3';

  let bgm = null;
  let bgmReady = false;

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
    const wrap = e => { startBgm(); fn(e); };
    el.addEventListener('click', wrap);
    el.addEventListener('touchend', e => { e.preventDefault(); wrap(e); }, { passive: false });
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
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', '');
    el.preload = 'auto';
    if (!el.src || !el.src.includes(BGM_FILE)) el.src = BGM_FILE;
    bgm = el;
    el.addEventListener('playing', showPlayingBadge);
    el.addEventListener('ended', () => {
      hidePlayingBadge();
      document.getElementById('authMusicBtn')?.remove();
    });
    el.addEventListener('error', () => {
      hidePlayingBadge();
      showMusicBtn('🎵 音乐加载失败，点我重试');
    });
    el.addEventListener('canplaythrough', () => { bgmReady = true; }, { once: true });
    return bgm;
  }

  function startBgm() {
    if (isAuthed() && window._authEarlyDone) return;
    const a = ensureBgm();
    if (!a.paused && a.currentTime > 0 && !a.ended) return;
    a.play().then(() => {
      showPlayingBadge();
      document.getElementById('authMusicBtn')?.remove();
    }).catch(() => showMusicBtn('🎵 点一下播放 · 聊表心意'));
  }

  function showMusicBtn(label) {
    if (document.getElementById('authMusicBtn')) return;
    const gate = document.getElementById('authGate') || document.getElementById('authGate2');
    if (!gate) return;
    const btn = document.createElement('button');
    btn.id = 'authMusicBtn';
    btn.type = 'button';
    btn.className = 'auth-music-btn';
    btn.textContent = label || '🎵 聊表心意';
    const onTap = e => { e.preventDefault(); e.stopPropagation(); startBgm(); };
    btn.addEventListener('click', onTap);
    btn.addEventListener('touchend', onTap, { passive: false });
    gate.appendChild(btn);
  }

  function bindBgmGestures() {
    const onceStart = () => startBgm();
    document.addEventListener('touchstart', onceStart, { once: true, passive: true });
    document.addEventListener('click', onceStart, { once: true });
  }

  function scheduleBgm() {
    bindBgmGestures();
    setTimeout(startBgm, 800);
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
      document.getElementById('authMusicBtn')?.remove();
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
      if (!v) { showMsg('authMsg', '要先输入小口令哦～'); return; }
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
})();
