/**
 * Shared configuration manager for 20/10 Flower Gift
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'gift_custom_config';

  const DEFAULT_CONFIG = {
    // 1. Mật khẩu ngày sinh
    birthday: '20/10/2004',
    lockTitle: 'Món quà dành riêng cho cậu ♡',
    lockInstruction: 'Nhập ngày tháng năm sinh của cậu để mở khóa món quà nhé!',
    lockHint: 'Gợi ý: Ngày sinh đầy đủ (dd/mm/yyyy - ví dụ: 20/10/2004)',

    // 2. Nội dung thư trên trang chính (Index)
    recipient: 'Bạn',
    letterTitle: 'Chúc bạn một ngày\nthật nhiều yêu thương.',
    letterMessage: 'Nhân ngày Phụ nữ Việt Nam 20/10, gửi đến bạn một bó hoa cẩm tú cầu ngập tràn sắc màu cùng ngàn lời thương mến.\n\nChúc bạn mỗi ngày đều ngập tràn niềm vui, an yên trong tâm hồn và luôn tự tin rạng rỡ theo cách của riêng mình.\n\nCảm ơn bạn vì đã luôn mang đến những điều dịu dàng và ấm áp nhất!',
    sender: 'Người gửi',

    // 3. Vườn hoa (Garden)
    dedication: 'Dành tặng bạn cả một vườn thương.',
    gardenCardTitle: 'Tặng cậu một vườn hoa'
  };

  // Decode config from URL hash (#cfg=...) if present
  function checkUrlHash() {
    if (window.location.hash && window.location.hash.startsWith('#cfg=')) {
      try {
        const b64 = window.location.hash.slice(5);
        const json = decodeURIComponent(escape(atob(b64)));
        const data = JSON.parse(json);
        if (data && typeof data === 'object') {
          saveConfig(data);
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
          return data;
        }
      } catch (e) {
        console.warn('Cannot parse config from URL hash:', e);
      }
    }
    return null;
  }

  function getConfig() {
    const fromUrl = checkUrlHash();
    if (fromUrl) return { ...DEFAULT_CONFIG, ...fromUrl };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {}

    return { ...DEFAULT_CONFIG };
  }

  function saveConfig(cfg) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch (e) {}
  }

  const ADMIN_STORAGE_KEY = 'gift_admin_auth';
  const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'admin2010'
  };

  function getAdminAuth() {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (saved) return { ...DEFAULT_ADMIN, ...JSON.parse(saved) };
    } catch (e) {}
    return { ...DEFAULT_ADMIN };
  }

  function saveAdminAuth(auth) {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(auth));
    } catch (e) {}
  }

  function resetConfig() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function createShareUrl(cfg, customBase) {
    const json = JSON.stringify(cfg);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    let base = customBase;
    if (!base) {
      const loc = window.location;
      const path = loc.pathname.replace(/admin\.html|garden\.html/i, 'index.html');
      base = loc.origin + path;
    }
    return base + '#cfg=' + b64;
  }

  window.GiftConfig = Object.freeze({
    DEFAULT: DEFAULT_CONFIG,
    get: getConfig,
    save: saveConfig,
    reset: resetConfig,
    createShareUrl,
    getAdminAuth,
    saveAdminAuth
  });
})();
