(function() {
  'use strict';

  // ============================================
  // TEMA OSCURO / MODAL VELVET TOGGLE
  // ============================================
  const themeToggle = document.getElementById('themeToggle');
  const mobileThemeToggle = document.getElementById('mobileThemeToggle');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('lavanda_theme', theme);
    } catch (e) {}

    // Actualizar íconos
    const isDark = theme === 'dark';
    if (themeToggle) {
      themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      themeToggle.title = isDark ? 'Modo Claro' : 'Modo Velvet / Nocturno';
    }
    if (mobileThemeToggle) {
      mobileThemeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i> Cambiar Modo Claro' : '<i class="fas fa-moon"></i> Cambiar Modo Nocturno';
    }
  }

  function initTheme() {
    let savedTheme = 'light';
    try {
      savedTheme = localStorage.getItem('lavanda_theme') || 'light';
    } catch (e) {}
    setTheme(savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);

  initTheme();

  // ============================================
  // ESTADO DE NEGOCIO EN VIVO (ABIERTO / CERRADO)
  // ============================================
  function updateBusinessStatus() {
    const statusText = document.getElementById('statusText');
    const statusDot = document.querySelector('.status-dot');
    if (!statusText || !statusDot) return;

    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const hour = now.getHours();

    // Horario: Lunes (1) a Sábado (6) de 9:00 a 19:00
    const isOpenDay = day >= 1 && day <= 6;
    const isOpenHour = hour >= 9 && hour < 19;

    if (isOpenDay && isOpenHour) {
      statusDot.className = 'status-dot online';
      statusText.textContent = 'Abierto Ahora (Cierra 7 PM)';
    } else {
      statusDot.className = 'status-dot offline';
      statusText.textContent = 'Cerrado Ahora (Abre 9 AM)';
    }
  }

  updateBusinessStatus();
  setInterval(updateBusinessStatus, 60000); // Actualizar cada minuto

  // ============================================
  // PREGUNTAS FRECUENTES (FAQ ACCORDION)
  // ============================================
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');

      // Cerrar los demás para mantener formato limpio
      document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ============================================
  // ESTADO Y PERSISTENCIA DEL CARRITO
  // ============================================
  let cart = [];

  function loadCart() {
    try {
      const savedCart = localStorage.getItem('lavanda_cart');
      if (savedCart) {
        cart = JSON.parse(savedCart);
      }
    } catch (e) {
      cart = [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem('lavanda_cart', JSON.stringify(cart));
    } catch (e) {}
  }

  // DOM Elements Carrito
  const cartBtn = document.getElementById('cartBtn');
  const mobileCartBtn = document.getElementById('mobileCartBtn');
  const cartCount = document.getElementById('cartCount');
  const mobileCartCount = document.getElementById('mobileCartCount');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartTotal = document.getElementById('cartTotal');
  const cartCheckout = document.getElementById('cartCheckout');
  const cartClear = document.getElementById('cartClear');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    if (mobileCartCount) mobileCartCount.textContent = totalItems;
  }

  function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  function renderCart() {
    updateCartBadge();

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <i class="fas fa-shopping-bag"></i>
          <p>Tu carrito está vacío</p>
          <a href="#productos" class="btn btn-outline-primary btn-sm" onclick="closeCart();">Explorar Boutique</a>
        </div>
      `;
      if (cartTotal) cartTotal.textContent = '$0.00';
      if (cartCheckout) cartCheckout.disabled = true;
      return;
    }

    if (cartCheckout) cartCheckout.disabled = false;

    let html = '';
    cart.forEach(item => {
      html += `
        <div class="cart-item-row" data-id="${item.id}">
          <img src="${item.img}" alt="${item.name}" class="cart-item-img" onerror="this.src='./assets/logo-lavanda-transparente.png';" />
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
          </div>
          <div class="cart-item-qty">
            <button class="cart-qty-btn decrease-btn" data-id="${item.id}">-</button>
            <span class="cart-qty-num">${item.quantity}</span>
            <button class="cart-qty-btn increase-btn" data-id="${item.id}">+</button>
          </div>
          <button class="cart-item-remove remove-btn" data-id="${item.id}" title="Eliminar">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;

    if (cartTotal) {
      cartTotal.textContent = `$${calculateTotal().toFixed(2)}`;
    }
  }

  function openCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  window.closeCart = closeCart;

  function showToast(msg) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function addToCart(product) {
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        img: product.img,
        quantity: 1
      });
    }

    saveCart();
    renderCart();
    showToast(`"${product.name}" agregado al carrito`);
  }

  function changeQuantity(id, delta) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
      cart[itemIndex].quantity += delta;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
      }
      saveCart();
      renderCart();
    }
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      const decreaseBtn = e.target.closest('.decrease-btn');
      const increaseBtn = e.target.closest('.increase-btn');
      const removeBtn = e.target.closest('.remove-btn');

      if (decreaseBtn) {
        changeQuantity(decreaseBtn.dataset.id, -1);
      } else if (increaseBtn) {
        changeQuantity(increaseBtn.dataset.id, 1);
      } else if (removeBtn) {
        removeFromCart(removeBtn.dataset.id);
      }
    });
  }

  document.querySelectorAll('.product-add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = {
        id: btn.getAttribute('data-id'),
        name: btn.getAttribute('data-name'),
        price: btn.getAttribute('data-price'),
        img: btn.getAttribute('data-img')
      };
      addToCart(product);
    });
  });

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (mobileCartBtn) {
    mobileCartBtn.addEventListener('click', () => {
      const mobileMenu = document.getElementById('mobileMenu');
      const mobileOverlay = document.getElementById('mobileOverlay');
      if (mobileMenu) mobileMenu.classList.remove('open');
      if (mobileOverlay) mobileOverlay.classList.remove('active');
      openCart();
    });
  }
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (cartClear) cartClear.addEventListener('click', clearCart);

  if (cartCheckout) {
    cartCheckout.addEventListener('click', () => {
      if (cart.length === 0) return;

      let text = '¡Hola Lavanda Estudio! 🌸 Quisiera realizar un pedido de los siguientes productos de boutique:\n\n';
      cart.forEach(item => {
        const itemSubtotal = (item.price * item.quantity).toFixed(2);
        text += `• ${item.quantity}x ${item.name} ($${item.price.toFixed(2)} c/u) = *$${itemSubtotal}*\n`;
      });

      const total = calculateTotal().toFixed(2);
      text += `\n*Total Estimado:* *$${total}*\n\n`;
      text += 'Por favor indíquenme disponibilidad para coordinar la entrega. ¡Muchas gracias!';

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/584148804780?text=${encodedText}`;

      window.open(whatsappUrl, '_blank');
    });
  }

  loadCart();
  renderCart();

  // ============================================
  // FILTROS DE CATEGORÍAS DE PRODUCTOS
  // ============================================
  const categoryTabs = document.querySelectorAll('.category-tab');
  const productCards = document.querySelectorAll('.product-card');

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ============================================
  // SCROLL REVEAL (IntersectionObserver)
  // ============================================
  const revealElements = document.querySelectorAll('.reveal, .lavender-divider');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // NAVBAR SCROLL & GLASS EFFECT
  // ============================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 40) {
      if (navbar) navbar.classList.add('scrolled');
    } else {
      if (navbar) navbar.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  handleScroll();

  // ============================================
  // MOBILE MENU
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    if (hamburger) hamburger.classList.add('active');
    if (mobileMenu) mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ============================================
  // LIGHTBOX MODAL DE GALERÍA
  // ============================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  function openLightbox(src, title) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = title || 'Trabajo Lavanda Estudio';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title');
      const src = item.getAttribute('data-src') || (img ? img.src : '');
      
      if (img && img.style.display === 'none') {
        const placeholderText = item.querySelector('.gallery-placeholder span');
        openLightbox('./assets/logo-lavanda-transparente.png', placeholderText ? placeholderText.textContent : title);
      } else if (src) {
        openLightbox(src, title);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
      if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      }
      if (cartDrawer && cartDrawer.classList.contains('open')) {
        closeCart();
      }
    }
  });

  // ============================================
  // SMOOTH SCROLL CON OFFSET DE NAVBAR
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

})();
