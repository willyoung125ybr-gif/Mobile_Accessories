/**
 * AURA Studio - Prototype Navigation & State Connector
 * Connects the 4 design screens with seamless routing, shared cart state,
 * and a floating prototype switcher.
 */
(function() {
  // Cart state helper
  const CART_KEY = 'aura_studio_cart_count';
  function getCartCount() {
    return parseInt(localStorage.getItem(CART_KEY) || '2', 10);
  }
  function setCartCount(count) {
    localStorage.setItem(CART_KEY, Math.max(0, count));
    updateCartBadges();
  }
  function updateCartBadges() {
    const count = getCartCount();
    document.querySelectorAll('[data-path="cart"] span.font-label-badge, #cartBadge, .cart-counter').forEach(el => {
      el.textContent = count;
    });
  }

  // Toast notification
  function showToast(message) {
    const existing = document.getElementById('aura-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'aura-toast';
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-[#0d0d11] text-white px-5 py-3 rounded-full text-xs font-semibold shadow-2xl z-50 flex items-center gap-2 transition-all duration-300 opacity-0 translate-y-4';
    toast.innerHTML = `<span class="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span><span>${message}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('opacity-0', 'translate-y-4');
    });
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // Intercept data-path and common buttons
  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadges();

    // Map data-path to relative URLs
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button');
      if (!target) return;

      const path = target.getAttribute('data-path');
      const href = target.getAttribute('href');

      // Home navigation
      if (path === 'home') {
        e.preventDefault();
        window.location.href = '../homepage_aura_studio/code.html';
        return;
      }

      // Catalog navigation
      if (['shop-all', 'iphone-cases', 'samsung-cases', 'magsafe-and-tech'].includes(path)) {
        e.preventDefault();
        window.location.href = '../shop_all_phone_cases_collection/code.html';
        return;
      }

      // Cart navigation
      if (path === 'cart') {
        e.preventDefault();
        window.location.href = '../shopping_bag_checkout_aura_studio/code.html';
        return;
      }

      // Buttons with specific text
      const text = target.textContent ? target.textContent.trim().toUpperCase() : '';
      if (text.includes('SHOP COLLECTION') || text.includes('EXPLORE BESTSELLERS') || text.includes('EXPLORE ALL CASES')) {
        if (!href || href.startsWith('#')) {
          e.preventDefault();
          window.location.href = '../shop_all_phone_cases_collection/code.html';
          return;
        }
      }

      // Add to Cart / Add to Bag buttons
      if (text.includes('ADD TO BAG') || text.includes('ADD TO CART')) {
        e.preventDefault();
        setCartCount(getCartCount() + 1);
        showToast('Added to Shopping Bag! View in Cart.');
        return;
      }

      // Product card clicks in catalog or home
      if (target.closest('.group') && !target.closest('header') && !target.closest('footer')) {
        const titleEl = target.closest('.group').querySelector('h3, h2, .font-headline-sm');
        if (titleEl && (titleEl.textContent.includes('ArmorShield') || titleEl.textContent.includes('AeroShield') || titleEl.textContent.includes('Shield'))) {
          if (!href || href === '#') {
            e.preventDefault();
            window.location.href = '../aura_armorshield_pro_product_detail_page/code.html';
            return;
          }
        }
      }
    });

    // Inject Floating Screen Navigator Pill
    injectPrototypePill();
  });

  function injectPrototypePill() {
    const currentPath = window.location.pathname.toLowerCase();
    const isHome = currentPath.includes('homepage');
    const isCatalog = currentPath.includes('shop_all');
    const isPdp = currentPath.includes('aura_armorshield');
    const isCart = currentPath.includes('shopping_bag');

    const bar = document.createElement('div');
    bar.className = 'fixed bottom-5 right-5 z-[9999] bg-[#0d0d11]/95 text-white backdrop-blur-md px-3 py-2 rounded-full shadow-2xl border border-white/10 flex items-center gap-1.5 text-xs font-medium';
    bar.innerHTML = `
      <a href="../index.html" title="Hub Overview" class="flex items-center gap-1 px-2.5 py-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
        <span class="material-symbols-outlined text-[14px]">grid_view</span>
        <span class="hidden sm:inline">Hub</span>
      </a>
      <span class="text-zinc-600">|</span>
      <a href="../homepage_aura_studio/code.html" class="px-2.5 py-1 rounded-full transition-colors ${isHome ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/10'}">Home</a>
      <a href="../shop_all_phone_cases_collection/code.html" class="px-2.5 py-1 rounded-full transition-colors ${isCatalog ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/10'}">Shop</a>
      <a href="../aura_armorshield_pro_product_detail_page/code.html" class="px-2.5 py-1 rounded-full transition-colors ${isPdp ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/10'}">Product</a>
      <a href="../shopping_bag_checkout_aura_studio/code.html" class="px-2.5 py-1 rounded-full transition-colors ${isCart ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/10'}">Cart</a>
    `;
    document.body.appendChild(bar);
  }
})();
