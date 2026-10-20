(() => {
  'use strict';

  // =========================================================================
  // ✍️ NỘI DUNG THƯ (Tự động tải từ Cấu hình chung GiftConfig nếu có)
  // =========================================================================
  const cfg = (typeof window.GiftConfig !== 'undefined' && window.GiftConfig.get)
    ? window.GiftConfig.get()
    : null;

  const greeting = {
    // Tên người nhận (ví dụ: 'Em', 'Mẹ', 'Vợ yêu'...)
    recipient: (cfg && cfg.recipient) ? cfg.recipient : 'Mến gửi bạn',

    // Tiêu đề lớn ở đầu lá thư
    title: (cfg && cfg.letterTitle) ? cfg.letterTitle : 'Chúc bạn một ngày\nthật nhiều yêu thương.',

    // Lời chúc chi tiết (các đoạn văn cách nhau bằng 2 dấu xuống dòng \n\n)
    message: (cfg && cfg.letterMessage) ? cfg.letterMessage : 'Nhân ngày Phụ nữ Việt Nam 20/10, gửi đến bạn một bó hoa cẩm tú cầu ngập tràn sắc màu cùng ngàn lời thương mến.\n\nChúc bạn mỗi ngày đều ngập tràn niềm vui, luôn rạng rỡ theo cách riêng.\n\nCảm ơn bạn vì đã luôn mang đến những điều dịu dàng và ấm áp nhất!',

    // Lời ký tên ở cuối thư
    sender: (cfg && cfg.sender) ? cfg.sender : 'Người gửi'
  };

  const dialog = document.getElementById('greetingCard');
  const openButton = document.getElementById('openCard');
  const closeButton = document.getElementById('closeCard');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopLayout = window.matchMedia('(min-width: 1100px)');
  const sceneElements = [...document.querySelectorAll('.bouquet-composition, .scene-footer')];
  const layoutAnimations = new Set();

  /**
   * Hoạt ảnh FLIP (First, Last, Invert, Play)
   * Dịch chuyển và co giãn mượt mà giữa bó hoa và thiệp khi mở/đóng
   */
  function reflowScene(changeLayout) {
    layoutAnimations.forEach(animation => animation.cancel());
    layoutAnimations.clear();
    const before = sceneElements.map(element => {
      const rect = element.getBoundingClientRect();
      return { left: rect.left + window.scrollX, top: rect.top + window.scrollY, width: rect.width, height: rect.height };
    });
    changeLayout();
    if (motion.matches) return;
    sceneElements.forEach((element, index) => {
      const after = element.getBoundingClientRect();
      if (!after.width || !after.height) return;
      const dx = before[index].left - after.left - window.scrollX;
      const dy = before[index].top - after.top - window.scrollY;
      const scale = element.matches('.bouquet-composition')
        ? ` scale(${before[index].width / after.width}, ${before[index].height / after.height})` : '';
      const animation = element.animate([
        { transform: `translate(${dx}px, ${dy}px)${scale}` },
        { transform: 'none' }
      ], { duration: 600, easing: 'cubic-bezier(.2,.8,.2,1)' });
      layoutAnimations.add(animation);
      animation.onfinish = () => layoutAnimations.delete(animation);
    });
  }

  /**
   * Tự động cuộn trang êm ái đưa tấm thiệp vào chính giữa tầm mắt
   */
  function revealCard() {
    const rect = dialog.getBoundingClientRect();
    if (!desktopLayout.matches || rect.top < 16 || rect.top > window.innerHeight * 0.35 || rect.bottom > window.innerHeight - 16) {
      dialog.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'start' });
    }
  }

  /**
   * Bật/tắt trạng thái mở thiệp, cập nhật accessibility và phát sự kiện chúc mừng
   */
  function setCardOpen(open) {
    if (dialog.open === open) return;
    reflowScene(() => {
      if (open) {
        document.body.classList.add('card-open');
        dialog.show();
      } else {
        dialog.close();
        document.body.classList.remove('card-open');
      }
      openButton.setAttribute('aria-expanded', String(open));
      openButton.querySelector('.envelope-action').textContent = open ? 'Gấp thiệp' : 'Mở thiệp';
    });
    if (open) {
      closeButton.focus({ preventScroll: true });
      revealCard();
      document.dispatchEvent(new Event('bouquet:celebrate'));
    } else {
      openButton.focus({ preventScroll: true });
      const rect = openButton.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        openButton.scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth', block: 'center' });
      }
    }
  }

  motion.addEventListener('change', () => {
    if (motion.matches) {
      layoutAnimations.forEach(animation => animation.cancel());
      layoutAnimations.clear();
    }
  });

  /**
   * Nạp nội dung người nhận, tiêu đề, đoạn văn lời chúc và chữ ký vào thiệp
   */
  function renderGreeting() {
    const recipientEl = document.getElementById('cardRecipient');
    if (recipientEl) recipientEl.textContent = greeting.recipient;

    const titleEl = document.getElementById('cardTitle');
    if (titleEl && greeting.title) {
      titleEl.innerHTML = greeting.title.replace(/\n/g, '<br>');
    }

    const messageEl = document.getElementById('cardMessage');
    if (messageEl) {
      const paragraphs = greeting.message.split(/\n\s*\n/).map(text => {
        const paragraph = document.createElement('span');
        paragraph.className = 'message-paragraph';
        paragraph.textContent = text;
        return paragraph;
      });
      messageEl.replaceChildren(...paragraphs);
    }

    const senderEl = document.getElementById('cardSender');
    if (senderEl) senderEl.textContent = greeting.sender;
  }

  document.addEventListener('bouquet:ready', () => { openButton.hidden = false; });
  document.addEventListener('bouquet:rose', event => {
    const wish = document.getElementById('roseWish');
    if (!wish) return;
    wish.classList.remove('is-new');
    wish.textContent = event.detail.message;
    void wish.offsetWidth;
    wish.classList.add('is-new');
  });
  document.getElementById('replayBloom').addEventListener('click', () => {
    document.dispatchEvent(new Event('bouquet:replay'));
    const wish = document.getElementById('roseWish');
    if (wish) wish.textContent = '';
  });

  openButton.addEventListener('click', () => setCardOpen(!dialog.open));
  closeButton.addEventListener('click', () => setCardOpen(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open && !event.defaultPrevented) {
      event.preventDefault();
      setCardOpen(false);
    }
  });
  dialog.addEventListener('close', () => {
    if (dialog.open || !document.body.classList.contains('card-open')) return;
    document.body.classList.remove('card-open');
    openButton.setAttribute('aria-expanded', 'false');
    openButton.querySelector('.envelope-action').textContent = 'Mở thiệp';
  });

  renderGreeting();
})();
