// 登录门禁 · 轻量优先加载（微信/QQ 内置浏览器里大包 JS 解析完之前也能点）
(function () {
  const PASS_L1 = ['060303', '060126'];
  const PASS_L2 = '123';
  const KEY_L1 = 'math-auth-l1';
  const KEY = 'math-auth-session';
  const BGM_FILE = 'liaobiaoxinyi.mp3';

  let bgm = null;
  let bgmTried = false;

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
    const wrap = e => { tryPlayBgm(); fn(e); };
    el.addEventListener('click', wrap);
    el.addEventListener('touchend', e => { e.preventDefault(); wrap(e); }, { passive: false });
  }

  function showMsg(id, text, danger) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    if (danger !== undefined) el.style.color = danger ? 'var(--danger, #c47a7a)' : '';
  }

  function ensureBgm() {
    if (bgm) return bgm;
    const el = document.getElementById('authBgm');
    if (!el) return null;
    el.src = BGM_FILE;
    el.loop = false;
    bgm = el;
    el.addEventListener('error', () => {
      document.getElementById('authMusicBtn')?.remove();
    });
    el.addEventListener('ended', () => {
      try { el.pause(); el.currentTime = 0; } catch {}
      document.getElementById('authMusicBtn')?.remove();
    });
    return bgm;
  }

  function tryPlayBgm() {
    if (isAuthed() && window._authEarlyDone) return;
    const a = ensureBgm();
    if (!a || (!a.paused && a.currentTime > 0)) return;
    a.play().then(() => {
      document.getElementById('authMusicBtn')?.remove();
    }).catch(() => showMusicBtn());
  }

  function showMusicBtn() {
    if (document.getElementById('authMusicBtn')) return;
    const gate = document.getElementById('authGate') || document.getElementById('authGate2');
    if (!gate) return;
    const btn = document.createElement('button');
    btn.id = 'authMusicBtn';
    btn.type = 'button';
    btn.className = 'auth-music-btn';
    btn.textContent = '🎵 聊表心意';
    const onTap = e => {
      e.preventDefault();
      const au = ensureBgm();
      if (!au) return;
      au.play().catch(() => {
        btn.textContent = '🎵 请先放入 liaobiaoxinyi.mp3';
      });
    };
    btn.addEventListener('click', onTap);
    btn.addEventListener('touchend', onTap, { passive: false });
    gate.appendChild(btn);
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
      tryPlayBgm();
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
    ensureBgm();
    setTimeout(tryPlayBgm, 300);

    setTimeout(() => {
      if (!window._bootAppCalled && (document.getElementById('authGate') || document.getElementById('authGate2'))) {
        const msgEl = document.getElementById('authMsg') || document.getElementById('authMsg2');
        if (msgEl && !msgEl.textContent) showMsg(msgEl.id, '可先输入口令，后台正在加载…');
      }
    }, 1200);
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
