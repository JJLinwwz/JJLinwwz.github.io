// 二人小工具 · 心愿清单 / 一百件小事 / 成长记录 / 每日签到
(function () {
  const WISH_CATS = [
    { id: 'travel', label: '旅行目的地', icon: '✈️' },
    { id: 'food', label: '美食清单', icon: '🍜' },
    { id: 'life', label: '生活小事', icon: '🌸' },
  ];
  const HUNDRED_PRESETS = [
    '一起看一次日出', '一起淋一场雨', '一起坐摩天轮', '一起逛夜市', '一起做饭',
    '一起养一盆花', '一起拍一张拍立得', '一起写一封信给未来的我们', '一起去海边', '一起看电影到睡着',
    '一起跨年倒数', '一起学一道新菜', '一起去博物馆', '一起坐长途火车', '一起放孔明灯',
    '一起拍情侣 vlog', '一起逛宜家', '一起听一场 live', '一起露营看星星', '一起养一只宠物',
  ];
  const MOODS = ['😊', '🥰', '💪', '🌧', '😴', '✨', '💕', '🌸'];

  let wishes = [];
  let hundred = [];
  let growth = [];
  let checkins = [];
  let wishTab = 'travel';
  let hundredFilter = 'all';
  let coupleBound = { wishes: false, hundred: false, growth: false, home: false };

  function cfgOk() { return typeof window.syncIsEnabled === 'function' && window.syncIsEnabled(); }
  function roomId() { return (window.SYNC_CONFIG || {}).roomId || 'wanning-xiaowu'; }
  function sb() { return typeof window.getSyncClient === 'function' ? window.getSyncClient() : null; }
  function toast(msg, ms) { if (typeof window.toast === 'function') window.toast(msg, ms); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function myId() { return localStorage.getItem('sync-client-id') || ''; }
  function myName() { return localStorage.getItem('sync-display-name') || '小伙伴'; }
  function fmtDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function fmtDateCn(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }
  function todayStr() { return new Date().toISOString().slice(0, 10); }

  async function compressImageFile(file) {
    if (typeof window.compressImageFile === 'function') return window.compressImageFile(file);
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 960 / (img.width || 960));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('img')); };
      img.src = url;
    });
  }

  async function ensureHub() {
    if (typeof window.ensureSyncHub === 'function') {
      try { await window.ensureSyncHub('lobby'); } catch {}
    } else if (typeof window.loadHeavyModules === 'function') {
      await new Promise(r => window.loadHeavyModules(r));
    }
  }

  // ── 数据加载 ──
  async function loadWishes() {
    try { wishes = JSON.parse(localStorage.getItem('couple-wishes') || '[]'); } catch { wishes = []; }
    const client = sb();
    if (!client || !cfgOk()) return;
    const { data } = await client.from('room_wishes').select('*').eq('room_id', roomId()).order('ts', { ascending: false });
    if (data?.length) {
      wishes = data;
      try { localStorage.setItem('couple-wishes', JSON.stringify(wishes.slice(0, 200))); } catch {}
    }
  }

  async function loadHundred() {
    try { hundred = JSON.parse(localStorage.getItem('couple-hundred') || '[]'); } catch { hundred = []; }
    const client = sb();
    if (!client || !cfgOk()) return;
    const { data } = await client.from('room_hundred').select('*').eq('room_id', roomId()).order('sort_order', { ascending: true });
    if (data?.length) {
      hundred = data;
      try { localStorage.setItem('couple-hundred', JSON.stringify(hundred)); } catch {}
    }
  }

  async function loadGrowth() {
    try { growth = JSON.parse(localStorage.getItem('couple-growth') || '[]'); } catch { growth = []; }
    const client = sb();
    if (!client || !cfgOk()) return;
    const { data } = await client.from('room_growth').select('*').eq('room_id', roomId()).order('ts', { ascending: false }).limit(100);
    if (data?.length) {
      growth = data;
      try { localStorage.setItem('couple-growth', JSON.stringify(growth.slice(0, 50))); } catch {}
    }
  }

  async function loadCheckins() {
    try { checkins = JSON.parse(localStorage.getItem('couple-checkins') || '[]'); } catch { checkins = []; }
    const client = sb();
    if (!client || !cfgOk()) return;
    const { data } = await client.from('room_checkins').select('*').eq('room_id', roomId()).order('check_date', { ascending: false }).limit(60);
    if (data?.length) {
      checkins = data;
      try { localStorage.setItem('couple-checkins', JSON.stringify(checkins)); } catch {}
    }
  }

  window.preloadCoupleData = async function () {
    await ensureHub();
    await Promise.all([loadWishes(), loadHundred(), loadGrowth(), loadCheckins()]);
  };

  window.getCoupleHomeStats = function () {
    const wishDone = wishes.filter(w => w.done).length;
    const hDone = hundred.filter(h => h.done).length;
    const hTotal = hundred.length;
    const today = todayStr();
    const myChecked = checkins.some(c => c.check_date === today && c.by_user === myId());
    const peerChecked = checkins.some(c => c.check_date === today && c.by_user && c.by_user !== myId());
    return {
      wishDone, wishTotal: wishes.length,
      hundredDone: hDone, hundredTotal: hTotal,
      hundredPct: hTotal ? Math.round(hDone / hTotal * 100) : 0,
      myChecked, peerChecked, bothChecked: myChecked && peerChecked,
      checkinDays: new Set(checkins.map(c => c.check_date)).size,
    };
  };

  // ── 心愿清单 ──
  function wishListHtml(cat) {
    const list = wishes.filter(w => w.category === cat);
    const pending = list.filter(w => !w.done);
    const done = list.filter(w => w.done);
    const block = (items, doneFlag) => {
      if (!items.length) return doneFlag ? '' : `<p class="couple-empty">还没有条目，一起添加第一个吧 💕</p>`;
      return items.map(w => `
        <div class="couple-item${w.done ? ' done' : ''}" data-wid="${w.id}">
          <label class="couple-check"><input type="checkbox" ${w.done ? 'checked' : ''} data-toggle-wish="${w.id}"><span>${esc(w.title)}</span></label>
          ${w.note ? `<p class="couple-note">${esc(w.note)}</p>` : ''}
          ${w.photo ? `<img class="couple-thumb" src="${w.photo}" alt="">` : ''}
          <div class="couple-meta">${esc(w.name || '')} · ${fmtDateCn(w.ts)}${w.done && w.completed_at ? ' · 已完成' : ''}</div>
          <div class="couple-item-actions">
            <button type="button" class="btn" data-edit-wish="${w.id}">✏️</button>
            <button type="button" class="btn" data-del-wish="${w.id}">🗑</button>
          </div>
        </div>`).join('');
    };
    return `<div class="couple-section"><h3>待完成 (${pending.length})</h3>${block(pending, false)}</div>
      ${done.length ? `<div class="couple-section done-section"><h3>已完成 (${done.length})</h3>${block(done, true)}</div>` : ''}`;
  }

  window.renderWishes = function () {
    const cat = WISH_CATS.find(c => c.id === wishTab) || WISH_CATS[0];
    const st = window.getCoupleHomeStats();
    return `<div class="content-inner couple-page">
      <h2 class="section-title">共同心愿清单 🌟</h2>
      <p class="section-desc">打卡想去的地方、想吃的美食、想完成的小事</p>
      <div class="couple-progress-bar"><div class="couple-progress-fill" style="width:${st.wishTotal ? Math.round(st.wishDone / st.wishTotal * 100) : 0}%"></div></div>
      <p class="couple-progress-text">已完成 ${st.wishDone} / ${st.wishTotal} 个心愿</p>
      <div class="couple-tabs">${WISH_CATS.map(c => `<button type="button" class="couple-tab${wishTab === c.id ? ' on' : ''}" data-wish-tab="${c.id}">${c.icon} ${c.label}</button>`).join('')}</div>
      <div class="couple-add-row">
        <input type="text" id="wishInput" placeholder="添加${cat.label}…" maxlength="80">
        <button type="button" class="btn btn-primary" id="wishAddBtn">+ 添加</button>
      </div>
      <div id="wishList">${wishListHtml(wishTab)}</div>
    </div>`;
  };

  async function addWish(title, cat) {
    const client = sb();
    if (!client || !cfgOk()) { toast('请先连接云端'); return; }
    const entry = { room_id: roomId(), category: cat || wishTab, title: title.trim(), done: false, note: '', photo: '', ts: Date.now(), by_user: myId(), name: myName() };
    const { data, error } = await client.from('room_wishes').insert(entry).select().single();
    if (error) { toast('添加失败'); return; }
    wishes.unshift(data);
    try { localStorage.setItem('couple-wishes', JSON.stringify(wishes.slice(0, 200))); } catch {}
    const inp = document.getElementById('wishInput');
    if (inp) inp.value = '';
    if (typeof render === 'function' && typeof view !== 'undefined' && view === 'wishes') render();
  }

  async function toggleWish(id, done) {
    const client = sb();
    const w = wishes.find(x => x.id === id);
    if (!w || !client) return;
    const patch = { done: !!done, completed_at: done ? Date.now() : null };
    await client.from('room_wishes').update(patch).eq('id', id);
    Object.assign(w, patch);
    try { localStorage.setItem('couple-wishes', JSON.stringify(wishes)); } catch {}
    if (typeof render === 'function' && view === 'wishes') render();
  }

  async function deleteWish(id) {
    if (!confirm('确定删除这条心愿？')) return;
    const client = sb();
    if (client) await client.from('room_wishes').delete().eq('id', id);
    wishes = wishes.filter(w => w.id !== id);
    try { localStorage.setItem('couple-wishes', JSON.stringify(wishes)); } catch {}
    if (typeof render === 'function') render();
  }

  function openWishEdit(id) {
    const w = wishes.find(x => x.id === id);
    if (!w || typeof closeModal !== 'function') return;
    document.getElementById('modalTitle').textContent = '编辑心愿';
    document.getElementById('modalBody').innerHTML = `
      <div class="form-row"><label>标题</label><input id="weTitle" value="${esc(w.title)}"></div>
      <div class="form-row"><label>打卡心得</label><textarea id="weNote" rows="3">${esc(w.note || '')}</textarea></div>
      <div class="form-row"><label>现场照片</label><input type="file" id="wePhoto" accept="image/*"><div id="wePhotoPrev">${w.photo ? `<img src="${w.photo}" style="max-width:100%;margin-top:8px;border-radius:8px">` : ''}</div></div>`;
    document.getElementById('modalFooter').innerHTML = `<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="weSave">保存</button>`;
    document.getElementById('modal').classList.add('show');
    let photo = w.photo || '';
    document.getElementById('wePhoto')?.addEventListener('change', async e => {
      const f = e.target.files?.[0];
      if (!f) return;
      photo = await compressImageFile(f);
      document.getElementById('wePhotoPrev').innerHTML = `<img src="${photo}" style="max-width:100%;margin-top:8px;border-radius:8px">`;
    });
    document.getElementById('weSave').onclick = async () => {
      const client = sb();
      const patch = { title: document.getElementById('weTitle').value.trim(), note: document.getElementById('weNote').value.trim(), photo };
      if (client) await client.from('room_wishes').update(patch).eq('id', id);
      Object.assign(w, patch);
      closeModal();
      render();
      toast('已保存');
    };
  }

  window.initWishes = function () {
    if (!coupleBound.wishes) {
      coupleBound.wishes = true;
      document.addEventListener('click', e => {
        const tab = e.target.closest('[data-wish-tab]');
        if (tab) { wishTab = tab.dataset.wishTab; render(); return; }
        const add = e.target.closest('#wishAddBtn');
        if (add) {
          const v = document.getElementById('wishInput')?.value?.trim();
          if (v) addWish(v, wishTab);
          return;
        }
        const tw = e.target.closest('[data-toggle-wish]');
        if (tw) { toggleWish(tw.dataset.toggleWish, tw.checked); return; }
        const ed = e.target.closest('[data-edit-wish]');
        if (ed) { openWishEdit(ed.dataset.editWish); return; }
        const del = e.target.closest('[data-del-wish]');
        if (del) { deleteWish(del.dataset.delWish); return; }
      });
      document.addEventListener('keydown', e => {
        if (view !== 'wishes' || e.key !== 'Enter') return;
        if (e.target.id === 'wishInput') { e.preventDefault(); addWish(e.target.value.trim(), wishTab); }
      });
    }
    ensureHub().then(loadWishes).then(() => { if (view === 'wishes') render(); });
  };

  // ── 一百件小事 ──
  function hundredListHtml() {
    let list = [...hundred];
    if (hundredFilter === 'pending') list = list.filter(h => !h.done);
    if (hundredFilter === 'done') list = list.filter(h => h.done);
    const st = window.getCoupleHomeStats();
    if (!list.length) return `<p class="couple-empty">${hundredFilter === 'all' ? '还没有约定，从预设或自定义开始吧 💕' : '这一栏是空的'}</p>`;
    return list.map((h, i) => `
      <div class="couple-item hundred-item${h.done ? ' done' : ''}" data-hid="${h.id}">
        <span class="hundred-num">${h.sort_order || i + 1}</span>
        <label class="couple-check"><input type="checkbox" ${h.done ? 'checked' : ''} data-toggle-hundred="${h.id}"><span>${esc(h.title)}</span></label>
        ${h.note ? `<p class="couple-note">${esc(h.note)}</p>` : ''}
        ${h.photo ? `<img class="couple-thumb" src="${h.photo}" alt="">` : ''}
        <div class="couple-meta">${esc(h.name || '')}${h.completed_at ? ' · ' + fmtDateCn(h.completed_at) : ''}</div>
        <div class="couple-item-actions">
          <button type="button" class="btn" data-edit-hundred="${h.id}">✏️</button>
          <button type="button" class="btn" data-del-hundred="${h.id}">🗑</button>
        </div>
      </div>`).join('') + `<p class="couple-progress-text" style="margin-top:12px">进度 ${st.hundredDone} / ${st.hundredTotal}（${st.hundredPct}%）</p>`;
  }

  window.renderHundred = function () {
    const st = window.getCoupleHomeStats();
    return `<div class="content-inner couple-page">
      <h2 class="section-title">我们的一百件小事 💫</h2>
      <p class="section-desc">列出专属约定，一件一件慢慢完成</p>
      <div class="couple-progress-bar"><div class="couple-progress-fill" style="width:${st.hundredPct}%"></div></div>
      <p class="couple-progress-text">已完成 ${st.hundredDone} / ${st.hundredTotal} 件 · ${st.hundredPct}%</p>
      <div class="couple-tabs">
        <button type="button" class="couple-tab${hundredFilter === 'all' ? ' on' : ''}" data-hundred-filter="all">全部</button>
        <button type="button" class="couple-tab${hundredFilter === 'pending' ? ' on' : ''}" data-hundred-filter="pending">待完成</button>
        <button type="button" class="couple-tab${hundredFilter === 'done' ? ' on' : ''}" data-hundred-filter="done">已完成</button>
      </div>
      <div class="couple-add-row">
        <input type="text" id="hundredInput" placeholder="添加我们的小事…" maxlength="80">
        <button type="button" class="btn btn-primary" id="hundredAddBtn">+ 添加</button>
        <button type="button" class="btn" id="hundredPresetBtn">✨ 导入预设</button>
      </div>
      <div id="hundredList">${hundredListHtml()}</div>
    </div>`;
  };

  async function addHundred(title) {
    const client = sb();
    if (!client || !cfgOk()) { toast('请先连接云端'); return; }
    if (hundred.length >= 100) { toast('已经满 100 件啦'); return; }
    const entry = { room_id: roomId(), title: title.trim(), done: false, note: '', photo: '', sort_order: hundred.length + 1, ts: Date.now(), by_user: myId(), name: myName() };
    const { data, error } = await client.from('room_hundred').insert(entry).select().single();
    if (error) { toast('添加失败'); return; }
    hundred.push(data);
    try { localStorage.setItem('couple-hundred', JSON.stringify(hundred)); } catch {}
    const inp = document.getElementById('hundredInput');
    if (inp) inp.value = '';
    render();
  }

  async function importHundredPresets() {
    const client = sb();
    if (!client || !cfgOk()) { toast('请先连接云端'); return; }
    const existing = new Set(hundred.map(h => h.title));
    const toAdd = HUNDRED_PRESETS.filter(t => !existing.has(t)).slice(0, Math.max(0, 100 - hundred.length));
    if (!toAdd.length) { toast('预设已导入或无空位'); return; }
    for (let i = 0; i < toAdd.length; i++) {
      const entry = { room_id: roomId(), title: toAdd[i], done: false, note: '', photo: '', sort_order: hundred.length + 1, ts: Date.now() + i, by_user: myId(), name: myName() };
      const { data } = await client.from('room_hundred').insert(entry).select().single();
      if (data) hundred.push(data);
    }
    try { localStorage.setItem('couple-hundred', JSON.stringify(hundred)); } catch {}
    toast(`已导入 ${toAdd.length} 条预设`);
    render();
  }

  async function toggleHundred(id, done) {
    const client = sb();
    const h = hundred.find(x => x.id === id);
    if (!h || !client) return;
    const patch = { done: !!done, completed_at: done ? Date.now() : null };
    await client.from('room_hundred').update(patch).eq('id', id);
    Object.assign(h, patch);
    try { localStorage.setItem('couple-hundred', JSON.stringify(hundred)); } catch {}
    render();
  }

  async function deleteHundred(id) {
    if (!confirm('确定删除？')) return;
    const client = sb();
    if (client) await client.from('room_hundred').delete().eq('id', id);
    hundred = hundred.filter(h => h.id !== id);
    try { localStorage.setItem('couple-hundred', JSON.stringify(hundred)); } catch {}
    render();
  }

  function openHundredEdit(id) {
    const h = hundred.find(x => x.id === id);
    if (!h) return;
    document.getElementById('modalTitle').textContent = '编辑小事';
    document.getElementById('modalBody').innerHTML = `
      <div class="form-row"><label>内容</label><input id="heTitle" value="${esc(h.title)}"></div>
      <div class="form-row"><label>完成体验</label><textarea id="heNote" rows="3">${esc(h.note || '')}</textarea></div>
      <div class="form-row"><label>照片</label><input type="file" id="hePhoto" accept="image/*"><div id="hePhotoPrev">${h.photo ? `<img src="${h.photo}" style="max-width:100%;margin-top:8px;border-radius:8px">` : ''}</div></div>`;
    document.getElementById('modalFooter').innerHTML = `<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="heSave">保存</button>`;
    document.getElementById('modal').classList.add('show');
    let photo = h.photo || '';
    document.getElementById('hePhoto')?.addEventListener('change', async e => {
      const f = e.target.files?.[0];
      if (f) { photo = await compressImageFile(f); document.getElementById('hePhotoPrev').innerHTML = `<img src="${photo}" style="max-width:100%;margin-top:8px;border-radius:8px">`; }
    });
    document.getElementById('heSave').onclick = async () => {
      const client = sb();
      const patch = { title: document.getElementById('heTitle').value.trim(), note: document.getElementById('heNote').value.trim(), photo };
      if (client) await client.from('room_hundred').update(patch).eq('id', id);
      Object.assign(h, patch);
      closeModal(); render(); toast('已保存');
    };
  }

  window.initHundred = function () {
    if (!coupleBound.hundred) {
      coupleBound.hundred = true;
      document.addEventListener('click', e => {
        const f = e.target.closest('[data-hundred-filter]');
        if (f) { hundredFilter = f.dataset.hundredFilter; render(); return; }
        if (e.target.closest('#hundredAddBtn')) {
          const v = document.getElementById('hundredInput')?.value?.trim();
          if (v) addHundred(v);
          return;
        }
        if (e.target.closest('#hundredPresetBtn')) { importHundredPresets(); return; }
        const tw = e.target.closest('[data-toggle-hundred]');
        if (tw) { toggleHundred(tw.dataset.toggleHundred, tw.checked); return; }
        const ed = e.target.closest('[data-edit-hundred]');
        if (ed) { openHundredEdit(ed.dataset.editHundred); return; }
        const del = e.target.closest('[data-del-hundred]');
        if (del) { deleteHundred(del.dataset.delHundred); return; }
      });
    }
    ensureHub().then(loadHundred).then(() => { if (view === 'hundred') render(); });
  };

  // ── 成长记录簿 ──
  function growthListHtml() {
    if (!growth.length) return '<p class="couple-empty">写下第一篇成长随笔，记录彼此的变化吧 🌱</p>';
    return growth.map(g => {
      const replies = Array.isArray(g.replies) ? g.replies : (typeof g.replies === 'string' ? JSON.parse(g.replies || '[]') : []);
      return `<article class="growth-entry" data-gid="${g.id}">
        <div class="growth-head"><strong>${esc(g.name || 'TA')}</strong> · ${fmtDateCn(g.ts)}</div>
        <div class="growth-body">${esc(g.content).replace(/\n/g, '<br>')}</div>
        ${replies.length ? `<div class="growth-replies">${replies.map(r => `<div class="growth-reply"><strong>${esc(r.name || 'TA')}</strong>：${esc(r.content)}</div>`).join('')}</div>` : ''}
        <div class="growth-actions">
          <button type="button" class="btn" data-reply-growth="${g.id}">💬 留言</button>
          ${g.by_user === myId() ? `<button type="button" class="btn" data-del-growth="${g.id}">🗑</button>` : ''}
        </div>
      </article>`;
    }).join('');
  }

  window.renderGrowth = function () {
    return `<div class="content-inner couple-page">
      <h2 class="section-title">成长记录簿 🌱</h2>
      <p class="section-desc">记录彼此的改变、收获、感悟与成长</p>
      <div class="couple-add-block">
        <textarea id="growthInput" rows="4" placeholder="写下今天的感悟、收获、想对 TA 说的话…" maxlength="2000"></textarea>
        <button type="button" class="btn btn-primary" id="growthAddBtn">📝 发布随笔</button>
      </div>
      <div id="growthList">${growthListHtml()}</div>
    </div>`;
  };

  async function addGrowth(content) {
    const client = sb();
    if (!client || !cfgOk()) { toast('请先连接云端'); return; }
    const entry = { room_id: roomId(), content: content.trim(), ts: Date.now(), by_user: myId(), name: myName(), replies: [] };
    const { data, error } = await client.from('room_growth').insert(entry).select().single();
    if (error) { toast('发布失败'); return; }
    growth.unshift(data);
    try { localStorage.setItem('couple-growth', JSON.stringify(growth.slice(0, 50))); } catch {}
    render();
    toast('已发布 ✨');
  }

  async function replyGrowth(id, content) {
    const client = sb();
    const g = growth.find(x => x.id === id);
    if (!g || !client) return;
    const replies = Array.isArray(g.replies) ? [...g.replies] : [];
    replies.push({ id: uid(), content: content.trim(), ts: Date.now(), by_user: myId(), name: myName() });
    await client.from('room_growth').update({ replies }).eq('id', id);
    g.replies = replies;
    try { localStorage.setItem('couple-growth', JSON.stringify(growth)); } catch {}
    render();
  }

  async function deleteGrowth(id) {
    if (!confirm('确定删除这篇随笔？')) return;
    const client = sb();
    if (client) await client.from('room_growth').delete().eq('id', id);
    growth = growth.filter(g => g.id !== id);
    render();
  }

  window.initGrowth = function () {
    if (!coupleBound.growth) {
      coupleBound.growth = true;
      document.addEventListener('click', e => {
        if (e.target.closest('#growthAddBtn')) {
          const v = document.getElementById('growthInput')?.value?.trim();
          if (v) { addGrowth(v); document.getElementById('growthInput').value = ''; }
          return;
        }
        const rp = e.target.closest('[data-reply-growth]');
        if (rp) {
          const txt = prompt('留言鼓励 TA：');
          if (txt?.trim()) replyGrowth(rp.dataset.replyGrowth, txt.trim());
          return;
        }
        const del = e.target.closest('[data-del-growth]');
        if (del) deleteGrowth(del.dataset.delGrowth);
      });
    }
    ensureHub().then(loadGrowth).then(() => { if (view === 'growth') render(); });
  };

  // ── 首页签到 ──
  async function doCheckin(mood, note) {
    const client = sb();
    if (!client || !cfgOk()) { toast('请先连接云端'); return; }
    const today = todayStr();
    if (checkins.some(c => c.check_date === today && c.by_user === myId())) { toast('今天已签到过啦'); return; }
    const entry = { room_id: roomId(), check_date: today, mood: mood || '😊', note: (note || '').trim(), photo: '', ts: Date.now(), by_user: myId(), name: myName() };
    const { data, error } = await client.from('room_checkins').insert(entry).select().single();
    if (error) { toast('签到失败'); return; }
    checkins.unshift(data);
    try { localStorage.setItem('couple-checkins', JSON.stringify(checkins)); } catch {}
    toast('签到成功 💕');
    if (typeof render === 'function' && view === 'home') render();
  }

  window.initCoupleHome = function () {
    if (coupleBound.home) return;
    coupleBound.home = true;
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-checkin-mood]');
      if (btn) doCheckin(btn.dataset.checkinMood, document.getElementById('checkinNote')?.value);
    });
    ensureHub().then(() => Promise.all([loadWishes(), loadHundred(), loadCheckins()])).then(() => {
      if (view === 'home' && typeof render === 'function') render();
    });
  };

  window.initCoupleView = function (v) {
    if (v === 'wishes') initWishes();
    else if (v === 'hundred') initHundred();
    else if (v === 'growth') initGrowth();
    else if (v === 'home') initCoupleHome();
  };
})();
