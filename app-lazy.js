// 登录后再加载的重模块（题库 / 公式 / 导出 / 云端同步）
(function () {
  const LAZY_SCRIPTS = [
    'gaokao-bank.js',
    'lib/katex.min.js',
    'lib/html2canvas.min.js',
    'sync-config.js',
    'app-sync.js',
    'app-chat.js',
  ];
  let loading = false;
  let loaded = false;
  let queue = [];

  function loadOne(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(src));
      document.head.appendChild(s);
    });
  }

  function loadKatexCss() {
    if (document.getElementById('katex-css-link')) return Promise.resolve();
    return new Promise(resolve => {
      const link = document.createElement('link');
      link.id = 'katex-css-link';
      link.rel = 'stylesheet';
      link.href = 'lib/katex.min.css';
      link.onload = () => resolve();
      link.onerror = () => resolve();
      document.head.appendChild(link);
    });
  }

  function loadSupabase() {
    if (window.supabase) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.onload = () => resolve();
      s.onerror = () => resolve();
      document.head.appendChild(s);
    });
  }

  window.loadHeavyModules = function (cb) {
    if (loaded) { cb?.(); return Promise.resolve(); }
    queue.push(cb);
    if (loading) return Promise.resolve();
    loading = true;
    return (async () => {
      try {
        await loadKatexCss();
        for (const src of LAZY_SCRIPTS) await loadOne(src);
        await loadSupabase();
        loaded = true;
        window._heavyModulesReady = true;
      } catch (e) {
        console.warn('lazy load partial fail', e);
        window._heavyModulesReady = true;
      }
      loading = false;
      const cbs = queue.splice(0);
      cbs.forEach(fn => { try { fn(); } catch {} });
    })();
  };

  window.ensureHeavyModule = function (name, cb) {
    window.loadHeavyModules(() => {
      if (name === 'sync' && typeof startGlobalPhotoListener === 'function') startGlobalPhotoListener();
      if (name === 'draw' && typeof startDrawSync === 'function') startDrawSync();
      if (name === 'photos' && typeof startPhotoShare === 'function') startPhotoShare();
      if (name === 'chat' && typeof startChatSync === 'function') startChatSync();
      cb?.();
    });
  };
})();
