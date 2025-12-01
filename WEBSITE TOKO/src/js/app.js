// Main application logic
(function() {
  'use strict';

  // DOM Elements
  const listEl = document.getElementById('product-list');
  const filtersEl = document.getElementById('filters');
  const yearEl = document.getElementById('year');
  const search = document.getElementById('search');

  // WhatsApp Configuration
  const WA_NUMBER = '62895374651500';
  const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

  // Set current year in footer
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===== PRODUCT RENDERING =====
  
  // Format currency
  function formatMoney(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Render products
  function renderProducts(items = PRODUCTS) {
    if (!listEl) return;
    
    if (items.length === 0) {
      listEl.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--muted);">Tidak ada produk ditemukan</p>';
      return;
    }

    listEl.innerHTML = items.map(product => `
      <article class="card" data-id="${product.id}">
        <img src="${product.img}" alt="${product.title}" loading="lazy" />
        <div class="card-body">
          <div class="card-title">${product.title}</div>
          <div class="card-desc">${product.desc}</div>
          <div class="card-row">
            <div class="price">${formatMoney(product.price)}</div>
            <a class="btn btn-ghost btn-sm" 
               href="${waLink('Halo Ka, saya mau pesan: ' + product.title)}" 
               target="_blank"
               rel="noopener">
              Beli
            </a>
          </div>
        </div>
      </article>
    `).join('');
  }

  // ===== FILTERS =====
  
  // Get unique categories
  const categories = ['Semua', ...new Set(PRODUCTS.map(p => p.category))];
  
  // Render filter chips
  if (filtersEl) {
    filtersEl.innerHTML = categories.map(cat => 
      `<button class="chip ${cat === 'Semua' ? 'active' : ''}" data-cat="${cat}">${cat}</button>`
    ).join('');

    // Filter click handler
    filtersEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const category = btn.dataset.cat;
      const filteredProducts = category === 'Semua' 
        ? PRODUCTS 
        : PRODUCTS.filter(p => p.category === category);

      renderProducts(filteredProducts);

      // Update active state
      filtersEl.querySelectorAll('button').forEach(b => {
        b.classList.toggle('active', b === btn);
      });
    });
  }

  // ===== SEARCH =====
  
  if (search) {
    search.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      
      if (!query) {
        renderProducts(PRODUCTS);
        return;
      }

      const results = PRODUCTS.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.desc.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );

      renderProducts(results);
    });
  }

  // ===== SERVICE FUNCTIONS =====
  
  // Turnitin Order
  window.orderTurnitin = function() {
    window.open(waLink('Halo Ka, Saya Mau Cek Turnitin'), '_blank');
  };

  // Turnitin AI Order
  window.orderTurnitinAI = function() {
    window.open(waLink('Halo Ka, Saya Mau Cek Turnitin AI'), '_blank');
  };

  // Parafrase Order
  window.orderParafrase = function() {
    window.open('https://s.id/cekbiayaparafrase', '_blank');
  };

  // Perbaikan Naskah
  window.orderNaskah = function() {
    window.open(waLink('Halo Ka, Saya Mau Jasa Perbaikan Naskah (Daftar Isi, Daftar Pustaka, Mendeley, atau lainnya)'), '_blank');
  };

  // Publish Jurnal
  window.orderJurnal = function() {
    window.open(waLink('Halo Ka, Saya Mau Konsultasi untuk Publish Jurnal'), '_blank');
  };

  // Show APK Section
  window.showAPK = function() {
    const apkBox = document.getElementById('apkBox');
    if (apkBox) {
      apkBox.style.display = 'block';
      apkBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Pilih APK
  window.pilihAPK = function(nama) {
    if (nama === 'lain') {
      const customApp = prompt('Sebutkan nama aplikasi yang Anda inginkan:');
      if (customApp) {
        window.open(waLink('Halo Ka, saya mau order ' + customApp + ' Premium'), '_blank');
      }
    } else {
      window.open(waLink('Halo Ka, Saya mau order ' + nama + ' Premium'), '_blank');
    }
  };

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== INITIAL RENDER =====
  
  renderProducts();

  // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe service cards and product cards
  document.querySelectorAll('.service-card, .card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });

})();
