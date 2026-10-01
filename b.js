document.addEventListener('DOMContentLoaded', () => {
  initCart();
  initFormValidation();
  initBackToTopButton();
  initGalleryModal();
  setupSmoothScrollFix();
  initPremiumMotion();
});

function initCart() {
  const cartDrawerHtml = `
    <aside id="cart-drawer" class="cart-drawer" aria-label="Shopping cart">
      <div class="cart-drawer__header">
        <div class="cart-drawer__title-group">
          <p class="cart-drawer__kicker">Your selection</p>
          <h3>Shopping Bag</h3>
        </div>
        <button id="close-cart-btn" class="close-cart-btn" type="button" aria-label="Close cart">
          <span class="close-icon">&times;</span>
        </button>
      </div>
      <div id="cart-items-container" class="cart-items-container"></div>
      <div class="cart-drawer__footer">
        <div class="cart-drawer__summary">
          <div class="cart-summary-row cart-summary-row--subtotal">
            <span>Subtotal</span>
            <span id="cart-total-price">Ksh 0</span>
          </div>
          <p class="cart-drawer__note">Bespoke orders require 3–7 days notice</p>
        </div>
        <button id="checkout-btn" class="button button--cart-submit" type="button">
          <span class="btn-arrow">&#8594;</span>
          <span class="btn-text">Proceed to checkout</span>
        </button>
      </div>
    </aside>
    <div id="cart-overlay" class="cart-overlay" aria-hidden="true"></div>
  `;

  document.body.insertAdjacentHTML('beforeend', cartDrawerHtml);

  const cartStyles = `
    .cart-overlay {
      position: fixed;
      inset: 0;
      background: rgba(30, 24, 22, 0.45);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
                  visibility 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      z-index: 55;
    }

    .cart-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    .cart-drawer {
      position: fixed;
      top: 0;
      right: -460px;
      width: min(460px, 100%);
      height: 100vh;
      background: rgba(255, 253, 251, 0.92);
      backdrop-filter: blur(24px) saturate(1.2);
      -webkit-backdrop-filter: blur(24px) saturate(1.2);
      border-left: 1px solid rgba(201, 168, 106, 0.25);
      box-shadow: -24px 0 64px rgba(38, 29, 23, 0.15),
                  -4px 0 24px rgba(38, 29, 23, 0.06);
      z-index: 60;
      transition: right 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      display: flex;
      flex-direction: column;
    }

    .cart-drawer.open {
      right: 0;
    }

    .cart-drawer__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 28px 28px 24px;
      border-bottom: 1px solid rgba(201, 168, 106, 0.2);
      background: linear-gradient(180deg, rgba(255, 253, 251, 0.98) 0%, rgba(255, 253, 251, 0.88) 100%);
      position: relative;
    }

    .cart-drawer__header::after {
      content: "";
      position: absolute;
      bottom: -1px;
      left: 28px;
      right: 28px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(201, 168, 106, 0.5), transparent);
    }

    .cart-drawer__title-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .cart-drawer__kicker {
      font-family: var(--sans);
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--gold-soft);
      margin: 0;
    }

    .cart-drawer__header h3 {
      font-family: var(--serif);
      font-size: clamp(1.8rem, 2vw, 2.4rem);
      font-weight: 600;
      letter-spacing: -0.01em;
      color: var(--espresso);
      line-height: 1;
      margin: 0;
    }

    .close-cart-btn {
      position: relative;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid rgba(201, 168, 106, 0.3);
      background: rgba(255, 255, 255, 0.6);
      color: var(--espresso);
      font-size: 1.8rem;
      line-height: 1;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .close-cart-btn:hover {
      background: var(--espresso);
      border-color: var(--espresso);
      color: var(--paper);
      transform: rotate(90deg);
      box-shadow: 0 8px 24px rgba(42, 32, 29, 0.2);
    }

    .close-icon {
      display: block;
      line-height: 1;
      font-weight: 300;
    }

    .cart-items-container {
      flex: 1;
      overflow-y: auto;
      padding: 28px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .cart-empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px 28px;
      gap: 16px;
    }

    .cart-empty__icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(201, 168, 106, 0.1) 0%, rgba(201, 168, 106, 0.05) 100%);
      border: 1px solid rgba(201, 168, 106, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: var(--gold);
      margin-bottom: 8px;
    }

    .cart-empty__title {
      font-family: var(--serif);
      font-size: 1.6rem;
      font-weight: 600;
      color: var(--espresso);
      margin: 0;
      letter-spacing: -0.01em;
    }

    .cart-empty__text {
      font-size: 0.85rem;
      color: var(--muted);
      line-height: 1.6;
      max-width: 260px;
      margin: 0;
    }

    .cart-item {
      position: relative;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: start;
      padding: 20px;
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid rgba(201, 168, 106, 0.15);
      border-radius: 18px;
      transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
      animation: cartItemSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      opacity: 0;
      transform: translateX(20px);
    }

    @keyframes cartItemSlideIn {
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .cart-item:hover {
      background: rgba(255, 255, 255, 0.75);
      border-color: rgba(201, 168, 106, 0.35);
      box-shadow: 0 8px 24px rgba(38, 29, 23, 0.06);
      transform: translateY(-2px);
    }

    .cart-item.removing {
      animation: cartItemSlideOut 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    @keyframes cartItemSlideOut {
      to {
        opacity: 0;
        transform: translateX(30px) scale(0.95);
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        margin: 0;
        border-width: 0;
      }
    }

    .cart-item-details {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .cart-item-name {
      font-family: var(--serif);
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--espresso);
      line-height: 1.2;
      letter-spacing: -0.01em;
    }

    .cart-item-price {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--terracotta-deep);
    }

    .cart-item-qty {
      font-size: 0.72rem;
      color: var(--muted);
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    .remove-item-btn {
      align-self: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid rgba(201, 168, 106, 0.3);
      background: rgba(255, 255, 255, 0.5);
      color: var(--muted);
      font-size: 1.2rem;
      line-height: 1;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
    }

    .remove-item-btn:hover {
      background: #c0392b;
      border-color: #c0392b;
      color: #fff;
      box-shadow: 0 6px 16px rgba(192, 57, 43, 0.25);
      transform: scale(1.1);
    }

    .cart-drawer__footer {
      padding: 24px 28px 28px;
      border-top: 1px solid rgba(201, 168, 106, 0.2);
      background: linear-gradient(180deg, rgba(255, 253, 251, 0.88) 0%, rgba(255, 253, 251, 0.96) 100%);
      position: relative;
    }

    .cart-drawer__footer::before {
      content: "";
      position: absolute;
      top: 0;
      left: 28px;
      right: 28px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(201, 168, 106, 0.5), transparent);
    }

    .cart-drawer__summary {
      margin-bottom: 18px;
    }

    .cart-summary-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--espresso-soft);
      font-weight: 600;
    }

    .cart-summary-row--subtotal span:last-child {
      font-family: var(--serif);
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--espresso);
      letter-spacing: -0.01em;
    }

    .cart-drawer__note {
      font-size: 0.72rem;
      color: var(--muted);
      font-style: italic;
      margin: 10px 0 0;
      letter-spacing: 0.02em;
    }

    .button--cart-submit {
      width: 100%;
      min-height: 56px;
      background: var(--espresso);
      color: var(--paper);
      border: 1px solid transparent;
      border-radius: 999px;
      padding: 0 28px;
      font-family: var(--sans);
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: 0 14px 28px rgba(42, 32, 29, 0.15);
      transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .button--cart-submit::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(201, 168, 106, 0.15) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .button--cart-submit:hover {
      background: var(--terracotta-deep);
      box-shadow: 0 18px 36px rgba(141, 77, 47, 0.25);
      transform: translateY(-2px);
    }

    .button--cart-submit:hover::before {
      opacity: 1;
    }

    .btn-arrow {
      display: inline-block;
      transition: transform 0.3s ease;
      font-size: 1.1rem;
      line-height: 1;
    }

    .button--cart-submit:hover .btn-arrow {
      transform: translateX(4px);
    }

    .btn-text {
      position: relative;
      z-index: 1;
    }

    .view-cart-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      position: relative;
      transition: gap 0.3s ease;
    }

    .view-cart-link:hover {
      gap: 12px;
    }

    .cart-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      height: 22px;
      padding: 0 7px;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: var(--paper);
      background: linear-gradient(135deg, #d4af37 0%, #9a6a1c 100%);
      border-radius: 999px;
      line-height: 1;
      box-shadow: 0 2px 8px rgba(201, 168, 106, 0.35);
      transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .cart-count.pulse {
      animation: badgePulse 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    }

    @keyframes badgePulse {
      0% { transform: scale(1); }
      40% { transform: scale(1.35); }
      100% { transform: scale(1); }
    }

    @media (max-width: 560px) {
      .cart-drawer {
        width: 100%;
      }

      .cart-drawer__header {
        padding: 24px 20px 20px;
      }

      .cart-items-container {
        padding: 20px;
        gap: 12px;
      }

      .cart-item {
        padding: 16px;
      }

      .cart-drawer__footer {
        padding: 20px 20px 24px;
      }
    }
  `;

  const style = document.createElement('style');
  style.textContent = cartStyles + `
    .cart-drawer {
      right: 0;
      transform: translate3d(105%, 0, 0);
      transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      background: rgba(251, 247, 239, 0.91);
      border-left-color: rgba(189, 135, 66, 0.32);
      box-shadow: -22px 0 60px rgba(31, 24, 19, 0.18);
    }
    .cart-drawer.open { right: 0; transform: translate3d(0, 0, 0); }
    .cart-drawer__header, .cart-drawer__footer {
      background: rgba(251, 247, 239, 0.72);
      border-color: rgba(88, 71, 61, 0.14);
      backdrop-filter: blur(18px);
    }
    .cart-drawer__kicker { color: #814225; }
    .cart-empty__title, .cart-item-name, .cart-drawer__header h3 { color: #30221b; }
    .cart-item { background: rgba(255, 253, 248, 0.72); border-color: rgba(88, 71, 61, 0.14); }
    .button--cart-submit { background: #30221b; }
    .cart-count { background: linear-gradient(135deg, #bd8742, #814225); }
    @media (prefers-reduced-motion: reduce) {
      .cart-drawer, .cart-overlay, .cart-item { transition-duration: .01ms !important; animation-duration: .01ms !important; }
    }
  `;
  document.head.appendChild(style);

  let cart = JSON.parse(localStorage.getItem('luxury_cart')) || [];

  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const checkoutBtn = document.getElementById('checkout-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const viewCartLink = document.querySelector('.view-cart-link');
  const cartBadge = document.querySelector('.cart-count');

  const openCart = (event) => {
    if (event) event.preventDefault();
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (viewCartLink) viewCartLink.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
  });

  const renderCart = () => {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty__icon">&#10084;</div>
          <p class="cart-empty__title">Your bag is empty</p>
          <p class="cart-empty__text">Discover our signature collection and add a touch of elegance to your celebration.</p>
        </div>
      `;
    } else {
      cart.forEach((item, index) => {
        total += Number(item.price || 0);
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';
        itemRow.style.animationDelay = `${index * 0.06}s`;
        itemRow.innerHTML = `
          <div class="cart-item-details">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">Ksh ${Number(item.price).toLocaleString()}</span>
          </div>
          <button class="remove-item-btn" data-index="${index}" type="button" aria-label="Remove ${item.name}">&times;</button>
        `;
        cartItemsContainer.appendChild(itemRow);
      });
    }

    cartTotalPrice.textContent = `Ksh ${total.toLocaleString()}`;
    if (cartBadge) {
      cartBadge.textContent = cart.length;
      cartBadge.classList.remove('pulse');
      void cartBadge.offsetWidth;
      cartBadge.classList.add('pulse');
    }
    localStorage.setItem('luxury_cart', JSON.stringify(cart));
  };

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.cake-card');
      const name = card.querySelector('h4').textContent.trim();
      const priceText = card.querySelector('.price').textContent.trim();
      const parsedPrice = Number(priceText.replace(/[^0-9]/g, ''));

      cart.push({ name, price: parsedPrice });
      animateCartFlight(button);
      renderCart();
      openCart();
    });
  });

  cartItemsContainer.addEventListener('click', (event) => {
    const removeButton = event.target.closest('.remove-item-btn');
    if (!removeButton) return;

    const itemRow = removeButton.closest('.cart-item');
    if (itemRow) {
      itemRow.classList.add('removing');
      itemRow.addEventListener('animationend', () => {
        const index = Number(removeButton.dataset.index);
        cart.splice(index, 1);
        renderCart();
      }, { once: true });
    } else {
      const index = Number(removeButton.dataset.index);
      cart.splice(index, 1);
      renderCart();
    }
  });

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Your bag is empty. Add a cake from our collection first.');
      return;
    }

    alert('Thank you for choosing Rehema\'s Exquisite Cakes. Our team will be in touch shortly.');
    cart = [];
    renderCart();
    closeCart();
  });

  renderCart();
}

function initGalleryModal() {
  const modal = document.getElementById('imageModal');
  if (!modal) return;

  const modalGallery = document.getElementById('modalGallery');
  const closeButton = document.querySelector('.modal__close');

  document.querySelectorAll('.view-more-btn').forEach((button) => {
    button.addEventListener('click', () => {
      let imageList = [];

      try {
        imageList = JSON.parse(button.getAttribute('data-images') || '[]');
      } catch (error) {
        console.warn('Unable to parse gallery images:', error);
      }

      modalGallery.innerHTML = imageList
        .map((src) => `<img src="${src}" alt="Cake detail" />`)
        .join('');

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

function initFormValidation() {
  const form = document.querySelector('.inquiry-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('.button--submit');
    const buttonText = form.querySelector('.btn-text');
    const originalText = buttonText ? buttonText.textContent : submitButton.textContent;

    submitButton.disabled = true;
    buttonText.textContent = 'Request received';
    submitButton.style.opacity = '0.92';
    form.reset();

    setTimeout(() => {
      submitButton.disabled = false;
      buttonText.textContent = originalText;
      submitButton.style.opacity = '1';
      alert('Your custom inquiry has been received. Rehema\'s team will respond within 24 hours.');
    }, 1800);
  });
}

function initBackToTopButton() {
  const backToTopBtn = document.createElement('button');
  backToTopBtn.type = 'button';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  backToTopBtn.innerHTML = '&#8593;';
  document.body.appendChild(backToTopBtn);

  let scrollFrame = 0;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      backToTopBtn.classList.toggle('visible', window.scrollY > 300);
      const hero = document.querySelector('.hero__showcase');
      if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        hero.style.setProperty('--hero-parallax', `${Math.min(window.scrollY * 0.055, 48)}px`);
      }
      scrollFrame = 0;
    });
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setupSmoothScrollFix() {
  const links = document.querySelectorAll('.main-nav a, .hero__actions a');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

function initPremiumMotion() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.cake-card').forEach((card) => {
    const productName = card.querySelector('h4')?.textContent.trim() || '';
    const category = /wedding/i.test(productName)
      ? 'Wedding'
      : /kiddies|boys to men|grad cap|strawberry|crimson velvet|agrabah/i.test(productName)
        ? 'Birthday'
        : 'Special Occasions';
    const label = document.createElement('span');
    label.className = 'cake-category';
    label.textContent = category;
    card.querySelector('.cake-card__body')?.prepend(label);
  });

  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    document.querySelectorAll('.story__copy, .story__panel, .feature-layout, .section-heading, .chapter-header, .cake-card, .inquiry__copy, .inquiry-form')
      .forEach((element, index) => {
        element.dataset.reveal = '';
        element.dataset.delay = String(index % 4);
        revealObserver.observe(element);
      });
    document.documentElement.classList.add('reveal-ready');
  }

  if (reducedMotion || window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  document.querySelectorAll('.button').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const bounds = button.getBoundingClientRect();
      button.style.setProperty('--magnet-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 5}px`);
      button.style.setProperty('--magnet-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * 4}px`);
    });
    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--magnet-x', '0px');
      button.style.setProperty('--magnet-y', '0px');
    });
  });

  document.querySelectorAll('.cake-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty('--tilt-y', `${(x - 0.5) * 7}deg`);
      card.style.setProperty('--tilt-x', `${(0.5 - y) * 6}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-y', '0deg');
      card.style.setProperty('--tilt-x', '0deg');
    });
  });
}

function animateCartFlight(button) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const badge = document.querySelector('.cart-count');
  if (!badge) return;
  const from = button.getBoundingClientRect();
  const to = badge.getBoundingClientRect();
  const flight = document.createElement('span');
  flight.className = 'fly-to-cart';
  flight.style.setProperty('--fly-x', `${from.left + from.width / 2}px`);
  flight.style.setProperty('--fly-y', `${from.top + from.height / 2}px`);
  flight.style.setProperty('--fly-to-x', `${to.left + to.width / 2 - from.left - from.width / 2}px`);
  flight.style.setProperty('--fly-to-y', `${to.top + to.height / 2 - from.top - from.height / 2}px`);
  document.body.appendChild(flight);
  flight.addEventListener('animationend', () => flight.remove(), { once: true });
}

