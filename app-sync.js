// 双人小屋 · 画板同步 + 回忆相册 + 相片分享（Supabase 实时云端）

(function () {

  function getCfg() {

    const base = window.SYNC_CONFIG || {};

    try {

      const raw = localStorage.getItem('sync-config-override');

      if (raw) {

        const o = JSON.parse(raw);

        return {

          ...base, ...o,

          enabled: true,

          supabase: { ...base.supabase, ...(o.supabase || {}) },

        };

      }

    } catch {}

    return base;

  }



  const STORAGE_ID = 'sync-client-id';

  const STORAGE_ROLE = 'sync-role';

  const STORAGE_NAME = 'sync-display-name';
  const ROLE_PICKED_SESSION_KEY = 'sync-role-picked-session';

  const LOCAL_CANVAS = 'sync-canvas-persist';

  const LOCAL_HISTORY = 'sync-history-local';

  const LOCAL_PHOTOS = 'sync-photos-local';



  let sb = null;

  let syncChannel = null;

  let myId = '';

  let myName = '';

  let myRole = '';

  let connected = false;

  let applyingRemote = false;

  let pushTimer = null;

  let lastPushTs = 0;

  let currentStroke = null;

  let strokeListenersBound = false;

  let joinTs = 0;

  let persistTimer = null;

  let lastLiveV = 0;

  let drawListenersOn = false;

  let hubReady = false;

  let presenceTimer = null;

  let livePollTimer = null;

  function getCanvasLogicalSize(canvas) {
    if (typeof window.getDrawLogicalSize === 'function') return window.getDrawLogicalSize(canvas);
    const dpr = window.devicePixelRatio || 1;
    return { w: canvas.width / dpr || canvas.clientWidth || 1, h: canvas.height / dpr || canvas.clientHeight || 1 };
  }

  function cacheLiveSnapshot(image, v) {
    if (!image) return;
    const ver = v || Date.now();
    if (ver <= lastLiveV) return;
    lastLiveV = ver;
    window._cachedLiveSnapshot = { image, v: ver };
    try { localStorage.setItem(LOCAL_CANVAS, JSON.stringify({ image, v: ver })); } catch {}
  }

  function maybeApplyCachedSnapshot() {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas || typeof drawCtx === 'undefined' || !drawCtx) return;
    let snap = window._cachedLiveSnapshot;
    if (!snap?.image) {
      try { snap = JSON.parse(localStorage.getItem(LOCAL_CANVAS) || 'null'); } catch {}
    }
    if (!snap?.image || !shouldApplyRemoteSnapshot()) return;
    applyRemoteSnapshot(snap.image, true);
  }

  async function fetchAndCacheLive() {
    if (!sb || !cfgOk()) return;
    try {
      const { data } = await sb.from('room_live').select('*').eq('room_id', roomId()).maybeSingle();
      if (data?.image && (data.v || 0) > lastLiveV && data.by_user !== myId) {
        cacheLiveSnapshot(data.image, data.v);
        maybeApplyCachedSnapshot();
      }
    } catch {}
  }

  async function refreshDrawFromCloud() {
    if (!sb || !cfgOk()) return;
    try {
      const { data } = await sb.from('room_persist').select('*').eq('room_id', roomId()).maybeSingle();
      if (data?.image && (data.v || 0) > lastLiveV) {
        cacheLiveSnapshot(data.image, data.v);
      }
    } catch {}
    await fetchAndCacheLive();
    maybeApplyCachedSnapshot();
  }

  function startBackgroundLivePoll() {
    if (livePollTimer || !cfgOk()) return;
    livePollTimer = setInterval(() => {
      if (window._isDrawing) return;
      fetchAndCacheLive();
    }, 3500);
  }

  function stopBackgroundLivePoll() {
    if (livePollTimer) { clearInterval(livePollTimer); livePollTimer = null; }
  }

  let photoNotifySince = 0;

  let currentSyncPage = '';

  let lastPresenceUsers = [];
  const SYNC_MODULES = ['draw', 'photos', 'chat'];
  let knownPeerOnline = { wanning: false, partner: false };
  let knownPeerPage = { wanning: '', partner: '' };
  let lastPeerNotify = {
    wanning: { join: 0, leave: 0, same: 0 },
    partner: { join: 0, leave: 0, same: 0 },
  };
  let presenceInitialized = false;
  let globalHeartbeatTimer = null;
  const PRESENCE_STALE_MS = 180000;
  const PRESENCE_HEARTBEAT_MS = 8000;
  const PRESENCE_CLEANUP_STALE_MS = 300000;
  const PRESENCE_NOTIFY_COOLDOWN = 45000;

  const GREET_KEY = 'sync-self-greeted';



  // partner=婉(女)  wanning=哲(男) — 与选人按钮 data-role 对应
  const ROLE_LABEL = { partner: '婉', wanning: '哲' };

  const ROLE_COLOR = { partner: '#e8789a', wanning: '#7a9fd4' };

  function migrateRoleKeysV2() {
    if (localStorage.getItem('sync-role-keys-v2')) return;
    const name = localStorage.getItem(STORAGE_NAME);
    const role = getRole();
    if (name === '婉' || name === '婉宁') {
      localStorage.setItem(STORAGE_ROLE, 'partner');
    } else if (name === '哲' || name === '你') {
      localStorage.setItem(STORAGE_ROLE, 'wanning');
    } else if (role === 'wanning') {
      localStorage.setItem(STORAGE_ROLE, 'partner');
    } else if (role === 'partner') {
      localStorage.setItem(STORAGE_ROLE, 'wanning');
    }
    localStorage.setItem('sync-role-keys-v2', '1');
  }
  migrateRoleKeysV2();



  function roomId() { return getCfg().roomId || 'wanning-xiaowu'; }



  function cfgOk() {

    const CFG = getCfg();

    const s = CFG.supabase || {};

    return CFG.enabled && s.url && s.anonKey &&

      s.url !== '在此填写' && s.anonKey !== '在此填写' &&

      !s.url.includes('你的项目');

  }



  function getClientId() {

    let id = localStorage.getItem(STORAGE_ID);

    if (!id) {

      id = 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

      localStorage.setItem(STORAGE_ID, id);

    }

    return id;

  }



  function getRole() { return localStorage.getItem(STORAGE_ROLE) || ''; }

  function syncMyIdentity() {
    myId = getClientId();
    let role = getRole();
    if (!role) return;
    const custom = localStorage.getItem(STORAGE_NAME);
    if (custom === '婉' || custom === '婉宁') role = 'partner';
    else if (custom === '哲' || custom === '你') role = 'wanning';
    myRole = role;
    myName = ROLE_LABEL[myRole] || '小伙伴';
    localStorage.setItem(STORAGE_ROLE, myRole);
    localStorage.setItem(STORAGE_NAME, myName);
  }

  function getDisplayName() {
    syncMyIdentity();
    return myName || ROLE_LABEL[getRole()] || '小伙伴';
  }



  function toast(msg) {

    if (typeof window.toast === 'function') window.toast(msg);

  }



  function escHtml(s) {

    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  }



  function fmtDay(ts) {

    if (!ts) return '';

    const d = new Date(ts);

    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  }



  function payload() {

    return { by_user: myId, role: myRole, name: myName, ts: Date.now() };

  }



  function updateSyncUI() {
    const status = document.getElementById('syncStatus');
    const presence = document.getElementById('syncPresence');
    const dotState = !cfgOk() ? 'off' : connected ? 'on' : 'wait';
    if (status) status.textContent = cfgOk() ? (connected ? '已连上专属小屋' : '正在连接…') : '未连接云端';
    document.querySelectorAll('#syncDot, #syncDotMobile').forEach(d => {
      const base = d.id === 'syncDotMobile' ? 'sync-dot-mobile' : 'sync-dot';
      d.className = base + ' ' + dotState;
    });
    if (!cfgOk() && presence) {
      presence.textContent = '点「连接云端」用邮箱注册 Supabase（不需要 Google）';
    }
  }



  function speakSweet(text, gender) {
    if (typeof window.speakSweetAlert === 'function') window.speakSweetAlert(text, gender);
  }

  function greetSelfOnJoin() {
    syncMyIdentity();
    if (!myRole || sessionStorage.getItem(GREET_KEY)) return;
    sessionStorage.setItem(GREET_KEY, '1');
    const isWan = myRole === 'partner';
    const name = ROLE_LABEL[myRole];
    const msg = isWan
      ? '婉来啦，小屋等你很久了呢'
      : '哲来啦，今天也要守护婉哦';
    toast(`欢迎回来，${name} 💕`);
    speakSweet(msg, isWan ? 'female' : 'male');
  }

  function moduleLabel(page) {
    if (page === 'draw') return '涂鸦小窝';
    if (page === 'photos') return '回忆相册';
    if (page === 'chat') return '私密树洞';
    return '';
  }

  function notifyPeerModuleEnter(user, page) {
    if (!user || !SYNC_MODULES.includes(page)) return;
    const name = normalizeName(user);
    const where = moduleLabel(page);
    const isFemale = user.role === 'partner';
    const msgs = isFemale
      ? [`${name}来${where}啦`, '婉也进来了呢']
      : [`${name}来${where}啦`, '哲也进来了'];
    toast(`💕 ${name} 进入${where}了`, 2600);
    speakSweet(msgs[Math.floor(Math.random() * msgs.length)], isFemale ? 'female' : 'male');
  }

  function notifyPeerModuleLeave(user, page) {
    if (!user || !SYNC_MODULES.includes(page)) return;
    const name = normalizeName(user);
    const where = moduleLabel(page);
    const isFemale = user.role === 'partner';
    toast(`${name} 离开了${where}`, 2600);
    speakSweet(isFemale ? `${name}离开${where}了` : `${name}离开${where}了`, isFemale ? 'female' : 'male');
  }

  function notifyPeerJoin(user) {
    if (!user) return;
    const name = normalizeName(user);
    const isFemale = user.role === 'partner';
    toast(`💕 ${name} 已上线`, 2600);
    speakSweet(isFemale ? '婉上线啦，想你了～' : '哲上线啦，他在等你呢', isFemale ? 'female' : 'male');
  }

  function notifyPeerLeave(user) {
    if (!user) return;
    const name = normalizeName(user);
    const isFemale = user.role === 'partner';
    toast(`${name} 暂时离线了`, 2600);
    speakSweet(isFemale ? '婉先离开了，晚点再见' : '哲先下线了，记得想他', isFemale ? 'female' : 'male');
  }

  function isPresenceActive(u, now) {
    if (!u?.role || u.user_id === myId || u.page === 'away') return false;
    return (now - (u.ts || 0)) <= PRESENCE_STALE_MS;
  }

  function handlePresenceNotify(users) {
    syncMyIdentity();
    if (!cfgOk()) return;
    const now = Date.now();
    const active = {};
    (users || []).forEach(u => {
      if (!isPresenceActive(u, now)) return;
      active[u.role] = u;
    });

    if (!presenceInitialized) {
      ['wanning', 'partner'].forEach(role => {
        if (role === myRole) return;
        knownPeerOnline[role] = !!active[role];
        knownPeerPage[role] = active[role]?.page || '';
      });
      presenceInitialized = true;
      return;
    }

    ['wanning', 'partner'].forEach(role => {
      if (role === myRole) return;
      const peer = active[role];
      const was = !!knownPeerOnline[role];
      const on = !!peer;
      const prevPage = knownPeerPage[role] || '';
      const peerPage = on ? (peer.page || '') : '';
      const notify = lastPeerNotify[role] || { join: 0, leave: 0, same: 0 };

      if (prevPage !== peerPage) {
        if (SYNC_MODULES.includes(prevPage)) {
          notifyPeerModuleLeave({ role, name: ROLE_LABEL[role] }, prevPage);
        }
        if (on && SYNC_MODULES.includes(peerPage)) {
          notifyPeerModuleEnter(peer, peerPage);
          notify.same = now;
        }
      }

      const moduleNotified = prevPage !== peerPage && SYNC_MODULES.includes(peerPage);

      if (!was && on && !moduleNotified) {
        if (now - notify.join > PRESENCE_NOTIFY_COOLDOWN) {
          notifyPeerJoin(peer);
          notify.join = now;
        }
      } else if (was && !on) {
        if (now - notify.leave > PRESENCE_NOTIFY_COOLDOWN) {
          notifyPeerLeave({ role, name: ROLE_LABEL[role] });
          notify.leave = now;
        }
      }

      lastPeerNotify[role] = notify;
      knownPeerOnline[role] = on;
      knownPeerPage[role] = on ? peerPage : '';
    });
  }

  window.syncEnterModule = function (page) {
    if (!SYNC_MODULES.includes(page)) return;
    currentSyncPage = page;
    pingPresence(page);
    const now = Date.now();
    (lastPresenceUsers || []).forEach(u => {
      if (!u?.role || u.role === myRole || u.user_id === myId) return;
      if (!isPresenceActive(u, now) || u.page !== page) return;
      knownPeerPage[u.role] = '';
      notifyPeerModuleEnter(u, page);
      knownPeerPage[u.role] = page;
    });
    fetchPresence();
  };

  window.syncLeaveModule = function (page) {
    if (!SYNC_MODULES.includes(page)) return;
    pingPresence('lobby');
    fetchPresence();
  };

  function updateHomePresenceUI(others) {
    const drawEl = document.querySelector('[data-sync-home-status="draw"]');
    const photoEl = document.querySelector('[data-sync-home-status="photos"]');
    const chatEl = document.querySelector('[data-sync-home-status="chat"]');
    const moreDraw = document.querySelector('.more-grid [data-go="draw"] .sub');
    const morePhoto = document.querySelector('.more-grid [data-go="photos"] .sub');
    const moreChat = document.querySelector('.more-grid [data-go="chat"] .sub');
    let line = '💭 等待 TA 上线…';
    if (others?.length) {
      const names = others.map(u => normalizeName(u)).join('、');
      line = `💕 ${names} 在线`;
    }
    const drawLine = others?.length ? `${line} · 可同屏画画` : '同屏画画 · 等待 TA 上线';
    const photoLine = others?.length ? `${line} · 可实时传图` : '我们的专属小相馆 · 等待 TA';
    const chatLine = others?.length ? `${line} · 可发树洞消息` : '树洞 · 等待 TA 上线';
    [drawEl, moreDraw].forEach(el => { if (el) el.textContent = drawLine; });
    [photoEl, morePhoto].forEach(el => { if (el) el.textContent = photoLine; });
    [chatEl, moreChat].forEach(el => { if (el) el.textContent = chatLine; });
  }

  function normalizeName(u) {
    if (!u) return 'TA';
    if (u.role && ROLE_LABEL[u.role]) return ROLE_LABEL[u.role];
    if (u.name === '你' || u.name === '哲') return '哲';
    if (u.name === '婉宁' || u.name === '婉') return '婉';
    return u.name || 'TA';
  }

  function peerWhere(u) {
    const p = u?.page || 'lobby';
    if (p === 'photos') return '回忆相册';
    if (p === 'chat') return '私密树洞';
    if (p === 'draw') return '画板上';
    return '小屋里';
  }

  function renderPresenceList(users) {
    syncMyIdentity();
    const els = document.querySelectorAll('#syncPresence, #syncPresenceSheet');
    if (!els.length) return;
    const now = Date.now();
    const byRole = new Map();
    (users || []).forEach(u => {
      if (!u || !u.role || u.user_id === myId || u.page === 'away') return;
      if ((now - (u.ts || 0)) > PRESENCE_STALE_MS) return;
      const prev = byRole.get(u.role);
      if (!prev || (u.ts || 0) > (prev.ts || 0)) byRole.set(u.role, u);
    });
    let others = [...byRole.values()];
    if (myRole) others = others.filter(u => u.role !== myRole);

    handlePresenceNotify(users || []);
    updateHomePresenceUI(others);

    let html;
    if (!others.length) {
      html = myRole
        ? '<span class="sync-wait">💭 等待 TA 上线…</span>'
        : '<span class="sync-wait">💭 请先选「我是婉」或「我是哲」</span>';
    } else {
      const parts = others.map(u => {
        const c = ROLE_COLOR[u.role] || '#b8959a';
        const name = escHtml(normalizeName(u));
        const where = peerWhere(u);
        return `<span class="sync-peer" style="--peer-color:${c}">${name} 在${where}</span>`;
      });
      html = `<span class="sync-online-pulse">💕</span> ${parts.join(' · ')}`;
    }
    els.forEach(el => { el.innerHTML = html; });
  }

  async function cleanupPresence() {
    if (!sb) return;
    const { data } = await sb.from('room_presence').select('user_id, role, ts, page').eq('room_id', roomId());
    const now = Date.now();
    const toDelete = [];
    const latestByRole = {};

    (data || []).forEach(u => {
      if (!u?.user_id) return;
      if (u.page === 'away') {
        toDelete.push(u.user_id);
        return;
      }
      if ((now - (u.ts || 0)) > PRESENCE_CLEANUP_STALE_MS) {
        toDelete.push(u.user_id);
        return;
      }
      const role = u.role || '_';
      if (!latestByRole[role] || (u.ts || 0) > (latestByRole[role].ts || 0)) {
        if (latestByRole[role] && latestByRole[role].user_id !== u.user_id) {
          toDelete.push(latestByRole[role].user_id);
        }
        latestByRole[role] = u;
      } else if (u.user_id !== latestByRole[role].user_id) {
        toDelete.push(u.user_id);
      }
    });

    const unique = [...new Set(toDelete)].filter(id => id !== myId);
    await Promise.all(unique.map(uid =>
      sb.from('room_presence').delete().eq('room_id', roomId()).eq('user_id', uid)
    ));
  }



  let _rolePickerResolve = null;

  function cancelRolePicker() {
    document.querySelectorAll('.sync-role-overlay').forEach(el => el.remove());
    if (_rolePickerResolve) {
      const done = _rolePickerResolve;
      _rolePickerResolve = null;
      done();
    }
  }

  window.cancelRolePicker = cancelRolePicker;

  function ensureRolePicker() {
    const roleInStorage = getRole();
    const pickedThisSession = sessionStorage.getItem(ROLE_PICKED_SESSION_KEY) === '1';
    if (roleInStorage && pickedThisSession) {
      syncMyIdentity();
      return Promise.resolve();
    }

    cancelRolePicker();

    return new Promise(resolve => {

      _rolePickerResolve = resolve;

      const overlay = document.createElement('div');

      overlay.id = 'syncRolePicker';

      overlay.className = 'sync-role-overlay show';

      overlay.innerHTML = `

        <div class="sync-role-card">

          <div class="sync-role-hearts">💕</div>

          <h3>欢迎来到双人小屋</h3>

          <p>${roleInStorage ? '登录成功，请确认一下你是谁～' : '选一下你是谁，画板会显示不同颜色哦～'}</p>

          <button type="button" class="sync-role-btn partner" data-role="partner">🎀 我是婉</button>

          <button type="button" class="sync-role-btn wanning" data-role="wanning">💙 我是哲</button>

          <button type="button" class="sync-role-btn" id="syncRoleSkip" style="margin-top:4px;background:#f8f6f4;color:var(--text2)">先逛逛别的 →</button>

        </div>`;

      document.body.appendChild(overlay);

      const finish = () => {
        overlay.remove();
        if (getRole()) sessionStorage.setItem(ROLE_PICKED_SESSION_KEY, '1');
        if (_rolePickerResolve) {
          const done = _rolePickerResolve;
          _rolePickerResolve = null;
          done();
        }
      };

      overlay.querySelector('#syncRoleSkip').onclick = finish;

      overlay.querySelectorAll('[data-role]').forEach(btn => {

        btn.onclick = () => {

          const role = btn.dataset.role;

          localStorage.setItem(STORAGE_ROLE, role);

          myRole = role;

          myName = ROLE_LABEL[role];

          localStorage.setItem(STORAGE_NAME, myName);

          startGlobalPhotoListener();

          greetSelfOnJoin();

          finish();

        };

      });

    });

  }



  function initSupabase() {

    if (!cfgOk() || typeof supabase === 'undefined') return false;

    const CFG = getCfg();

    try {

      sb = supabase.createClient(CFG.supabase.url, CFG.supabase.anonKey);

      return true;

    } catch (e) {

      console.warn('Supabase init failed', e);

      return false;

    }

  }



  async function fetchPresence() {

    if (!sb) return;

    const { data } = await sb.from('room_presence').select('*').eq('room_id', roomId());

    lastPresenceUsers = data || [];

    renderPresenceList(lastPresenceUsers);

  }



  let presenceFastTimer = null;

  function startPresenceFastPoll() {
    clearInterval(presenceFastTimer);
    presenceFastTimer = setInterval(() => {
      if (sb && myRole) fetchPresence();
    }, 10000);
  }

  function stopPresenceFastPoll() {
    clearInterval(presenceFastTimer);
    presenceFastTimer = null;
  }

  window.stopPresenceFastPoll = stopPresenceFastPoll;

  async function pingPresence(page) {
    if (!sb || !myRole || !myId) return;
    const p = page || currentSyncPage || 'lobby';
    currentSyncPage = p;
    try {
      await sb.from('room_presence').upsert({
        room_id: roomId(),
        user_id: myId,
        name: ROLE_LABEL[myRole] || myName,
        role: myRole,
        page: p,
        ts: Date.now(),
      });
      connected = true;
      updateSyncUI();
    } catch {}
  }

  function startGlobalPresenceHeartbeat() {
    if (globalHeartbeatTimer) return;
    globalHeartbeatTimer = setInterval(() => {
      if (!sb || !myRole) return;
      pingPresence();
    }, PRESENCE_HEARTBEAT_MS);
  }

  function ensurePresenceAlive(page) {
    syncMyIdentity();
    if (!sb || !myRole) return;
    if (page) currentSyncPage = page;
    pingPresence(currentSyncPage || 'lobby');
    startGlobalPresenceHeartbeat();
    fetchPresence();
  }

  window.syncSetPage = function (page) {
    currentSyncPage = page || 'lobby';
    pingPresence(currentSyncPage);
  };
  window.syncPingPresence = () => pingPresence();
  window.syncRestartPresenceFastPoll = startPresenceFastPoll;

  async function joinRoom(page) {
    if (!sb) return;
    syncMyIdentity();
    if (!myRole) { fetchPresence(); return; }
    currentSyncPage = page || currentSyncPage || 'lobby';
    await cleanupPresence();
    await pingPresence(currentSyncPage);
    greetSelfOnJoin();
    await fetchPresence();
    startPresenceFastPoll();
    startGlobalPresenceHeartbeat();
    clearInterval(presenceTimer);
    presenceTimer = setInterval(() => cleanupPresence(), 60000);
  }



  function leaveRoom() {

    clearInterval(presenceTimer);

    presenceTimer = null;

    if (sb && myId) {

      sb.from('room_presence').delete().eq('room_id', roomId()).eq('user_id', myId).catch(() => {});

    }

    if (syncChannel && sb) {

      sb.removeChannel(syncChannel);

      syncChannel = null;

    }

    currentSyncPage = '';

    connected = false;

    hubReady = false;

    drawListenersOn = false;

    clearTimeout(pushTimer);

    clearTimeout(persistTimer);

  }



  function shouldApplyRemoteSnapshot() {
    if (window._isDrawing) return false;
    if (window._syncPausedUntil && Date.now() < window._syncPausedUntil) return false;
    if (Date.now() - (window._lastDrawEndTs || 0) < 1200) return false;
    return true;
  }

  window.syncPauseCanvas = function (ms) {
    window._syncPausedUntil = Date.now() + (ms || 4000);
  };

  window.syncPushCanvas = function () {
    if (typeof window.syncScheduleSnapshot === 'function') window.syncScheduleSnapshot();
    scheduleSnapshotPush();
    setTimeout(() => pushLiveSnapshot(), 300);
  };

  window._applyCachedDraw = maybeApplyCachedSnapshot;

  function setupRealtimeChannel() {
    if (!sb || syncChannel) return;
    const rid = roomId();
    syncChannel = sb.channel('room:' + rid)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_strokes', filter: `room_id=eq.${rid}` }, payload => {
        onStrokeRow(payload.new);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'room_live', filter: `room_id=eq.${rid}` }, payload => {
        const v = payload.new;
        if (!v || v.by_user === myId || !v.image) return;
        if ((v.v || 0) <= lastLiveV) return;
        cacheLiveSnapshot(v.image, v.v);
        if (shouldApplyRemoteSnapshot()) maybeApplyCachedSnapshot();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_presence', filter: `room_id=eq.${rid}` }, () => {
        fetchPresence();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_photos', filter: `room_id=eq.${rid}` }, payload => {
        const p = payload.new;
        if (!p || p.by_user === myId || (p.ts || 0) < photoNotifySince) return;
        if (!window._onPhotoPage) toast(`${p.name || 'TA'}发来一张照片`, 2600);
        else loadPhotoGallery(true);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_id=eq.${rid}` }, payload => {
        if (typeof window.onChatMessageInsert === 'function') window.onChatMessageInsert(payload.new);
      })
      .subscribe(status => {
        if (status === 'SUBSCRIBED') updateSyncUI();
      });
  }



  function normPoint(canvas, x, y) {
    const { w, h } = getCanvasLogicalSize(canvas);
    return { x: x / w, y: y / h };
  }

  function denormPoint(canvas, p) {
    const { w, h } = getCanvasLogicalSize(canvas);
    return { x: p.x * w, y: p.y * h };
  }



  function applyStroke(stroke, pushHistory) {

    const canvas = document.getElementById('drawCanvas');

    if (!canvas || typeof drawCtx === 'undefined' || !drawCtx || !stroke?.pts?.length) return;

    applyingRemote = true;

    const ctx = drawCtx;

    ctx.lineCap = 'round';

    ctx.lineJoin = 'round';

    ctx.lineWidth = stroke.w || 4;

    ctx.strokeStyle = stroke.color || '#45403c';

    if (stroke.mode === 'eraser') {

      ctx.lineWidth = (stroke.w || 4) * 3.5;

      ctx.strokeStyle = '#fff';

    }

    ctx.beginPath();

    stroke.pts.forEach((p, i) => {

      const pt = denormPoint(canvas, p);

      if (i === 0) ctx.moveTo(pt.x, pt.y);

      else ctx.lineTo(pt.x, pt.y);

    });

    ctx.stroke();

    applyingRemote = false;

    if (pushHistory && typeof pushDrawHistory === 'function') pushDrawHistory();

  }



  function applyStamp(stroke) {

    const canvas = document.getElementById('drawCanvas');

    if (!canvas || !drawCtx || !stroke.char) return;

    applyingRemote = true;

    const pt = denormPoint(canvas, stroke.pt);

    drawCtx.font = `${Math.max(18, (stroke.w || 4) * 5)}px "Cambria Math","Segoe UI",serif`;

    drawCtx.fillStyle = stroke.color || '#45403c';

    drawCtx.fillText(stroke.char, pt.x, pt.y);

    applyingRemote = false;

    if (typeof pushDrawHistory === 'function') pushDrawHistory();

  }



  function applyText(stroke) {

    if (typeof drawTextOnCanvas === 'function') {

      applyingRemote = true;

      drawTextOnCanvas(stroke.text);

      applyingRemote = false;

    }

  }



  function onStrokeRow(row) {

    if (!row?.stroke_data) return;

    const s = row.stroke_data;

    if (s.by === myId || row.by_user === myId) return;

    if ((row.ts || 0) < joinTs - 500) return;

    if (s.type === 'stroke') applyStroke(s, true);
    else if (s.type === 'shape') applyShape(s, true);
    else if (s.type === 'stamp') applyStamp(s);
    else if (s.type === 'text') applyText(s);
    else if (s.type === 'clear') applyRemoteClear(false);
    else if (s.type === 'snapshot') applyRemoteSnapshot(s.image, false);
  }

  function applyShape(stroke, pushHistory) {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas || !drawCtx || stroke.type !== 'shape') return;
    applyingRemote = true;
    const a = denormPoint(canvas, stroke.pt1 || { x: 0, y: 0 });
    const b = denormPoint(canvas, stroke.pt2 || { x: 0, y: 0 });
    if (typeof drawShapeOnCtx === 'function') {
      drawShapeOnCtx(drawCtx, stroke.shape || 'line', a.x, a.y, b.x, b.y, {
        color: stroke.color || '#45403c',
        lineWidth: stroke.w || 4,
        filled: !!stroke.filled,
      });
    }
    applyingRemote = false;
    if (pushHistory && typeof pushDrawHistory === 'function') pushDrawHistory();
  }



  async function pushStrokeEvent(data) {

    if (!sb || applyingRemote) return;

    const row = {

      room_id: roomId(),

      stroke_data: { ...payload(), ...data, by: myId },

      ts: Date.now(),

      ...payload(),

    };

    await sb.from('room_strokes').insert(row);

    scheduleSnapshotPush();

  }



  function scheduleSnapshotPush() {
    if (!sb) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushLiveSnapshot, 800);
  }

  async function pushLiveSnapshot() {
    const canvas = document.getElementById('drawCanvas');
    if (!canvas || !sb || applyingRemote || window._isDrawing) return;
    const now = Date.now();
    if (now - lastPushTs < 600) return;
    lastPushTs = now;
    try {
      const image = canvas.toDataURL('image/jpeg', 0.52);
      localStorage.setItem(LOCAL_CANVAS, JSON.stringify({ image, v: now }));
      await sb.from('room_live').upsert({
        room_id: roomId(), image, v: now, ...payload(), updated_at: new Date().toISOString(),
      });
      schedulePersistCanvas(image, now);
    } catch {}
  }



  function schedulePersistCanvas(image, ts) {

    if (!sb) return;

    clearTimeout(persistTimer);

    persistTimer = setTimeout(async () => {

      const canvas = document.getElementById('drawCanvas');

      if (!canvas || applyingRemote) return;

      let img = image;

      try { if (!img) img = canvas.toDataURL('image/jpeg', 0.72); } catch { return; }

      const t = ts || Date.now();

      localStorage.setItem(LOCAL_CANVAS, JSON.stringify({ image: img, v: t }));

      await sb.from('room_persist').upsert({

        room_id: roomId(), image: img, v: t, by_user: myId, updated_at: new Date().toISOString(),

      });

    }, 1500);

  }



  async function loadPersistCanvas() {

    if (sb) {

      const { data } = await sb.from('room_persist').select('*').eq('room_id', roomId()).maybeSingle();

      if (data?.image && data.v > lastLiveV) {

        cacheLiveSnapshot(data.image, data.v);

        maybeApplyCachedSnapshot();

        return;

      }

      const { data: live } = await sb.from('room_live').select('*').eq('room_id', roomId()).maybeSingle();

      if (live?.image && live.v > lastLiveV) {

        cacheLiveSnapshot(live.image, live.v);

        maybeApplyCachedSnapshot();

        return;

      }

    }

    try {

      const local = JSON.parse(localStorage.getItem(LOCAL_CANVAS) || 'null');

      if (local?.image) {
        if ((local.v || 0) > lastLiveV) cacheLiveSnapshot(local.image, local.v);
        maybeApplyCachedSnapshot();
      }

    } catch {}

  }



  function applyRemoteSnapshot(image, pushHistory) {

    const canvas = document.getElementById('drawCanvas');

    if (!canvas || !drawCtx || !image) return;

    applyingRemote = true;

    const img = new Image();

    img.onload = () => {

      const dpr = window.devicePixelRatio || 1;

      drawCtx.save();

      drawCtx.setTransform(1, 0, 0, 1, 0, 0);

      drawCtx.fillStyle = '#fff';

      drawCtx.fillRect(0, 0, canvas.width, canvas.height);

      drawCtx.drawImage(img, 0, 0, canvas.width, canvas.height);

      drawCtx.restore();

      drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      applyingRemote = false;

      if (pushHistory && typeof pushDrawHistory === 'function') pushDrawHistory();

    };

    img.src = image;

  }



  function applyRemoteClear(pushHistory) {

    const canvas = document.getElementById('drawCanvas');

    if (!canvas || !drawCtx) return;

    applyingRemote = true;

    const dpr = window.devicePixelRatio || 1;

    drawCtx.save();

    drawCtx.setTransform(1, 0, 0, 1, 0, 0);

    drawCtx.fillStyle = '#fff';

    drawCtx.fillRect(0, 0, canvas.width, canvas.height);

    drawCtx.restore();

    drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    applyingRemote = false;

    if (pushHistory && typeof pushDrawHistory === 'function') pushDrawHistory();

  }



  function listenStrokes() { joinTs = Date.now(); }



  function listenLive() { /* handled by realtime channel */ }



  window.syncOnCanvasChange = function () {

    if (typeof window.syncScheduleSnapshot === 'function') window.syncScheduleSnapshot();

  };



  function bindDrawSyncHooks() {

    if (strokeListenersBound) return;

    strokeListenersBound = true;



    window.syncOnDrawStart = function (pt, mode) {

      if (!cfgOk() || !connected || applyingRemote) return;

      const canvas = document.getElementById('drawCanvas');

      if (!canvas) return;

      currentStroke = {

        type: 'stroke',

        mode: mode || 'pen',

        color: document.getElementById('penColor')?.value || '#45403c',

        w: +(document.getElementById('penSize')?.value || 6),

        pts: [normPoint(canvas, pt.x, pt.y)],

      };

    };



    window.syncOnDrawMove = function (pt) {

      if (!currentStroke) return;

      const canvas = document.getElementById('drawCanvas');

      currentStroke.pts.push(normPoint(canvas, pt.x, pt.y));

    };



    window.syncOnDrawEnd = function () {

      if (!currentStroke || currentStroke.pts.length < 2) { currentStroke = null; return; }

      pushStrokeEvent(currentStroke);

      currentStroke = null;

    };



    window.syncOnStamp = function (pt, char) {

      if (!cfgOk() || !connected || applyingRemote) return;

      const canvas = document.getElementById('drawCanvas');

      pushStrokeEvent({

        type: 'stamp', char,

        color: document.getElementById('penColor')?.value || '#45403c',

        w: +(document.getElementById('penSize')?.value || 6),

        pt: normPoint(canvas, pt.x, pt.y),

      });

    };



    window.syncOnClear = function () {

      if (!cfgOk() || !connected || applyingRemote) return;

      pushStrokeEvent({ type: 'clear' });

      if (sb) sb.from('room_live').upsert({ room_id: roomId(), image: '', v: Date.now(), ...payload() });

      localStorage.removeItem(LOCAL_CANVAS);

    };



    window.syncOnVoiceText = function (text) {
      if (!cfgOk() || !connected || applyingRemote || !text) return;
      pushStrokeEvent({ type: 'text', text });
    };

    window.syncOnShapeEnd = function (shape, x1, y1, x2, y2, opts) {
      if (!cfgOk() || !connected || applyingRemote) return;
      const canvas = document.getElementById('drawCanvas');
      if (!canvas) return;
      pushStrokeEvent({
        type: 'shape',
        shape,
        pt1: normPoint(canvas, x1, y1),
        pt2: normPoint(canvas, x2, y2),
        color: opts?.color || '#45403c',
        w: opts?.w || 4,
        filled: !!opts?.filled,
      });
    };

    window.syncPushFill = function () {
      window.syncPushCanvas();
    };
  }



  function renderHistoryItems(box, items) {

    if (!items.length) {

      box.innerHTML = '<p class="sync-history-empty">还没有回忆呢～画完点「存入回忆」</p>';

      return;

    }

    box.innerHTML = items.map(it => `

      <div class="sync-history-item" data-id="${escHtml(it.id || '')}">

        <img src="${it.thumb || it.image || ''}" alt="" loading="lazy">

        <div class="sync-history-meta">

          <span>${escHtml(it.title || '我们的画')}</span>

          <small>${escHtml(it.name || '')} · ${fmtDay(it.ts)}</small>

        </div>

      </div>`).join('');

    box.querySelectorAll('.sync-history-item').forEach(el => {
      el.onclick = async () => {
        const it = items.find(x => (x.id || '') === el.dataset.id);
        if (!it) return;
        let img = it.image || it.thumb;
        if (!it.image && it.id && sb && cfgOk() && !String(it.id).startsWith('local_')) {
          const { data } = await sb.from('room_history').select('image').eq('id', it.id).maybeSingle();
          if (data?.image) img = data.image;
        }
        if (img) window.syncLoadHistoryImage(img);
      };
    });

  }



  async function loadHistoryGallery() {
    const box = document.getElementById('syncHistory');
    if (!box) return;
    let items = [];
    try { items = JSON.parse(localStorage.getItem(LOCAL_HISTORY) || '[]'); } catch {}
    renderHistoryItems(box, items);
    if (sb && cfgOk()) {
      const { data } = await sb.from('room_history')
        .select('id, thumb, title, ts, name, by_user')
        .eq('room_id', roomId()).order('ts', { ascending: false }).limit(60);
      if (data?.length) {
        items = data.map(r => ({ id: r.id, thumb: r.thumb, title: r.title, ts: r.ts, name: r.name, by: r.by_user }));
        try { localStorage.setItem(LOCAL_HISTORY, JSON.stringify(items)); } catch {}
        renderHistoryItems(box, items);
      }
    }
  }



  async function saveToHistory() {

    const canvas = document.getElementById('drawCanvas');

    if (!canvas) return;

    let image = '';

    try { image = canvas.toDataURL('image/jpeg', 0.85); } catch { toast('保存失败'); return; }

    const title = `我们的画 ${fmtDay(Date.now())}`;

    const entry = { ...payload(), image, thumb: image, title, ts: Date.now() };



    if (sb && cfgOk()) {

      const { error } = await sb.from('room_history').insert({ room_id: roomId(), ...entry, by_user: myId });

      if (error) { toast('保存失败：' + error.message); return; }

      toast('已永久保存到云端');

      loadHistoryGallery();

    } else {

      let items = [];

      try { items = JSON.parse(localStorage.getItem(LOCAL_HISTORY) || '[]'); } catch {}

      entry.id = 'local_' + Date.now();

      entry.by = myId;

      items.unshift(entry);

      localStorage.setItem(LOCAL_HISTORY, JSON.stringify(items));

      loadHistoryGallery();

      toast('已存到本机（连接云端后双方同步）');

    }

  }



  window.syncLoadHistoryImage = function (image) {

    if (!confirm('要把这张回忆加载到画板上吗？当前内容会被覆盖哦～')) return;

    applyRemoteSnapshot(image, true);

    if (sb && cfgOk()) pushLiveSnapshot();

    toast('回忆已加载到画板 🎀');

  };



  async function ensureSyncSession(page) {

    syncMyIdentity();

    updateSyncUI();

    if (!cfgOk()) return false;

    await ensureRolePicker();

    syncMyIdentity();

    if (!getRole()) return false;

    if (!initSupabase()) { toast('云端连接失败，请检查配置'); return false; }

    photoNotifySince = Date.now();

    setupRealtimeChannel();

    await joinRoom(page);

    return true;

  }



  function bindSyncHelpBtn() {

    const cfgBtn = document.getElementById('syncHelpBtn');

    if (cfgBtn) cfgBtn.onclick = () => toast('说明见：双人小屋配置说明.txt（Supabase 邮箱注册）');

    bindSyncSetupBtn();

    bindSyncSheetBtn();

  }



  function bindSyncSetupBtn() {

    const btn = document.getElementById('syncSetupBtn');

    if (!btn || btn._bound) return;

    btn._bound = true;

    btn.onclick = () => openSyncSetupModal();

  }



  function bindSyncSheetBtn() {

    const btn = document.getElementById('syncSheetBtn');

    if (!btn || btn._bound) return;

    btn._bound = true;

    btn.onclick = () => openSyncSheet();

  }



  function openSyncSetupModal() {

    const CFG = getCfg();

    const s = CFG.supabase || {};

    const overlay = document.createElement('div');

    overlay.className = 'sync-role-overlay show';

    overlay.innerHTML = `

      <div class="sync-role-card" style="max-width:360px;text-align:left">

        <h3 style="text-align:center">连接云端小屋</h3>

        <p style="font-size:.82rem;margin-bottom:10px;line-height:1.5">

          用<strong>邮箱</strong>注册 <a href="https://supabase.com" target="_blank" rel="noopener">supabase.com</a>（不需要 Google，QQ 邮箱即可）。<br>

          创建项目后运行 <code>supabase-setup.sql</code>，再粘贴下面两项。

        </p>

        <label style="font-size:.75rem;color:var(--text2)">Project URL</label>

        <input id="syncInpUrl" style="width:100%;padding:10px;margin:4px 0 10px;border:1px solid var(--border);border-radius:8px" placeholder="https://xxx.supabase.co" value="${escHtml(s.url === '在此填写' ? '' : (s.url || ''))}">

        <label style="font-size:.75rem;color:var(--text2)">anon public key</label>

        <input id="syncInpKey" style="width:100%;padding:10px;margin:4px 0 14px;border:1px solid var(--border);border-radius:8px" placeholder="eyJhbG..." value="${escHtml(s.anonKey === '在此填写' ? '' : (s.anonKey || ''))}">

        <button type="button" class="sync-role-btn wanning" id="syncSaveCfg">保存并连接</button>

        <button type="button" class="sync-role-btn partner" id="syncCancelCfg">取消</button>

      </div>`;

    document.body.appendChild(overlay);

    overlay.querySelector('#syncCancelCfg').onclick = () => overlay.remove();

    overlay.querySelector('#syncSaveCfg').onclick = async () => {

      const url = overlay.querySelector('#syncInpUrl')?.value?.trim();

      const anonKey = overlay.querySelector('#syncInpKey')?.value?.trim();

      if (!url || !anonKey) { toast('请填写 URL 和 anon key'); return; }

      localStorage.setItem('sync-config-override', JSON.stringify({ enabled: true, supabase: { url, anonKey } }));

      overlay.remove();

      toast('配置已保存，正在连接…');

      hubReady = false;

      if (typeof window.syncReloadHub === 'function') await window.syncReloadHub();

    };

  }



  function openSyncSheet() {

    let sheet = document.getElementById('syncMobileSheet');

    if (!sheet) {

      sheet = document.createElement('div');

      sheet.id = 'syncMobileSheet';

      sheet.className = 'sync-mobile-sheet';

      document.body.appendChild(sheet);

    }

    sheet.innerHTML = `

      <div class="sync-sheet-backdrop"></div>

      <div class="sync-sheet-panel">

        <div class="sync-sheet-head">

          <span>🎀 双人小屋</span>

          <button type="button" id="syncSheetClose">✕</button>

        </div>

        <div class="love-sync-presence" id="syncPresenceSheet">${document.getElementById('syncPresence')?.innerHTML || ''}</div>

        <div class="love-sync-actions">

          <button type="button" class="btn btn-primary" id="syncSetupBtnSheet">☁️ 连接云端</button>

          <button type="button" class="btn btn-primary" id="syncSaveHistorySheet">📷 存入回忆</button>

          <button type="button" class="btn" data-go="photos">📷 回忆相册</button>

        </div>

        <div class="sync-history-title">回忆相册</div>

        <div class="sync-history-scroll" id="syncHistorySheet"></div>

      </div>`;

    sheet.classList.add('show');

    fetchPresence().then(() => {
      const histBox = sheet.querySelector('#syncHistorySheet');
      const mainHist = document.getElementById('syncHistory');
      if (histBox && mainHist) histBox.innerHTML = mainHist.innerHTML;
    });

    const closeSheet = () => sheet.remove();
    sheet.querySelector('.sync-sheet-backdrop').onclick = closeSheet;
    sheet.querySelector('#syncSheetClose').onclick = closeSheet;
    sheet.querySelector('#syncSetupBtnSheet').onclick = () => { closeSheet(); openSyncSetupModal(); };

    sheet.querySelector('#syncSaveHistorySheet').onclick = () => saveToHistory();

    sheet.querySelector('[data-go="photos"]')?.addEventListener('click', () => {
      closeSheet();
      if (typeof window.goView === 'function') window.goView('photos');
    });

  }



  async function ensureSyncHub(page) {

    myId = getClientId();

    updateSyncUI();

    bindSyncHelpBtn();

    if (!cfgOk()) return false;

    if (hubReady && sb) {
      if (!syncChannel) setupRealtimeChannel();
      await joinRoom(page);
      startBackgroundLivePoll();
      if (page === 'draw') await refreshDrawFromCloud();
      return true;
    }

    const ok = await ensureSyncSession(page);

    if (!ok) return false;

    if (!drawListenersOn) {
      listenStrokes();
      listenLive();
      drawListenersOn = true;
    }
    startBackgroundLivePoll();
    if (page === 'draw') await refreshDrawFromCloud();

    hubReady = true;

    return true;

  }



  async function startDrawSync() {
    if (view !== 'draw') return;
    joinTs = Date.now();
    bindDrawSyncHooks();
    window._onPhotoPage = false;
    let ok = false;
    try { ok = await ensureSyncHub('draw'); } catch { ok = false; }
    if (view !== 'draw') return;
    if (typeof window.syncEnterModule === 'function') window.syncEnterModule('draw');

    loadHistoryGallery();

    document.getElementById('syncSaveHistory') && (document.getElementById('syncSaveHistory').onclick = () => saveToHistory());

    if (!ok) await loadPersistCanvas();
    else maybeApplyCachedSnapshot();
  }



  function stopDrawSync() {}

  function stopSyncHub() {
    stopPresenceFastPoll();
    window._onPhotoPage = false;
    syncMyIdentity();
    if (!myRole || !sb || !myId) return;
    currentSyncPage = 'lobby';
    pingPresence('lobby');
    fetchPresence();
  }



  window.syncReloadHub = async () => {

    leaveRoom();

    hubReady = false;

    sb = null;

    if (document.getElementById('drawCanvas')) await startDrawSync();

    else if (window._onPhotoPage) await startPhotoShare();

  };



  // ── 相片 ──

  function compressImageFile(file, maxW, quality) {

    maxW = maxW || 960;

    quality = quality || 0.78;

    return new Promise((resolve, reject) => {

      const url = URL.createObjectURL(file);

      const img = new Image();

      img.onload = () => {

        const scale = Math.min(1, maxW / (img.width || maxW));

        const w = Math.max(1, Math.round(img.width * scale));

        const h = Math.max(1, Math.round(img.height * scale));

        const c = document.createElement('canvas');

        c.width = w; c.height = h;

        c.getContext('2d').drawImage(img, 0, 0, w, h);

        URL.revokeObjectURL(url);

        resolve(c.toDataURL('image/jpeg', quality));

      };

      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('read fail')); };

      img.src = url;

    });

  }



  function makeThumb(dataUrl) {

    return new Promise(resolve => {

      const img = new Image();

      img.onload = () => {

        const w = 240;

        const h = Math.round(img.height * (w / img.width));

        const c = document.createElement('canvas');

        c.width = w; c.height = h;

        c.getContext('2d').drawImage(img, 0, 0, w, h);

        resolve(c.toDataURL('image/jpeg', 0.72));

      };

      img.onerror = () => resolve(dataUrl);

      img.src = dataUrl;

    });

  }



  function renderPhotoGallery(box, items) {

    if (!box) return;

    if (!items.length) {

      box.innerHTML = '<p class="photo-gallery-empty">还没有照片，选一张发给 TA</p>';

      return;

    }

    box.innerHTML = items.map(it => {

      const mine = it.by === myId || it.by_user === myId;

      const roleCls = it.role === 'wanning' ? 'from-wanning' : 'from-partner';

      return `<div class="photo-card ${roleCls}${mine ? ' mine' : ''}" data-pid="${escHtml(it.id || '')}">

        <div class="photo-card-img"><img src="${it.thumb || it.image || ''}" alt="" loading="lazy"></div>

        <div class="photo-card-body">

          <span class="photo-from">${escHtml(it.name || 'TA')}${mine ? ' · 我' : ''}</span>

          ${it.caption ? `<p class="photo-caption">${escHtml(it.caption)}</p>` : ''}

          <small class="photo-time">${fmtDay(it.ts)}</small>

        </div>

      </div>`;

    }).join('');

    box.querySelectorAll('.photo-card').forEach(el => {

      el.onclick = () => {

        const it = items.find(x => (x.id || '') === el.dataset.pid);

        if (it) openPhotoLightbox(it);

      };

    });

  }



  async function openPhotoLightbox(item) {
    let overlay = document.getElementById('photoLightbox');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'photoLightbox';
      overlay.className = 'photo-lightbox';
      document.body.appendChild(overlay);
    }
    overlay.classList.add('show');
    overlay.innerHTML = '<div class="photo-lightbox-inner"><p style="padding:24px;text-align:center">加载中…</p></div>';
    let imgSrc = item.image || item.thumb || '';
    if (!item.image && item.id && sb && cfgOk() && !String(item.id).startsWith('local_')) {
      const { data } = await sb.from('room_photos').select('image, thumb').eq('id', item.id).maybeSingle();
      if (data?.image) imgSrc = data.image;
      else if (data?.thumb) imgSrc = data.thumb;
    }

    const mine = item.by === myId || item.by_user === myId;
    overlay.innerHTML = `
      <div class="photo-lightbox-inner">
        <button type="button" class="photo-lb-close" id="photoLbClose">✕</button>
        <img src="${imgSrc}" alt="">
        <div class="photo-lb-meta">
          <span>${escHtml(item.name || '')} · ${fmtDay(item.ts)}</span>
          ${item.caption ? `<p>${escHtml(item.caption)}</p>` : ''}
        </div>
        <div class="photo-lb-actions">
          <button type="button" class="btn btn-primary" id="photoLbSave">💾 保存到相册</button>
          ${mine ? '<button type="button" class="btn btn-danger" id="photoLbDel">删除</button>' : ''}
        </div>
      </div>`;
    const closeLb = () => overlay.remove();
    document.getElementById('photoLbClose').onclick = closeLb;
    overlay.onclick = e => { if (e.target === overlay) closeLb(); };
    document.getElementById('photoLbSave').onclick = () => {
      const a = document.createElement('a');
      a.href = imgSrc;
      a.download = `相片_${fmtDay(item.ts).replace(/\//g, '-')}.jpg`;
      a.click();
      toast('图片已保存');
    };

    const del = document.getElementById('photoLbDel');

    if (del) del.onclick = () => {

      if (!confirm('确定删除这张照片吗？')) return;

      deletePhoto(item.id);

      overlay.classList.remove('show');

    };

  }



  async function loadPhotoGallery(silent) {
    const box = document.getElementById('photoGallery');
    if (!box) return;
    let items = [];
    try { items = JSON.parse(localStorage.getItem(LOCAL_PHOTOS) || '[]'); } catch {}
    if (items.length) renderPhotoGallery(box, items);
    else if (!silent) box.innerHTML = '<p class="photo-gallery-empty">加载中…</p>';
    if (sb && cfgOk()) {
      const { data, error } = await sb.from('room_photos')
        .select('id, thumb, caption, ts, name, role, by_user')
        .eq('room_id', roomId()).order('ts', { ascending: false }).limit(80);
      if (error) { if (!silent) toast('相册加载失败'); return; }
      if (data) {
        items = data.map(r => ({
          id: r.id, thumb: r.thumb, caption: r.caption,
          ts: r.ts, name: r.name, role: r.role, by: r.by_user,
        }));
        try { localStorage.setItem(LOCAL_PHOTOS, JSON.stringify(items)); } catch {}
        renderPhotoGallery(box, items);
      }
    } else if (!items.length) {
      renderPhotoGallery(box, items);
    }
  }



  async function startGlobalPhotoListener() {

    if (!cfgOk()) return;

    syncMyIdentity();

    if (!getRole()) return;

    if (!initSupabase()) return;

    photoNotifySince = Date.now();

    if (!globalPhotoNotifyOn) {
      setupRealtimeChannel();
      globalPhotoNotifyOn = true;
    }

    if (!drawListenersOn) {
      listenStrokes();
      listenLive();
      drawListenersOn = true;
    }

    startBackgroundLivePoll();
    fetchAndCacheLive();
    ensurePresenceAlive('lobby');

    await joinRoom('lobby');

  }



  async function uploadPhoto(file, caption) {

    if (!file) return;

    if (!file.type.startsWith('image/')) { toast('请选择图片文件哦'); return; }

    if (file.size > 12 * 1024 * 1024) { toast('图片太大啦，换一张小一点的'); return; }

    toast('正在处理照片…');

    let image = '';

    try { image = await compressImageFile(file); } catch { toast('图片读取失败'); return; }

    if (image.length > 900000) {

      try { image = await compressImageFile(file, 720, 0.65); } catch {}

    }

    if (image.length > 900000) { toast('图片还是太大，请换一张更小的'); return; }

    const thumb = await makeThumb(image);

    const entry = { ...payload(), image, thumb, caption: (caption || '').trim().slice(0, 120), ts: Date.now() };



    if (sb && cfgOk()) {

      const { error } = await sb.from('room_photos').insert({ room_id: roomId(), ...entry, by_user: myId });

      if (error) { toast('上传失败：' + error.message); return; }

      toast('照片已发送，永久保存');

      loadPhotoGallery();

    } else {

      let items = [];

      try { items = JSON.parse(localStorage.getItem(LOCAL_PHOTOS) || '[]'); } catch {}

      entry.id = 'local_' + Date.now();

      entry.by = myId;

      entry.name = myName || '我';

      entry.role = myRole || 'partner';

      items.unshift(entry);

      localStorage.setItem(LOCAL_PHOTOS, JSON.stringify(items));

      loadPhotoGallery();

      toast('已存到本机（连接云端后 TA 也能看见）');

    }

  }



  async function deletePhoto(id) {

    if (!id) return;

    if (sb && cfgOk() && !id.startsWith('local_')) {

      await sb.from('room_photos').delete().eq('id', id);

      toast('已删除');

      loadPhotoGallery();

    } else {

      let items = [];

      try { items = JSON.parse(localStorage.getItem(LOCAL_PHOTOS) || '[]'); } catch {}

      items = items.filter(x => x.id !== id);

      localStorage.setItem(LOCAL_PHOTOS, JSON.stringify(items));

      loadPhotoGallery();

      toast('已删除');

    }

  }



  function bindPhotoUploadUI() {

    const fileIn = document.getElementById('photoFileInput');

    const capIn = document.getElementById('photoCaption');

    const pick = document.getElementById('btnPickPhoto');

    const take = document.getElementById('btnTakePhoto');

    if (!fileIn) return;

    fileIn.onchange = async () => {

      const f = fileIn.files?.[0];

      fileIn.value = '';

      if (!f) return;

      await uploadPhoto(f, capIn?.value || '');

      if (capIn) capIn.value = '';

    };

    if (pick) pick.onclick = () => { fileIn.removeAttribute('capture'); fileIn.click(); };

    if (take) take.onclick = () => { fileIn.setAttribute('capture', 'environment'); fileIn.click(); };

  }



  async function startPhotoShare() {
    if (view !== 'photos') return;
    window._onPhotoPage = true;
    photoNotifySince = Date.now();
    updateSyncUI();
    bindPhotoUploadUI();
    loadPhotoGallery();
    try {
      const ok = await ensureSyncHub('photos');
      if (view === 'photos' && ok) loadPhotoGallery(true);
      if (view === 'photos' && typeof window.syncEnterModule === 'function') window.syncEnterModule('photos');
    } catch {}
  }



  function stopPhotoShare() { window._onPhotoPage = false; }



  function forceUnlockUI() {
    cancelRolePicker();
    stopPresenceFastPoll();
    document.querySelectorAll('.sync-mobile-sheet, .sync-role-overlay, .photo-lightbox').forEach(el => el.remove());
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('show');
    document.body.classList.remove('view-draw', 'view-photos', 'bnav-auto-hidden', 'timer-landscape');
    document.body.style.overflow = '';
    document.body.style.pointerEvents = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.pointerEvents = '';
    const content = document.getElementById('content');
    if (content) { content.style.overflow = ''; content.style.pointerEvents = ''; }
    const app = document.querySelector('.app');
    const main = document.querySelector('.main');
    if (app) { app.style.pointerEvents = ''; app.style.overflow = ''; }
    if (main) main.style.pointerEvents = '';
    const bn = document.getElementById('bottomNav');
    if (bn) { bn.classList.remove('bnav-hidden'); bn.style.pointerEvents = 'auto'; }
    if (window._drawInitTimer) { clearTimeout(window._drawInitTimer); window._drawInitTimer = null; }
    if (window._photoInitTimer) { clearTimeout(window._photoInitTimer); window._photoInitTimer = null; }
    window._isDrawing = false;
    window._syncPausedUntil = 0;
    try { if (typeof stopVoiceInput === 'function') stopVoiceInput(false); } catch {}
  }

  window.forceUnlockUI = forceUnlockUI;

  function resetPageUI() { forceUnlockUI(); }

  window.resetPageUI = resetPageUI;
  window.cleanupSyncUI = resetPageUI;

  window.addEventListener('pagehide', () => {
    sessionStorage.removeItem(GREET_KEY);
    if (sb && myId && myRole) {
      sb.from('room_presence').upsert({
        room_id: roomId(), user_id: myId, name: ROLE_LABEL[myRole] || myName, role: myRole,
        page: 'away', ts: Date.now(),
      }).catch(() => {});
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (!sb || !myRole) return;
    pingPresence(currentSyncPage || 'lobby');
    fetchPresence();
  });
  window.syncRefreshHomePresence = () => { if (sb && getRole()) fetchPresence(); };

  window.startDrawSync = startDrawSync;
  window.stopDrawSync = stopDrawSync;
  window.stopSyncHub = stopSyncHub;

  window.startPhotoShare = startPhotoShare;

  window.stopPhotoShare = stopPhotoShare;

  window.startGlobalPhotoListener = startGlobalPhotoListener;
  window.ensureSyncHub = ensureSyncHub;
  window.getSyncClient = () => sb;

  window.syncIsEnabled = cfgOk;

  window.syncScheduleSnapshot = scheduleSnapshotPush;

})();


