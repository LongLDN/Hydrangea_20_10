(() => {
  'use strict';

  // =========================================================================
  // 🔒 CÀI ĐẶT MẬT KHẨU (Tự động tải từ Cấu hình chung GiftConfig nếu có)
  // =========================================================================
  const cfg = (typeof window.GiftConfig !== 'undefined' && window.GiftConfig.get)
    ? window.GiftConfig.get()
    : null;

  const LOCK_CONFIG = {
    // 👉 Ngày sinh mở khóa (ví dụ: '20/10/2004')
    birthday: (cfg && cfg.birthday) ? cfg.birthday : '20/10/2004',

    // Tiêu đề hiển thị ở màn hình khóa
    title: (cfg && cfg.lockTitle) ? cfg.lockTitle : 'Món quà dành riêng cho bạn ♡',

    // Lời nhắn hướng dẫn
    instruction: (cfg && cfg.lockInstruction) ? cfg.lockInstruction : 'Nhập ngày tháng năm sinh để mở khóa món quà nhé!',

    // Gợi ý hiển thị dưới ô nhập
    hint: (cfg && cfg.lockHint) ? cfg.lockHint : 'Gợi ý: Ngày sinh đầy đủ (dd/mm/yyyy - ví dụ: 20/10/2004)',

    // Chữ trên nút bấm
    buttonText: 'Mở quà ✨',

    // Lời nhắn khi nhập sai
    errorMessage: 'Hình như chưa đúng ngày sinh rồi, cậu thử lại nhé ♡'
  };

  const STORAGE_KEY = 'gift_unlocked';

  // Chuẩn hóa chuỗi ngày sinh để so sánh không phân biệt định dạng gõ
  function standardizeDate(str) {
    if (!str) return '';
    const cleaned = String(str).trim();
    const parts = cleaned.split(/[\/\-\.\s]+/);
    if (parts.length === 3) {
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      let y = parts[2];
      if (y.length === 2) y = '20' + y;
      return `${d}${m}${y}`;
    }
    return cleaned.replace(/\D/g, '');
  }

  // Tự động định dạng khi người dùng gõ số: dd/mm/yyyy
  function formatAsDateInput(val) {
    const digits = val.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
  }

  function initLock() {
    // Nếu đã mở khóa trong phiên này thì không hiện lại
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'giftLockOverlay';
    overlay.className = 'gift-lock-overlay';
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('role', 'dialog');

    overlay.innerHTML = `
      <div class="gift-lock-card">
        <div class="lock-icon" aria-hidden="true">
          <span class="lock-heart">♡</span>
          <span class="lock-flower">❀</span>
        </div>
        <h2 class="lock-title">${LOCK_CONFIG.title}</h2>
        <p class="lock-message">${LOCK_CONFIG.instruction}</p>
        <form class="lock-form" id="lockForm" autocomplete="off">
          <div class="lock-input-wrapper">
            <input 
              id="birthdayInput" 
              class="lock-input"
              type="text" 
              inputmode="numeric" 
              placeholder="dd/mm/yyyy" 
              maxlength="10" 
              required 
              autofocus 
              aria-label="Ngày tháng năm sinh"
            >
          </div>
          <p id="lockError" class="lock-error" role="alert" aria-live="polite" hidden></p>
          <p class="lock-hint">${LOCK_CONFIG.hint}</p>
          <button type="submit" class="lock-submit-btn">${LOCK_CONFIG.buttonText}</button>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    const form = document.getElementById('lockForm');
    const input = document.getElementById('birthdayInput');
    const errorEl = document.getElementById('lockError');

    // Tự động thêm dấu / khi nhập số
    input.addEventListener('input', () => {
      const formatted = formatAsDateInput(input.value);
      input.value = formatted;
      errorEl.hidden = true;
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = standardizeDate(input.value);
      const target = standardizeDate(LOCK_CONFIG.birthday);

      if (entered && entered === target) {
        sessionStorage.setItem(STORAGE_KEY, 'true');
        overlay.classList.add('unlocked');
        overlay.style.pointerEvents = 'none';
        
        // Mở khóa xong đảm bảo vào trang Index
        const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || !window.location.pathname.includes('.html');
        if (!isIndex) {
          setTimeout(() => {
            window.location.replace('./index.html');
          }, 350);
        } else {
          document.dispatchEvent(new Event('bouquet:celebrate'));
          setTimeout(() => {
            overlay.remove();
          }, 550);
        }
      } else {
        errorEl.textContent = LOCK_CONFIG.errorMessage;
        errorEl.hidden = false;
        input.classList.remove('shake');
        void input.offsetWidth;
        input.classList.add('shake');
        input.select();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLock);
  } else {
    initLock();
  }
})();
