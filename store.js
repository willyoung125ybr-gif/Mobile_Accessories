/**
 * AURA Studio - Atelier Tech Luxe Interactive Commerce Engine
 * Complete interactive state, cart management, wishlist, currency, search, filters & checkout.
 */

// Initialize default state
const AURA = {
  currency: {
    code: localStorage.getItem('aura_currency') || 'USD',
    symbol: '$',
    rate: 1.0,
    rates: {
      USD: { symbol: '$', rate: 1.0 },
      EUR: { symbol: '€', rate: 0.92 },
      GBP: { symbol: '£', rate: 0.79 },
      CAD: { symbol: 'CA$', rate: 1.35 }
    }
  },

  cart: JSON.parse(localStorage.getItem('aura_cart') || 'null') || [
    {
      id: 'armorshield-pro',
      title: 'AURA ArmorShield Pro MagSafe',
      series: 'Series Armor / Aerospace',
      price: 48.00,
      color: 'Titanium Graphite',
      model: 'iPhone 16 Pro',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5FHVsvEE_3PerhU4MwZ1z6BYNj3WwvyFEA3N7EEl_BhjPZU57TGykmaQ3X2CuB1jylwtvG1MVTjonvocugLLbqblewjTBRU8viLAbTsKavLFi1p0eSuWdDY4t15dWUuOP2GXvKoDtI0ORnu79mHaJlCqDH449zYUgLwiMNnTCTFtSVv9cvXMh5yir3vpLTrPoBezbmtPar25ac836twgewGrT-RNgTiOAmBYKdgbE',
      qty: 1
    },
    {
      id: 'magsafe-wallet',
      title: 'Neodymium MagSafe Card Wallet',
      series: 'Ecosystem / Magnetic Accessories',
      price: 32.00,
      color: 'Matte Obsidian',
      model: 'Universal MagSafe',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaJqVoRiPKRmC4G-jAp24xLsjfFdhaeYvWp3WtJAMVN6NArbExMUCGFZ8GUzZYB7HIjcH378Ca62td8EM_4iptyICxRk1nQ4Ssbs_qaxJ8fZCFkrrTRENbTAfOFOhoWW7r6iEl9HTPpgXqs5xOliWELZeUt5UTnEul9Wod6006xxZxR4Wox29BkkmuieDRqMUEVfz4VaOqBzg0PkjCGlsY5rS17D6vtO50cIYkFANH',
      qty: 1
    }
  ],

  wishlist: JSON.parse(localStorage.getItem('aura_wishlist') || '["armorshield-pro", "aeroshield-pro"]'),
  promoCode: localStorage.getItem('aura_promo') || null,
  discountPercent: localStorage.getItem('aura_promo') ? 15 : 0
};

// Save Cart to storage
function saveCart() {
  localStorage.setItem('aura_cart', JSON.stringify(AURA.cart));
  updateBadges();
  renderCartPage();
}

// Save Wishlist
function saveWishlist() {
  localStorage.setItem('aura_wishlist', JSON.stringify(AURA.wishlist));
  updateBadges();
}

// Format Price with active currency
function formatPrice(amountUSD) {
  const cur = AURA.currency.rates[AURA.currency.code] || AURA.currency.rates.USD;
  const converted = (amountUSD * cur.rate).toFixed(2);
  return `${cur.symbol}${converted}`;
}

// Add Item to Cart
function addToCart(product) {
  const existing = AURA.cart.find(item => item.id === product.id && item.model === product.model && item.color === product.color);
  if (existing) {
    existing.qty += (product.qty || 1);
  } else {
    AURA.cart.push({
      id: product.id || 'prod-' + Date.now(),
      title: product.title || 'AURA Engineered Case',
      series: product.series || 'Series Armor / Studio',
      price: parseFloat(product.price) || 48.00,
      color: product.color || 'Matte Obsidian',
      model: product.model || 'iPhone 16 Pro',
      image: product.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVzJoMiguoKsq1dmgYveE3VanmdEZqom9O8AaTrAr6rX1IHsVLJ5ljCHmdBf-rysz-DSPL9RamdIR5VytCeQmJDOIj590JUI9CYSxMnojaCX84iXGSeNT2gUQAfmAetuTp-ts1bwIqAhr2yH3nTcSmuYYzj60Y8gBq-1WD4b5zHBV4tjn1jcEbVI9LBqMCfeUiywxSzkRK-JOm3l5zQeytHLZdNI6K2FAbVYxlOSrK',
      qty: product.qty || 1
    });
  }
  saveCart();
  showToast(`Added "${product.title}" to your Shopping Bag!`, 'cart');
}

// Toast notification
function showToast(message, iconType = 'check') {
  const old = document.getElementById('aura-toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.id = 'aura-toast';
  toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999] bg-[#0d0d11] text-white px-5 py-3 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-3 border border-white/20 transition-all duration-300 opacity-0 translate-y-3';
  
  const icon = iconType === 'cart' ? 'shopping_bag' : 'check_circle';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[18px] text-emerald-400">${icon}</span>
    <span>${message}</span>
    <a href="cart.html" class="underline hover:text-emerald-300 ml-2">View Bag &rarr;</a>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-3');
  });
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-3');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

// Update Badges
function updateBadges() {
  const totalItems = AURA.cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('[data-path="cart"] span.font-label-badge, .cart-counter-badge').forEach(el => {
    el.textContent = totalItems;
  });

  const wishlistCount = AURA.wishlist.length;
  document.querySelectorAll('[data-path="wishlist"] span.font-label-badge, .wishlist-counter-badge').forEach(el => {
    el.textContent = wishlistCount;
  });
}

// Render dynamic cart on cart.html
function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  const subtotalEl = document.getElementById('cart-subtotal');
  const discountEl = document.getElementById('cart-discount');
  const totalEl = document.getElementById('cart-total');
  const shippingBarEl = document.getElementById('shipping-bar-fill');
  const shippingTextEl = document.getElementById('shipping-status-text');
  const emptyStateEl = document.getElementById('cart-empty-state');
  const itemCountEl = document.getElementById('cart-header-count');

  if (AURA.cart.length === 0) {
    if (emptyStateEl) emptyStateEl.classList.remove('hidden');
    container.innerHTML = `
      <div class="bg-surface-container-lowest p-12 rounded-2xl text-center space-y-4 border border-outline-variant/30">
        <span class="material-symbols-outlined text-5xl text-on-surface-variant">shopping_bag</span>
        <h3 class="text-xl font-bold text-on-surface">Your Shopping Bag is empty</h3>
        <p class="text-on-surface-variant text-sm max-w-sm mx-auto">Explore our aerospace-grade drop protection collection and find your perfect case.</p>
        <a href="shop.html" class="inline-flex items-center gap-2 px-8 py-3 bg-primary text-on-primary rounded-full font-semibold text-sm hover:bg-neutral-800 transition-colors">
          Explore Collection &rarr;
        </a>
      </div>
    `;
    if (itemCountEl) itemCountEl.textContent = '(0 Items)';
    if (subtotalEl) subtotalEl.textContent = formatPrice(0);
    if (totalEl) totalEl.textContent = formatPrice(0);
    if (shippingBarEl) shippingBarEl.style.width = '0%';
    if (shippingTextEl) shippingTextEl.innerHTML = 'Add items to qualify for Free Express Shipping';
    return;
  }

  if (emptyStateEl) emptyStateEl.classList.add('hidden');
  const totalQty = AURA.cart.reduce((s, i) => s + i.qty, 0);
  if (itemCountEl) itemCountEl.textContent = `(${totalQty} Item${totalQty > 1 ? 's' : ''})`;

  // Render items
  container.innerHTML = AURA.cart.map((item, index) => `
    <div class="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 transition-all hover:shadow-md mb-4" data-index="${index}">
      <div class="flex flex-col sm:flex-row gap-space-lg">
        <div class="relative w-full sm:w-36 h-36 bg-surface-container-low rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-2">
          <img class="w-full h-full object-contain" src="${item.image}" alt="${item.title}">
          <span class="absolute top-2 left-2 font-label-badge text-[9px] bg-primary text-on-primary px-2 py-0.5 rounded-full uppercase tracking-wider">In Stock</span>
        </div>
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-space-md">
              <div>
                <span class="font-label-mono-spec text-[11px] text-secondary uppercase tracking-wider block">${item.series}</span>
                <h2 class="font-headline-md text-headline-sm sm:text-headline-md text-on-surface tracking-tight">${item.title}</h2>
              </div>
              <span class="font-price-lg text-price-lg text-on-surface font-bold">${formatPrice(item.price * item.qty)}</span>
            </div>
            <div class="mt-space-xs flex flex-wrap items-center gap-space-md text-secondary font-body-sm text-body-sm">
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-white"></span>
                ${item.color}
              </span>
              <span>•</span>
              <span>${item.model}</span>
              <span>•</span>
              <span class="text-emerald-600 font-medium">Ready to Ship</span>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-space-md pt-space-md mt-space-md bg-surface-container-low/40 p-2.5 rounded-lg">
            <div class="flex items-center gap-space-xs">
              <span class="font-label-badge text-label-badge text-secondary uppercase mr-1">Qty</span>
              <div class="flex items-center bg-surface-container-lowest rounded-full p-1 shadow-sm border border-outline-variant/30">
                <button onclick="changeQty(${index}, -1)" aria-label="Decrease" class="w-7 h-7 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors">
                  <span class="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span class="w-8 text-center font-price-md text-price-md text-on-surface font-semibold">${item.qty}</span>
                <button onclick="changeQty(${index}, 1)" aria-label="Increase" class="w-7 h-7 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors">
                  <span class="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
            </div>
            <button onclick="removeCartItem(${index})" class="flex items-center gap-1 font-body-sm text-secondary hover:text-red-600 transition-colors text-xs">
              <span class="material-symbols-outlined text-[16px]">delete</span>
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Calculations
  const rawSubtotal = AURA.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = rawSubtotal * (AURA.discountPercent / 100);
  const finalSubtotal = rawSubtotal - discountAmount;
  const isFreeShipping = rawSubtotal >= 60;
  const shippingAmount = isFreeShipping ? 0 : 9.00;
  const estTax = finalSubtotal * 0.0825;
  const grandTotal = finalSubtotal + shippingAmount + estTax;

  if (subtotalEl) subtotalEl.textContent = formatPrice(rawSubtotal);
  if (discountEl) discountEl.textContent = `-${formatPrice(discountAmount)}`;
  if (totalEl) totalEl.textContent = formatPrice(grandTotal);

  // Free shipping progress
  const target = 60;
  const pct = Math.min(100, Math.round((rawSubtotal / target) * 100));
  if (shippingBarEl) shippingBarEl.style.width = `${pct}%`;

  if (shippingTextEl) {
    if (isFreeShipping) {
      shippingTextEl.innerHTML = `<span class="text-emerald-700 font-bold">🎉 Congratulations! You have unlocked Free Worldwide Express Shipping!</span>`;
    } else {
      const remaining = (target - rawSubtotal).toFixed(2);
      shippingTextEl.innerHTML = `You are <span class="text-primary font-bold underline decoration-2 underline-offset-2">$${remaining} away</span> from Free Worldwide Express Shipping`;
    }
  }
}

// Global Quantity Stepper
window.changeQty = function(index, delta) {
  if (AURA.cart[index]) {
    AURA.cart[index].qty += delta;
    if (AURA.cart[index].qty <= 0) {
      AURA.cart.splice(index, 1);
    }
    saveCart();
  }
};

// Global Remove item
window.removeCartItem = function(index) {
  if (AURA.cart[index]) {
    const title = AURA.cart[index].title;
    AURA.cart.splice(index, 1);
    saveCart();
    showToast(`Removed "${title}" from bag.`);
  }
};

// Apply Promo Code
window.applyPromoCode = function() {
  const input = document.getElementById('promo-input');
  const msg = document.getElementById('promo-msg');
  if (!input) return;

  const val = input.value.trim().toUpperCase();
  if (val === 'AURA15' || val === 'WELCOME15' || val === 'VIP15') {
    AURA.promoCode = val;
    AURA.discountPercent = 15;
    localStorage.setItem('aura_promo', val);
    if (msg) {
      msg.textContent = `Promo code "${val}" applied! 15% discount active.`;
      msg.className = 'text-xs text-emerald-600 font-semibold mt-1 block';
    }
    renderCartPage();
    showToast(`15% discount code "${val}" applied!`);
  } else {
    if (msg) {
      msg.textContent = 'Invalid promo code. Try AURA15 for 15% off.';
      msg.className = 'text-xs text-red-600 font-semibold mt-1 block';
    }
  }
};

// Checkout modal trigger
window.triggerCheckoutModal = function(type = 'standard') {
  const modal = document.createElement('div');
  modal.id = 'checkout-modal';
  modal.className = 'fixed inset-0 z-[999999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';
  
  const grandTotal = document.getElementById('cart-total') ? document.getElementById('cart-total').textContent : '$88.00';
  
  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 relative border border-outline-variant/30 animate-in fade-in zoom-in-95 duration-200">
      <button onclick="document.getElementById('checkout-modal').remove()" class="absolute top-5 right-5 text-zinc-400 hover:text-black">
        <span class="material-symbols-outlined text-2xl">close</span>
      </button>

      <div class="text-center space-y-2">
        <span class="material-symbols-outlined text-4xl text-primary">verified_user</span>
        <h3 class="text-2xl font-bold tracking-tight text-on-surface">Secure Express Checkout</h3>
        <p class="text-xs text-on-surface-variant uppercase tracking-wider">256-Bit Encrypted • Total Due: <strong class="text-primary text-sm">${grandTotal}</strong></p>
      </div>

      <form id="checkout-form" onsubmit="event.preventDefault(); completeOrder();" class="space-y-4 text-xs">
        <div>
          <label class="block font-semibold mb-1 text-on-surface">Shipping Address</label>
          <input type="text" required placeholder="Full Name" class="w-full px-3 py-2.5 rounded-lg border border-outline-variant/60 focus:outline-none focus:border-primary mb-2 text-sm">
          <input type="email" required placeholder="Email Address for Tracking" class="w-full px-3 py-2.5 rounded-lg border border-outline-variant/60 focus:outline-none focus:border-primary mb-2 text-sm">
          <input type="text" required placeholder="Street Address" class="w-full px-3 py-2.5 rounded-lg border border-outline-variant/60 focus:outline-none focus:border-primary mb-2 text-sm">
          <div class="grid grid-cols-2 gap-2">
            <input type="text" required placeholder="City" class="w-full px-3 py-2.5 rounded-lg border border-outline-variant/60 focus:outline-none focus:border-primary text-sm">
            <input type="text" required placeholder="Postal Code" class="w-full px-3 py-2.5 rounded-lg border border-outline-variant/60 focus:outline-none focus:border-primary text-sm">
          </div>
        </div>

        <div>
          <label class="block font-semibold mb-1 text-on-surface">Payment Method</label>
          <div class="p-3 bg-surface-container rounded-lg flex items-center justify-between border border-outline-variant/40">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">credit_card</span>
              <span class="font-medium text-sm">Credit / Debit Card or Apple Pay</span>
            </div>
            <span class="text-[10px] bg-white px-2 py-0.5 rounded font-mono font-bold">SECURE</span>
          </div>
        </div>

        <button type="submit" id="btn-pay-now" class="w-full py-4 rounded-full bg-primary text-white font-bold text-sm tracking-wide uppercase hover:bg-neutral-800 transition-colors shadow-lg">
          Complete Purchase (${grandTotal})
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
};

// Complete Order Simulation
window.completeOrder = function() {
  const form = document.getElementById('checkout-form');
  const btn = document.getElementById('btn-pay-now');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin inline-block mr-2">refresh</span> Processing Payment...';
  }
  
  setTimeout(() => {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl text-center space-y-4">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-3xl">check</span>
          </div>
          <h3 class="text-2xl font-bold text-on-surface">Order Confirmed!</h3>
          <p class="text-sm text-on-surface-variant">Order #AURA-849204 has been placed. A confirmation email and tracking link have been dispatched.</p>
          <div class="p-4 bg-surface-container rounded-xl text-xs text-left space-y-1">
            <div class="flex justify-between"><span>Status:</span><strong class="text-emerald-700">Payment Authorized</strong></div>
            <div class="flex justify-between"><span>Delivery:</span><strong>2-3 Business Days</strong></div>
          </div>
          <button onclick="AURA.cart = []; saveCart(); document.getElementById('checkout-modal').remove(); window.location.href = 'index.html';" class="w-full py-3 bg-primary text-white rounded-full font-bold text-xs uppercase hover:bg-neutral-800 transition-colors">
            Return to Homepage
          </button>
        </div>
      `;
    }
  }, 1200);
};

// Wishlist Toggle
window.toggleWishlist = function(productId, btn) {
  const idx = AURA.wishlist.indexOf(productId);
  if (idx > -1) {
    AURA.wishlist.splice(idx, 1);
    showToast('Removed from Wishlist');
  } else {
    AURA.wishlist.push(productId);
    showToast('Saved to Wishlist ❤️');
  }
  saveWishlist();

  if (btn) {
    const icon = btn.querySelector('.material-symbols-outlined');
    if (icon) {
      const active = AURA.wishlist.includes(productId);
      icon.style.fontVariationSettings = active ? "'FILL' 1" : "'FILL' 0";
      icon.classList.toggle('text-red-500', active);
    }
  }
};

// Currency Dropdown
window.changeCurrency = function(code) {
  AURA.currency.code = code;
  localStorage.setItem('aura_currency', code);
  location.reload();
};

// Document Interactive Setup
document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  renderCartPage();

  // 1. Hook up all data-path links smoothly
  document.querySelectorAll('a[data-path]').forEach(link => {
    const path = link.getAttribute('data-path');
    if (path === 'home') link.setAttribute('href', 'index.html');
    else if (['shop-all', 'iphone-cases', 'samsung-cases', 'magsafe-and-tech', 'glass-screen-protectors'].includes(path)) link.setAttribute('href', 'shop.html');
    else if (path === 'cart') link.setAttribute('href', 'cart.html');
    else if (path === 'wishlist') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showToast(`You have ${AURA.wishlist.length} saved item(s) in your Wishlist.`);
      });
    }
  });

  // 2. Interactive Bestsellers Filter Tabs on Homepage
  const tabButtons = document.querySelectorAll('#bestsellers button, .model-filter-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');

      const filter = btn.textContent.trim().toLowerCase();
      const productCards = document.querySelectorAll('#bestsellers .group, .bestseller-card');
      productCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (filter.includes('all') || text.includes(filter.replace('16', '').replace('24', '').trim())) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. Interactive Swatches on Product Cards
  document.querySelectorAll('.group button[title]').forEach(swatch => {
    swatch.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = swatch.parentElement;
      parent.querySelectorAll('button').forEach(b => b.classList.remove('ring-2', 'ring-primary', 'ring-offset-1'));
      swatch.classList.add('ring-2', 'ring-primary', 'ring-offset-1');
      const title = swatch.getAttribute('title');
      if (title) showToast(`Selected finish: ${title}`);
    });
  });

  // 4. Quick Add Buttons on Cards
  document.querySelectorAll('.group button, .btn-quick-add').forEach(btn => {
    const text = btn.textContent ? btn.textContent.trim().toUpperCase() : '';
    if (text === 'ADD' || text.includes('ADD TO BAG') || text.includes('ADD TO CART') || text.includes('QUICK ADD')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const card = btn.closest('.group') || btn.closest('.product-card');
        const title = card ? (card.querySelector('h3, h2, .font-headline-sm')?.textContent.trim() || 'AURA Case') : 'AURA ArmorShield Pro';
        const priceStr = card ? (card.querySelector('.font-price-md, .font-bold')?.textContent.replace(/[^0-9.]/g, '') || '54.00') : '54.00';
        const img = card ? card.querySelector('img')?.src : '';

        addToCart({
          id: 'case-' + title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          title: title,
          price: parseFloat(priceStr) || 54.00,
          image: img,
          model: 'iPhone 16 Pro',
          color: 'Matte Obsidian'
        });

        const origHtml = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined text-[16px] text-emerald-400">check</span> Added!';
        setTimeout(() => {
          btn.innerHTML = origHtml;
        }, 1500);
      });
    }
  });

  // 5. Product Card Click -> Product Detail Page
  document.querySelectorAll('#bestsellers .group, .clickable-product-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      window.location.href = 'product.html';
    });
  });

  // 6. Currency Switcher Dropdown Click
  const currencyBtn = document.querySelector('.currency-selector-btn, header .flex.items-center.gap-space-xs.cursor-pointer');
  if (currencyBtn) {
    currencyBtn.addEventListener('click', () => {
      const currencies = ['USD', 'EUR', 'GBP', 'CAD'];
      const nextIdx = (currencies.indexOf(AURA.currency.code) + 1) % currencies.length;
      const nextCur = currencies[nextIdx];
      changeCurrency(nextCur);
    });
  }

  // 7. Search Input (Enter to search)
  document.querySelectorAll('input[placeholder*="Search"]').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        window.location.href = `shop.html?search=${encodeURIComponent(input.value.trim())}`;
      }
    });
  });

  // 8. Newsletter Forms
  document.querySelectorAll('form').forEach(form => {
    if (form.querySelector('input[type="email"]')) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && input.value) {
          showToast(`Welcome! Discount code AURA15 emailed to ${input.value}`);
          input.value = '';
          const btn = form.querySelector('button');
          if (btn) btn.textContent = 'Subscribed ✓';
        }
      });
      const submitBtn = form.querySelector('button');
      if (submitBtn && submitBtn.type === 'button') {
        submitBtn.addEventListener('click', () => {
          const input = form.querySelector('input[type="email"]');
          if (input && input.value) {
            showToast(`Welcome! Discount code AURA15 emailed to ${input.value}`);
            input.value = '';
            submitBtn.textContent = 'Subscribed ✓';
          } else {
            showToast('Please enter a valid email address');
          }
        });
      }
    }
  });

  // 9. Floating Navigation Pill
  injectPrototypePill();
});

// Floating switcher
function injectPrototypePill() {
  const currentPath = window.location.pathname.toLowerCase();
  const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath.includes('homepage');
  const isShop = currentPath.includes('shop');
  const isProduct = currentPath.includes('product') || currentPath.includes('aura_armor');
  const isCart = currentPath.includes('cart') || currentPath.includes('shopping_bag');

  const bar = document.createElement('div');
  bar.className = 'fixed bottom-5 right-5 z-[9999] bg-[#0d0d11]/95 text-white backdrop-blur-md px-3.5 py-2 rounded-full shadow-2xl border border-white/10 flex items-center gap-1.5 text-xs font-medium';
  bar.innerHTML = `
    <span class="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mr-1 hidden sm:inline">AURA</span>
    <a href="index.html" class="px-2.5 py-1 rounded-full transition-colors ${isHome ? 'bg-white text-black font-bold shadow' : 'text-zinc-300 hover:text-white hover:bg-white/10'}">Home</a>
    <a href="shop.html" class="px-2.5 py-1 rounded-full transition-colors ${isShop ? 'bg-white text-black font-bold shadow' : 'text-zinc-300 hover:text-white hover:bg-white/10'}">Shop</a>
    <a href="product.html" class="px-2.5 py-1 rounded-full transition-colors ${isProduct ? 'bg-white text-black font-bold shadow' : 'text-zinc-300 hover:text-white hover:bg-white/10'}">Product</a>
    <a href="cart.html" class="px-2.5 py-1 rounded-full transition-colors ${isCart ? 'bg-white text-black font-bold shadow' : 'text-zinc-300 hover:text-white hover:bg-white/10'}">Cart</a>
  `;
  document.body.appendChild(bar);
}
