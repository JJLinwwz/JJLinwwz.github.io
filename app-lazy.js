// 登录后再加载的重模块（并行加载，不阻塞首屏）
(function () {
  const LAZY_GROUPS = [
    ['app-ext.js', 'sync-config.js', 'gaokao-bank.js'],
    ['app-sync.js', 'app-chat.js'],
    ['lib/katex.min.js', 'lib/html2canvas.min.js'],
  ];
  let loading = false;
  let loaded = false;
  let queue = [];

  function loadOne(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[data-lazy="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.dataset.lazy = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(src));
      document.head.appendChild(s);
    });
  }

  function loadGroup(list) {
    return Promise.all(list.map(loadOne));
  }

  function loadKatexCss() {
    if (document.getElementById('katex-css-link')) return Promise.resolve();
    return new Promise(resolve => {
      const link = document.createElement('link');
      link.id = 'katex-css-link';
      link.rel = 'stylesheet';
      link.href = 'lib/katex.min.css';
      link.media = 'print';
      link.onload = () => { link.media = 'all'; resolve(); };
      link.onerror = () => resolve();
      document.head.appendChild(link);
    });
  }

  function loadSupabase() {
    if (window.supabase) return Promise.resolve();
    return new Promise(resolve => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.async = true;
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
        for (const group of LAZY_GROUPS) await loadGroup(group);
        await Promise.all([loadKatexCss(), loadSupabase()]);
        loaded = true;
        window._heavyModulesReady = true;
      } catch (e) {
        console.warn('lazy load partial fail', e);
        window._heavyModulesReady = true;
      }
      loading = false;
      queue.splice(0).forEach(fn => { try { fn(); } catch {} });
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
