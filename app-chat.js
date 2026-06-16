// 悄悄话 · 双人聊天（文字 / 语音 / 图片 / 视频 · Supabase 永久保存）

(function () {
  const LOCAL_CHAT = 'sync-chat-local';
  let chatBound = false;
  let chatMessages = [];
  let chatSince = 0;
  let chatRec = null;
  let chatRecChunks = [];
  let chatRecStream = null;
  let chatSending = false;

  function getCfg() { return window.SYNC_CONFIG || {}; }
  function roomId() { return getCfg().roomId || 'wanning-xiaowu'; }
  function cfgOk() { return typeof window.syncIsEnabled === 'function' && window.syncIsEnabled(); }
  function toast(msg, ms) { if (typeof window.toast === 'function') window.toast(msg, ms); }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmtTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  function myId() {
    let id = localStorage.getItem('sync-client-id');
    if (!id) return '';
    return id;
  }

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
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('img')); };
      img.src = url;
    });
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function renderChatMessages() {
    const box = document.getElementById('chatMessages');
    if (!box) return;
    if (!chatMessages.length) {
      box.innerHTML = '<p class="chat-empty">还没有消息，发第一条悄悄话吧 💕</p>';
      return;
    }
    const uid = myId();
    box.innerHTML = chatMessages.map(m => {
      const mine = m.by_user === uid || m.by === uid;
      const cls = mine ? 'mine' : 'peer';
      const name = esc(m.name || 'TA');
      let body = '';
      if (m.type === 'text') body = `<div class="chat-bubble">${esc(m.content || '')}</div>`;
      else if (m.type === 'image') body = `<div class="chat-bubble">${m.content ? `<p>${esc(m.content)}</p>` : ''}<img src="${m.media || m.thumb || ''}" alt="图片" loading="lazy"></div>`;
      else if (m.type === 'video') body = `<div class="chat-bubble">${m.content ? `<p>${esc(m.content)}</p>` : ''}<video src="${m.media || ''}" controls playsinline preload="none" poster="${m.thumb || ''}"></video></div>`;
      else if (m.type === 'audio') body = `<div class="chat-bubble"><audio src="${m.media || ''}" controls preload="metadata"></audio></div>`;
      else body = `<div class="chat-bubble">${esc(m.content || '[消息]')}</div>`;
      return `<div class="chat-msg ${cls}" data-id="${esc(m.id || '')}">
        <div class="chat-msg-meta">${name} · ${fmtTime(m.ts)}</div>${body}</div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
  }

  function mergeMessages(items) {
    const map = new Map();
    (chatMessages || []).forEach(m => { if (m.id) map.set(m.id, m); });
    (items || []).forEach(m => { if (m.id) map.set(m.id, m); });
    chatMessages = [...map.values()].sort((a, b) => (a.ts || 0) - (b.ts || 0)).slice(-180);
    try {
      const cacheRows = chatMessages.slice(-60).map(m => {
        if (m.type === 'video') return { ...m, media: '', thumb: m.thumb || '' };
        return m;
      });
      localStorage.setItem(LOCAL_CHAT, JSON.stringify(cacheRows));
    } catch {}
    renderChatMessages();
  }

  async function loadChatMessages() {
    try {
      chatMessages = JSON.parse(localStorage.getItem(LOCAL_CHAT) || '[]');
      renderChatMessages();
    } catch { chatMessages = []; }
    if (!cfgOk()) return;
    const sb = typeof window.getSyncClient === 'function' ? window.getSyncClient() : null;
    if (!sb) return;
    const { data, error } = await sb.from('room_messages')
      .select('id, type, content, media, thumb, ts, name, role, by_user')
      .eq('room_id', roomId())
      .order('ts', { ascending: true })
      .limit(200);
    if (!error && data?.length) mergeMessages(data);
  }

  async function sendChatMessage(type, content, media, thumb) {
    if (chatSending) { toast('上一条还在发送中，请稍等一下～'); return; }
    const sb = typeof window.getSyncClient === 'function' ? window.getSyncClient() : null;
    if (!sb || !cfgOk()) { toast('请先连接云端并选好人设'); return; }
    if (type === 'text' && !(content || '').trim()) return;
    chatSending = true;
    const entry = {
      room_id: roomId(),
      type: type || 'text',
      content: (content || '').trim().slice(0, 800),
      media: media || '',
      thumb: thumb || '',
      ts: Date.now(),
      by_user: myId(),
      role: localStorage.getItem('sync-role') || '',
      name: localStorage.getItem('sync-display-name') || '小伙伴',
    };
    try {
      const sendReq = sb.from('room_messages').insert(entry).select().single();
      const timeoutReq = new Promise((_, reject) => setTimeout(() => reject(new Error('发送超时，请检查网络后重试')), 15000));
      const { data, error } = await Promise.race([sendReq, timeoutReq]);
      if (error) throw error;
      if (data) mergeMessages([data]);
      const inp = document.getElementById('chatInput');
      if (inp) inp.value = '';
    } catch (e) {
      toast('发送失败：' + (e.message || '请检查网络'));
    } finally {
      chatSending = false;
    }
  }

  function stopChatVoice() {
    if (chatRec && chatRec.state !== 'inactive') {
      try { chatRec.stop(); } catch {}
    }
    if (chatRecStream) {
      chatRecStream.getTracks().forEach(t => t.stop());
      chatRecStream = null;
    }
    document.getElementById('chatVoiceBtn')?.classList.remove('on');
  }

  async function toggleChatVoice() {
    const btn = document.getElementById('chatVoiceBtn');
    if (chatRec && chatRec.state === 'recording') {
      stopChatVoice();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) { toast('当前浏览器不支持录音'); return; }
    try {
      chatRecStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chatRecChunks = [];
      chatRec = new MediaRecorder(chatRecStream);
      chatRec.ondataavailable = e => { if (e.data?.size) chatRecChunks.push(e.data); };
      chatRec.onstop = async () => {
        btn?.classList.remove('on');
        if (!chatRecChunks.length) return;
        const blob = new Blob(chatRecChunks, { type: chatRec.mimeType || 'audio/webm' });
        if (blob.size > 900000) { toast('语音太长啦，请录短一点'); return; }
        const dataUrl = await readFileAsDataURL(blob);
        await sendChatMessage('audio', '', dataUrl);
        toast('语音已发送 🎤', 2000);
      };
      chatRec.start();
      btn?.classList.add('on');
      toast('正在录音… 再点结束', 2000);
    } catch {
      toast('请允许麦克风权限哦');
    }
  }

  async function handleChatFile(file, type) {
    if (!file) return;
    if (type === 'image') {
      if (!file.type.startsWith('image/')) { toast('请选择图片'); return; }
      toast('正在处理图片…');
      let img = '';
      try { img = await compressImageFile(file); } catch { toast('图片读取失败'); return; }
      if (img.length > 900000) {
        try { img = await compressImageFile(file, 720, 0.65); } catch {}
      }
      if (img.length > 900000) { toast('图片太大，换一张小一点的'); return; }
      const caption = (document.getElementById('chatInput')?.value || '').trim().slice(0, 120);
      await sendChatMessage('image', caption, img, img);
      toast('图片已发送 🖼', 2000);
    } else if (type === 'video') {
      if (!file.type.startsWith('video/')) { toast('请选择视频'); return; }
      if (file.size > 8 * 1024 * 1024) { toast('视频请小于 8MB'); return; }
      toast('正在处理视频…');
      const dataUrl = await readFileAsDataURL(file);
      if (dataUrl.length > 9000000) { toast('视频太大，请换短一点的'); return; }
      const caption = (document.getElementById('chatInput')?.value || '').trim().slice(0, 120);
      await sendChatMessage('video', caption, dataUrl, '');
      toast('视频已发送 🎬', 2000);
    }
  }

  function bindChatUI() {
    if (chatBound) return;
    chatBound = true;
    document.getElementById('chatSendBtn')?.addEventListener('click', () => {
      const v = document.getElementById('chatInput')?.value || '';
      sendChatMessage('text', v);
    });
    document.getElementById('chatInput')?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage('text', e.target.value); }
    });
    document.getElementById('chatVoiceBtn')?.addEventListener('click', toggleChatVoice);
    document.getElementById('chatPickImg')?.addEventListener('click', () => document.getElementById('chatImgInput')?.click());
    document.getElementById('chatPickVideo')?.addEventListener('click', () => document.getElementById('chatVideoInput')?.click());
    document.getElementById('chatImgInput')?.addEventListener('change', e => {
      handleChatFile(e.target.files?.[0], 'image');
      e.target.value = '';
    });
    document.getElementById('chatVideoInput')?.addEventListener('change', e => {
      handleChatFile(e.target.files?.[0], 'video');
      e.target.value = '';
    });
  }

  window.onChatMessageInsert = function (row) {
    if (!row || row.by_user === myId()) return;
    if ((row.ts || 0) < chatSince) return;
    mergeMessages([row]);
    if (typeof view !== 'undefined' && view !== 'chat') {
      toast(`💬 ${row.name || 'TA'} 发来悄悄话`, 2600);
    }
  };

  async function startChatSync() {
    if (typeof view !== 'undefined' && view !== 'chat') return;
    chatSince = Date.now();
    bindChatUI();
    loadChatMessages();
    if (typeof window.ensureSyncHub === 'function') {
      try { await window.ensureSyncHub('chat'); } catch {}
    } else if (typeof window.startGlobalPhotoListener === 'function') {
      await window.startGlobalPhotoListener();
    }
    if (typeof view !== 'undefined' && view !== 'chat') return;
    if (typeof window.syncEnterModule === 'function') window.syncEnterModule('chat');
    loadChatMessages();
  }

  window.startChatSync = startChatSync;
  window.stopChatSync = stopChatVoice;
})();
