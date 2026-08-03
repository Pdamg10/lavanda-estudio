(function() {
  'use strict';

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

    // Navbar scrolled state
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy for active nav link
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

  // Throttle scroll events for optimal performance
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
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
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
      
      // If image failed to load, don't open modal or show placeholder title
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

  // Tecla Escape para cerrar modales y menú
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
      if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
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
