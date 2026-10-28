/**
 * KuroStream - Platform Streaming Anime Legal Berbasis Iklan (Ad-Supported)
 * Sesuai Dokumen PRD:
 * 1. Legalitas Konten & Lisensi (UU Hak Cipta No. 28 Tahun 2014)
 * 2. Pre-roll Video Ad Simulator & Display Banner Iklan
 * 3. Lanjutkan Menonton (Continue Watching) & Posisi Menit Tontonan Tersimpan
 * 4. Pemutar Adaptif dengan Kualitas (360p, 480p, 720p, 1080p) & Subtitle Terpisah
 * 5. Panel Admin Lisensi Konten & Formulir Takedown DMCA
 * 6. Kepatuhan Privasi & Cookie (UU PDP No. 27 Tahun 2022)
 */

// State Aplikasi Global
const state = {
  currentRoute: 'home',
  activeAnimeId: 'frieren',
  activeEpisodeNum: 1,
  activeServer: 'Server 1 (HD)',
  activeQuality: localStorage.getItem('kuro_quality') || '720p',
  activeSubtitle: localStorage.getItem('kuro_subtitle') || 'id',
  bookmarks: JSON.parse(localStorage.getItem('anime_bookmarks') || '["frieren", "solo-leveling"]'),
  continueWatching: JSON.parse(localStorage.getItem('anime_continue_watching') || JSON.stringify([
    {
      animeId: 'frieren',
      episodeNum: 1,
      currentTime: 420,
      duration: 1440,
      timestamp: Date.now() - 3600000
    },
    {
      animeId: 'solo-leveling',
      episodeNum: 1,
      currentTime: 680,
      duration: 1380,
      timestamp: Date.now() - 7200000
    }
  ])),
  comments: [...INITIAL_COMMENTS],
  filters: {
    genre: 'all',
    year: 'all',
    type: 'all',
    status: 'all',
    search: ''
  },
  adTimer: null,
  adSecondsLeft: 5,
  isAdActive: false
};

// Inisialisasi Aplikasi saat DOM Siap
document.addEventListener('DOMContentLoaded', () => {
  initRouting();
  initGlobalEvents();
  initCookieConsent();
  updateBookmarkBadge();
  populateTakedownAnimeSelect();
  initAdminModalData();
  handleRouteChange();
});

// Routing Berbasis Hash URL
function initRouting() {
  window.addEventListener('hashchange', handleRouteChange);
}

function handleRouteChange() {
  const hash = window.location.hash || '#home';
  const [route, queryString] = hash.split('?');
  const params = new URLSearchParams(queryString || '');

  state.currentRoute = route.replace('#', '') || 'home';

  // Update Nav Link Active State
  document.querySelectorAll('.nav-link').forEach(link => {
    const targetRoute = link.getAttribute('data-route');
    if (targetRoute === state.currentRoute) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (state.currentRoute === 'watch') {
    const animeId = params.get('id') || 'frieren';
    const epNum = parseInt(params.get('ep') || '1', 10);
    renderWatchPage(animeId, epNum);
  } else if (state.currentRoute === 'catalog') {
    const genreParam = params.get('genre');
    const searchParam = params.get('q');
    if (genreParam) state.filters.genre = genreParam;
    if (searchParam) state.filters.search = searchParam;
    renderCatalogPage();
  } else {
    renderHomePage();
  }
}

// Inisialisasi Event Global (Search, Mobile Menu, Modals)
function initGlobalEvents() {
  // Search input navbar
  const searchInput = document.getElementById('navbar-search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        state.filters.search = query;
        window.location.hash = `#catalog?q=${encodeURIComponent(query)}`;
      }
    });
  }

  // Tombol Bookmark Navbar
  const bookmarkBtn = document.getElementById('btn-open-bookmarks');
  const bookmarkModal = document.getElementById('bookmarks-modal');
  const bookmarkCloseBtn = document.getElementById('btn-close-bookmarks');

  if (bookmarkBtn && bookmarkModal) {
    bookmarkBtn.addEventListener('click', () => {
      renderBookmarkDrawerList();
      bookmarkModal.classList.add('open');
    });
  }

  if (bookmarkCloseBtn && bookmarkModal) {
    bookmarkCloseBtn.addEventListener('click', () => {
      bookmarkModal.classList.remove('open');
    });
  }

  // Tombol Lisensi Modal
  const licenseBtn = document.getElementById('btn-open-license-modal');
  const licenseModal = document.getElementById('license-modal');
  const licenseCloseBtn = document.getElementById('btn-close-license');
  const licenseDismissBtn = document.getElementById('btn-dismiss-license');
  const takedownFromLicenseBtn = document.getElementById('btn-open-takedown-from-license');

  if (licenseBtn) licenseBtn.addEventListener('click', openLicenseModal);
  if (licenseCloseBtn) licenseCloseBtn.addEventListener('click', closeLicenseModal);
  if (licenseDismissBtn) licenseDismissBtn.addEventListener('click', closeLicenseModal);
  if (takedownFromLicenseBtn) {
    takedownFromLicenseBtn.addEventListener('click', () => {
      closeLicenseModal();
      openTakedownModal();
    });
  }

  // Tombol Takedown Modal
  const takedownCloseBtn = document.getElementById('btn-close-takedown');
  const takedownCancelBtn = document.getElementById('btn-cancel-takedown');
  if (takedownCloseBtn) takedownCloseBtn.addEventListener('click', closeTakedownModal);
  if (takedownCancelBtn) takedownCancelBtn.addEventListener('click', closeTakedownModal);

  // Tombol Admin Modal
  const adminBtn = document.getElementById('btn-open-admin-modal');
  const adminCloseBtn = document.getElementById('btn-close-admin');
  if (adminBtn) adminBtn.addEventListener('click', openAdminModal);
  if (adminCloseBtn) adminCloseBtn.addEventListener('click', closeAdminModal);

  // Tombol Akun Modal
  const accountBtn = document.getElementById('btn-open-account');
  const accountCloseBtn = document.getElementById('btn-close-account');
  const accountSaveBtn = document.getElementById('btn-save-account');
  if (accountBtn) accountBtn.addEventListener('click', openAccountModal);
  if (accountCloseBtn) accountCloseBtn.addEventListener('click', closeAccountModal);
  if (accountSaveBtn) accountSaveBtn.addEventListener('click', closeAccountModal);

  // Tutup Modal jika klik di luar atau tekan Escape
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(modal => {
        modal.classList.remove('open');
      });
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }
}

// Inisialisasi Cookie Consent Banner (UU PDP No. 27 Tahun 2022)
function initCookieConsent() {
  const banner = document.getElementById('cookie-consent-banner');
  const acceptBtn = document.getElementById('btn-cookie-accept');
  const isAccepted = localStorage.getItem('kuro_cookie_consent') === 'true';

  if (banner) {
    if (isAccepted) {
      banner.classList.add('hidden');
    } else {
      banner.classList.remove('hidden');
    }
  }

  if (acceptBtn && banner) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('kuro_cookie_consent', 'true');
      banner.classList.add('hidden');
      showToast('Persetujuan privasi dan preferensi berhasil disimpan.');
    });
  }
}

// Modal Handlers
function openLicenseModal() {
  const modal = document.getElementById('license-modal');
  if (modal) modal.classList.add('open');
}

function closeLicenseModal() {
  const modal = document.getElementById('license-modal');
  if (modal) modal.classList.remove('open');
}

function openTakedownModal(animeId = '') {
  const modal = document.getElementById('takedown-modal');
  const select = document.getElementById('takedown-anime');
  if (select && animeId) {
    select.value = animeId;
  }
  if (modal) modal.classList.add('open');
}

function closeTakedownModal() {
  const modal = document.getElementById('takedown-modal');
  if (modal) modal.classList.remove('open');
}

function handleTakedownSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('takedown-name').value;
  const animeSelect = document.getElementById('takedown-anime');
  const animeTitle = animeSelect ? animeSelect.options[animeSelect.selectedIndex].text : 'Anime Terpilih';

  showToast(`Laporan takedown untuk "${animeTitle}" telah diterima. Tim legal kami akan memprosesnya dalam 1x24 jam.`);
  e.target.reset();
  closeTakedownModal();
}

function populateTakedownAnimeSelect() {
  const select = document.getElementById('takedown-anime');
  if (!select) return;
  select.innerHTML = ANIME_DATABASE.map(a => `
    <option value="${a.id}">${a.title} (${a.studio})</option>
  `).join('');
}

function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  initAdminModalData();
  if (modal) modal.classList.add('open');
}

function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) modal.classList.remove('open');
}

function initAdminModalData() {
  const animeSelect = document.getElementById('admin-select-anime');
  const tbody = document.getElementById('admin-license-tbody');

  if (animeSelect) {
    animeSelect.innerHTML = ANIME_DATABASE.map(a => `
      <option value="${a.id}">${a.title}</option>
    `).join('');
    loadAdminAnimeData(ANIME_DATABASE[0].id);
  }

  if (tbody) {
    tbody.innerHTML = ANIME_DATABASE.map(a => `
      <tr>
        <td style="font-weight: 600;">${a.title}</td>
        <td>${a.license.licensor}</td>
        <td>${a.license.region}</td>
        <td>
          <span class="license-tag-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Resmi Terverifikasi
          </span>
        </td>
        <td>${a.license.endDate}</td>
      </tr>
    `).join('');
  }
}

function loadAdminAnimeData(animeId) {
  const anime = ANIME_DATABASE.find(a => a.id === animeId);
  if (!anime) return;

  const licensorInput = document.getElementById('admin-licensor');
  const partnerInput = document.getElementById('admin-partner');
  const contractInput = document.getElementById('admin-contract');
  const regionInput = document.getElementById('admin-region');
  const endDateInput = document.getElementById('admin-end-date');

  if (licensorInput) licensorInput.value = anime.license.licensor;
  if (partnerInput) partnerInput.value = anime.license.partner;
  if (contractInput) contractInput.value = anime.license.contractNumber;
  if (regionInput) regionInput.value = anime.license.region;
  if (endDateInput) endDateInput.value = anime.license.endDate;
}

function handleAdminLicenseSave(e) {
  e.preventDefault();
  const animeId = document.getElementById('admin-select-anime').value;
  const anime = ANIME_DATABASE.find(a => a.id === animeId);
  if (!anime) return;

  anime.license.licensor = document.getElementById('admin-licensor').value;
  anime.license.partner = document.getElementById('admin-partner').value;
  anime.license.contractNumber = document.getElementById('admin-contract').value;
  anime.license.region = document.getElementById('admin-region').value;
  anime.license.endDate = document.getElementById('admin-end-date').value;

  initAdminModalData();
  showToast(`Data lisensi untuk "${anime.title}" berhasil diperbarui.`);
}

function openAccountModal() {
  const modal = document.getElementById('account-modal');
  const watchedCount = document.getElementById('account-watched-count');
  const bookmarkCount = document.getElementById('account-bookmark-count');
  const qualitySelect = document.getElementById('pref-default-quality');
  const subSelect = document.getElementById('pref-default-sub');

  if (watchedCount) watchedCount.textContent = state.continueWatching.length;
  if (bookmarkCount) bookmarkCount.textContent = state.bookmarks.length;
  if (qualitySelect) qualitySelect.value = state.activeQuality;
  if (subSelect) subSelect.value = state.activeSubtitle;

  if (modal) modal.classList.add('open');
}

function closeAccountModal() {
  const modal = document.getElementById('account-modal');
  if (modal) modal.classList.remove('open');
}

function updateDefaultQuality(val) {
  state.activeQuality = val;
  localStorage.setItem('kuro_quality', val);
  showToast(`Kualitas default diatur ke ${val}`);
}

function updateDefaultSub(val) {
  state.activeSubtitle = val;
  localStorage.setItem('kuro_subtitle', val);
  showToast('Bahasa subtitle utama diperbarui.');
}

// ==========================================================================
// 1. RENDER HOMEPAGE (PRD: Hero Banner, Lanjutkan Menonton, Rilis Terbaru)
// ==========================================================================
function renderHomePage() {
  const container = document.getElementById('main-content');
  const featuredAnime = ANIME_DATABASE.find(a => a.isFeatured) || ANIME_DATABASE[0];
  const isBookmarked = state.bookmarks.includes(featuredAnime.id);

  // Kumpulkan episode terbaru dari semua anime
  const latestEpisodes = [];
  ANIME_DATABASE.forEach(anime => {
    if (anime.episodes && anime.episodes.length > 0) {
      const latestEp = anime.episodes[anime.episodes.length - 1];
      latestEpisodes.push({
        anime,
        episode: latestEp
      });
    }
  });

  // Data Lanjutkan Menonton (Continue Watching)
  const continueItems = state.continueWatching.map(item => {
    const anime = ANIME_DATABASE.find(a => a.id === item.animeId);
    if (!anime) return null;
    const ep = anime.episodes.find(e => e.number === item.episodeNum) || anime.episodes[0];
    const percentage = Math.min(100, Math.round((item.currentTime / item.duration) * 100));
    return {
      anime,
      episode: ep,
      progressPercent: percentage,
      currentSec: item.currentTime
    };
  }).filter(Boolean);

  container.innerHTML = `
    <!-- Hero Banner Utama dengan Bukti Lisensi Resmi -->
    <section class="hero-section">
      <img src="${featuredAnime.banner}" alt="${featuredAnime.title}" class="hero-background" />
      <div class="hero-gradient-overlay"></div>
      <div class="hero-content">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap;">
          <span class="hero-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            ${featuredAnime.featuredTagline}
          </span>
          <span class="license-tag-badge" onclick="openLicenseModal()" style="cursor: pointer;" title="Klik untuk rincian lisensi">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Lisensi Resmi ID: ${featuredAnime.license.licensor}
          </span>
        </div>

        <h1 class="hero-title">${featuredAnime.title}</h1>
        <p class="hero-japanese-title">${featuredAnime.japaneseTitle}</p>
        
        <div class="hero-meta-row">
          <span class="meta-rating">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            ${featuredAnime.rating}
          </span>
          <span>${featuredAnime.season}</span>
          <span>${featuredAnime.type}</span>
          <span>Studio: ${featuredAnime.studio}</span>
          <span>${featuredAnime.totalEpisodes} Episode</span>
        </div>

        <p class="hero-synopsis">${featuredAnime.synopsis}</p>

        <div class="hero-actions">
          <a href="#watch?id=${featuredAnime.id}&ep=1" class="btn btn-primary" id="hero-watch-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Tonton Episode 1</span>
          </a>

          <button class="btn btn-secondary" onclick="toggleBookmark('${featuredAnime.id}', this)" id="hero-bookmark-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>${isBookmarked ? 'Tersimpan' : 'Bookmark'}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Section Lanjutkan Menonton (PRD MVP: Posisi Tonton Tersimpan) -->
    ${continueItems.length > 0 ? `
      <section class="continue-watching-section">
        <div class="continue-header">
          <h2 class="continue-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Lanjutkan Menonton
          </h2>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${continueItems.length} Judul dalam antrean</span>
        </div>
        <div class="continue-grid">
          ${continueItems.map(item => `
            <div class="continue-card">
              <div class="continue-thumb-box">
                <img src="${item.episode.thumbnail}" alt="${item.anime.title}" class="continue-thumb-img" />
                <div class="continue-progress-bar">
                  <div class="continue-progress-fill" style="width: ${item.progressPercent}%;"></div>
                </div>
              </div>
              <div class="continue-details">
                <h3 class="continue-anime-title" title="${item.anime.title}">${item.anime.title}</h3>
                <p class="continue-ep-info">Episode ${item.episode.number} • ${item.progressPercent}% selesai</p>
                <a href="#watch?id=${item.anime.id}&ep=${item.episode.number}" class="btn-resume">
                  <span>Lanjutkan Menonton</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Banner Iklan Bersponsor Non-Intrusif (PRD: Ad-Supported Model) -->
    <aside class="ad-banner-slot" role="complementary" aria-label="Iklan Bersponsor">
      <div class="ad-banner-header">
        <span class="ad-banner-tag">Iklan Bersponsor • Mendukung Akses Anime Gratis Legal</span>
        <button class="footer-link-btn" onclick="openLicenseModal()" style="font-size: 0.75rem;">Mengapa ada iklan?</button>
      </div>
      <div class="ad-banner-content">
        <div class="ad-banner-text">
          <h4>${AD_DATABASE.banner.title}</h4>
          <p>${AD_DATABASE.banner.description}</p>
        </div>
        <a href="${AD_DATABASE.banner.url || '#'}" target="_blank" rel="noopener" class="ad-banner-cta-btn">
          ${AD_DATABASE.banner.ctaText}
        </a>
      </div>
    </aside>

    <!-- Grid Episode Terbaru -->
    <section class="latest-section">
      <div class="section-header">
        <div>
          <h2 class="section-title">Rilis Terbaru Berlisensi</h2>
          <p class="section-subtitle">Episode teranyar subtitle Bahasa Indonesia yang legal dan nyaman ditonton.</p>
        </div>
        <a href="#catalog" class="btn-view-all">Lihat Semua Anime</a>
      </div>

      <div class="episodes-grid">
        ${latestEpisodes.map(({ anime, episode }) => `
          <article class="episode-card" onclick="window.location.hash='#watch?id=${anime.id}&ep=${episode.number}'">
            <div class="thumbnail-wrapper">
              <img src="${episode.thumbnail}" alt="${anime.title} Episode ${episode.number}" class="episode-thumbnail" loading="lazy" />
              <div class="thumbnail-overlay"></div>
              
              <div class="episode-badge">Ep ${episode.number}</div>
              <div class="duration-badge">${episode.duration}</div>

              <div class="play-indicator">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>

            <div class="card-info">
              <h3 class="card-title" title="${anime.title}">${anime.title}</h3>
              <p class="card-ep-title">${episode.title}</p>
              
              <div class="card-footer-meta">
                <span class="card-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="color: var(--star-rating);">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  ${anime.rating}
                </span>
                <span class="card-meta-item">${anime.genres[0]}</span>
                <span class="card-meta-item" style="color: var(--success);" title="Lisensi Resmi Indonesia">
                  ✓ Legal
                </span>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

// ==========================================================================
// 2. RENDER WATCH PAGE (Player Video Adaptif, Pre-roll Ad, Subtitle, Lisensi)
// ==========================================================================
function renderWatchPage(animeId, epNum) {
  const container = document.getElementById('main-content');
  const anime = ANIME_DATABASE.find(a => a.id === animeId) || ANIME_DATABASE[0];
  const currentEp = anime.episodes.find(e => e.number === epNum) || anime.episodes[0];
  const nextEp = anime.episodes.find(e => e.number === epNum + 1);

  state.activeAnimeId = anime.id;
  state.activeEpisodeNum = currentEp.number;

  // Filter rekomendasi (anime lain)
  const recommendations = ANIME_DATABASE.filter(a => a.id !== anime.id).slice(0, 4);

  // Filter komentar spesifik anime ini
  const episodeComments = state.comments.filter(c => c.animeId === anime.id);

  // Ambil posisi tonton sebelumnya jika ada
  const savedProgress = state.continueWatching.find(i => i.animeId === anime.id && i.episodeNum === currentEp.number);
  const hasResumeTime = savedProgress && savedProgress.currentTime > 10;

  // Iklan Pre-roll terpilih
  const prerollAd = AD_DATABASE.preroll[Math.floor(Math.random() * AD_DATABASE.preroll.length)];

  container.innerHTML = `
    <div class="watch-page">
      <div class="watch-layout">
        <!-- Kolom Kiri: Player Video & Konten Utama -->
        <div class="watch-main-column">

          <!-- Notifikasi Lanjutkan Tontonan -->
          ${hasResumeTime ? `
            <div class="resume-toast-banner" id="resume-banner">
              <span class="resume-toast-text">
                Anda sebelumnya telah menonton hingga detik ke-${Math.floor(savedProgress.currentTime)} (${formatMinutes(savedProgress.currentTime)}).
              </span>
              <button class="resume-toast-btn" onclick="resumeVideoPlay(${savedProgress.currentTime})">
                Lanjutkan dari Menit Tersebut
              </button>
            </div>
          ` : ''}

          <!-- Video Player Interaktif dengan Pre-roll Ad Overlay -->
          <div class="player-container" id="video-player-box" style="position: relative;">
            
            <!-- Pre-roll Ad Simulator Overlay (PRD MVP: Monetisasi Iklan) -->
            <div class="ad-preroll-overlay" id="ad-preroll-layer">
              <div class="ad-preroll-header">
                <span class="ad-badge-pill">Iklan Bersponsor (Ad 1 of 1)</span>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span class="ad-countdown-pill" id="ad-countdown-label">
                    Dapat dilewati dalam 5 detik...
                  </span>
                  <button class="ad-skip-btn" id="ad-skip-button" style="display: none;" onclick="skipPrerollAd()">
                    Lewati Iklan &rarr;
                  </button>
                </div>
              </div>

              <div class="ad-preroll-body">
                <div class="ad-sponsor-label">${prerollAd.brand}</div>
                <h3 class="ad-sponsor-title">${prerollAd.title}</h3>
                <p class="ad-sponsor-desc">${prerollAd.description}</p>
                <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
                  <a href="${prerollAd.url}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size: 0.85rem; padding: 0.45rem 1rem;">
                    ${prerollAd.ctaText}
                  </a>
                  <span style="font-size: 0.8rem; color: var(--text-muted);">${prerollAd.tagline}</span>
                </div>
              </div>

              <div class="ad-footer-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Pendapatan iklan ini disalurkan kepada pemilik lisensi resmi anime di Indonesia.</span>
              </div>
            </div>

            <!-- Elemen Video Utama -->
            <video 
              id="html5-video" 
              class="video-element" 
              poster="${currentEp.thumbnail}" 
              controls
              onplay="handleVideoPlay('${anime.id}', ${currentEp.number})"
              ontimeupdate="handleVideoTimeUpdate('${anime.id}', ${currentEp.number})"
            >
              <source src="${currentEp.videoSrc}" type="video/mp4">
              Browser Anda tidak mendukung tag video HTML5.
            </video>
          </div>

          <!-- Bar Pengaturan Pemutar (Kualitas Adaptif 360p-1080p, Subtitle, & Kecepatan) -->
          <div class="player-settings-bar">
            <div class="player-controls-left">
              <!-- Pemilih Kualitas Video (PRD Kebutuhan Fungsional 1) -->
              <div class="player-control-group">
                <label for="video-quality-select" style="font-size: 0.8rem; color: var(--text-muted);">Kualitas:</label>
                <select id="video-quality-select" class="player-select" onchange="changeVideoQuality(this.value)">
                  ${VIDEO_QUALITIES.map(q => `
                    <option value="${q.value}" ${state.activeQuality === q.value ? 'selected' : ''}>
                      ${q.label}
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Pemilih Subtitle Terpisah (PRD Kebutuhan Fungsional 2) -->
              <div class="player-control-group">
                <label for="video-sub-select" style="font-size: 0.8rem; color: var(--text-muted);">Subtitle:</label>
                <select id="video-sub-select" class="player-select" onchange="changeVideoSubtitle(this.value)">
                  ${VIDEO_SUBTITLES.map(s => `
                    <option value="${s.code}" ${state.activeSubtitle === s.code ? 'selected' : ''}>
                      ${s.label}
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div class="player-controls-right">
              <!-- Kecepatan Putar -->
              <div class="player-control-group">
                <label for="video-speed-select" style="font-size: 0.8rem; color: var(--text-muted);">Kecepatan:</label>
                <select id="video-speed-select" class="player-select" onchange="changeVideoSpeed(this.value)">
                  <option value="0.75">0.75x</option>
                  <option value="1" selected>1.0x (Normal)</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2.0x</option>
                </select>
              </div>

              <!-- Tombol Fullscreen -->
              <button class="btn btn-secondary" onclick="toggleVideoFullscreen()" style="min-height: 32px; padding: 0.25rem 0.65rem; font-size: 0.8rem;">
                Layar Penuh
              </button>
            </div>
          </div>

          <!-- Kartu Lisensi Resmi & Tombol Lapor Hak Cipta (PRD Poin 1 & 7) -->
          <div class="license-info-card">
            <div class="license-info-text">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <div>
                <h4 class="license-meta-title">Konten Resmi Berlisensi Indonesia</h4>
                <p class="license-meta-desc">
                  Pemegang Hak: <strong>${anime.license.licensor}</strong> • Mitra: ${anime.license.partner} • Wilayah: ${anime.license.region} • Berlaku hingga: ${anime.license.endDate}
                </p>
              </div>
            </div>
            <button class="footer-link-btn" onclick="openTakedownModal('${anime.id}')" style="font-size: 0.8rem; color: var(--accent-hover);">
              Lapor Hak Cipta (Takedown)
            </button>
          </div>

          <!-- Banner Iklan di Bawah Pemutar -->
          <aside class="ad-banner-slot" style="margin: 0.75rem 0 1.5rem 0;" role="complementary">
            <div class="ad-banner-header">
              <span class="ad-banner-tag">Iklan Banner Terverifikasi</span>
              <span style="font-size: 0.75rem; color: var(--text-subtle);">Bebas Malware & Aman</span>
            </div>
            <div class="ad-banner-content">
              <div class="ad-banner-text">
                <h4>Pre-order Blu-Ray & Merchandise Kolektor Resmi</h4>
                <p>Edisi khusus bergaransi resmi dari importir resmi berlisensi distributor.</p>
              </div>
              <a href="#" class="ad-banner-cta-btn">Beli Merchandise</a>
            </div>
          </aside>

          <!-- Pemilih Server / Mirror -->
          <div class="server-selector-card">
            <div class="server-label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
              <span>Server CDN Penyiaran:</span>
            </div>
            <div class="server-buttons">
              <button class="server-btn ${state.activeServer === 'Server 1 (HD)' ? 'active' : ''}" onclick="switchServer('Server 1 (HD)', this)">CDN Cloudflare</button>
              <button class="server-btn ${state.activeServer === 'Server 2 (FHD)' ? 'active' : ''}" onclick="switchServer('Server 2 (FHD)', this)">CDN Bunny High-Bitrate</button>
              <button class="server-btn ${state.activeServer === 'Server 3 (Backup)' ? 'active' : ''}" onclick="switchServer('Server 3 (Backup)', this)">CDN Cadangan Lokal</button>
            </div>
          </div>

          <!-- Informasi Episode & Metadata -->
          <div class="video-meta-box">
            <div class="video-header-row">
              <div>
                <a href="#catalog" class="anime-parent-title">${anime.title}</a>
                <h1 class="episode-detail-title">Episode ${currentEp.number}: ${currentEp.title}</h1>
              </div>
              ${nextEp ? `
                <a href="#watch?id=${anime.id}&ep=${nextEp.number}" class="btn-next-episode">
                  <span>Episode Selanjutnya (${nextEp.number})</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              ` : `
                <span class="info-pill">Episode Terakhir Musim Ini</span>
              `}
            </div>

            <!-- Studio & Genre Badges -->
            <div class="studio-genre-badges">
              <span class="info-pill studio">Studio: ${anime.studio}</span>
              <span class="info-pill">Status: ${anime.status}</span>
              <span class="info-pill">Musim: ${anime.season}</span>
              ${anime.genres.map(g => `<span class="info-pill">${g}</span>`).join('')}
            </div>
          </div>

          <!-- Kolom Komentar Pengguna -->
          <section class="comments-section">
            <div class="comments-header">
              <h2 class="comments-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Diskusi & Komentar (<span id="comment-count">${episodeComments.length}</span>)
              </h2>
            </div>

            <form class="comment-input-wrap" onsubmit="handleCommentSubmit(event, '${anime.id}', ${currentEp.number})">
              <textarea 
                id="comment-input-field" 
                class="comment-textarea" 
                placeholder="Tulis ulasan Anda mengenai episode ini..." 
                required
              ></textarea>
              <div class="comment-submit-row">
                <button type="submit" class="btn btn-primary" style="min-height: 40px; padding: 0.5rem 1.25rem;">
                  Kirim Komentar
                </button>
              </div>
            </form>

            <div class="comment-list" id="comments-display-list">
              ${episodeComments.map(c => `
                <div class="comment-item">
                  <div class="user-avatar-badge">${c.avatar}</div>
                  <div class="comment-content">
                    <div class="comment-author-row">
                      <span class="comment-author-name">${c.author}</span>
                      <span class="comment-time">${c.timeAgo}</span>
                    </div>
                    <p class="comment-text">${c.text}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        </div>

        <!-- Kolom Kanan / Sidebar: Daftar Episode & Rekomendasi -->
        <aside class="watch-sidebar">
          <!-- Daftar Tombol Episode -->
          <div class="sidebar-card">
            <h2 class="sidebar-title">
              <span>Daftar Episode</span>
              <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">${anime.episodes.length} Episode</span>
            </h2>
            <div class="episode-buttons-list">
              ${anime.episodes.map(ep => `
                <a 
                  href="#watch?id=${anime.id}&ep=${ep.number}" 
                  class="ep-select-btn ${ep.number === currentEp.number ? 'active' : ''}"
                >
                  <span class="ep-btn-num">Episode ${ep.number}</span>
                  <span style="font-size: 0.8rem; color: var(--text-subtle);">${ep.duration}</span>
                </a>
              `).join('')}
            </div>
          </div>

          <!-- Daftar Rekomendasi Anime Terkait -->
          <div class="sidebar-card">
            <h2 class="sidebar-title">Rekomendasi Anime Serupa</h2>
            <div class="recommendations-list">
              ${recommendations.map(rec => `
                <a href="#watch?id=${rec.id}&ep=1" class="rec-card">
                  <img src="${rec.poster}" alt="${rec.title}" class="rec-poster" loading="lazy" />
                  <div class="rec-info">
                    <h4 class="rec-title">${rec.title}</h4>
                    <p class="rec-meta">★ ${rec.rating} • ${rec.genres[0]}</p>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${rec.status}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;

  // Jalankan simulator iklan pre-roll saat halaman tonton dimuat
  startPrerollAdSimulator();
}

// Simulasi Pre-roll Ad Video
function startPrerollAdSimulator() {
  const overlay = document.getElementById('ad-preroll-layer');
  const countdownLabel = document.getElementById('ad-countdown-label');
  const skipBtn = document.getElementById('ad-skip-button');
  const video = document.getElementById('html5-video');

  if (!overlay || !countdownLabel || !skipBtn) return;

  state.isAdActive = true;
  state.adSecondsLeft = 5;

  if (state.adTimer) clearInterval(state.adTimer);

  state.adTimer = setInterval(() => {
    state.adSecondsLeft -= 1;
    if (state.adSecondsLeft > 0) {
      countdownLabel.textContent = `Dapat dilewati dalam ${state.adSecondsLeft} detik...`;
    } else {
      clearInterval(state.adTimer);
      countdownLabel.style.display = 'none';
      skipBtn.style.display = 'inline-flex';
    }
  }, 1000);
}

function skipPrerollAd() {
  const overlay = document.getElementById('ad-preroll-layer');
  const video = document.getElementById('html5-video');

  if (state.adTimer) clearInterval(state.adTimer);
  state.isAdActive = false;

  if (overlay) {
    overlay.classList.add('hidden');
  }

  if (video) {
    video.play().catch(() => {});
  }

  showToast('Iklan dilewati. Pemutaran anime dimulai.');
}

// Pengaturan Pemutar Video
function changeVideoQuality(qualityVal) {
  state.activeQuality = qualityVal;
  localStorage.setItem('kuro_quality', qualityVal);

  const video = document.getElementById('html5-video');
  if (video) {
    const curTime = video.currentTime;
    const isPaused = video.paused;
    video.load();
    video.currentTime = curTime;
    if (!isPaused && !state.isAdActive) {
      video.play().catch(() => {});
    }
  }

  showToast(`Kualitas beralih ke ${qualityVal} (Bitrate HLS adaptif disesuaikan)`);
}

function changeVideoSubtitle(subCode) {
  state.activeSubtitle = subCode;
  localStorage.setItem('kuro_subtitle', subCode);

  const subObj = VIDEO_SUBTITLES.find(s => s.code === subCode);
  const label = subObj ? subObj.label : subCode;
  showToast(`Trek Subtitle diubah: ${label}`);
}

function changeVideoSpeed(speedVal) {
  const video = document.getElementById('html5-video');
  if (video) {
    video.playbackRate = parseFloat(speedVal);
    showToast(`Kecepatan putar diatur ke ${speedVal}x`);
  }
}

function toggleVideoFullscreen() {
  const box = document.getElementById('video-player-box');
  if (!box) return;

  if (!document.fullscreenElement) {
    if (box.requestFullscreen) {
      box.requestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Resume & Tracking Menit Nonton
function handleVideoPlay(animeId, epNum) {
  // Update recent continue watching item
  const anime = ANIME_DATABASE.find(a => a.id === animeId);
  if (!anime) return;
  const ep = anime.episodes.find(e => e.number === epNum) || anime.episodes[0];
  const durSec = parseDurationToSeconds(ep.duration);

  let existing = state.continueWatching.find(i => i.animeId === animeId && i.episodeNum === epNum);
  if (!existing) {
    existing = {
      animeId,
      episodeNum: epNum,
      currentTime: 0,
      duration: durSec,
      timestamp: Date.now()
    };
    state.continueWatching.unshift(existing);
    localStorage.setItem('anime_continue_watching', JSON.stringify(state.continueWatching));
  }
}

function handleVideoTimeUpdate(animeId, epNum) {
  const video = document.getElementById('html5-video');
  if (!video || state.isAdActive) return;

  const cur = Math.floor(video.currentTime);
  const dur = Math.floor(video.duration) || 1440;

  // Hanya perbarui setiap 5 detik untuk efisiensi
  if (cur % 5 === 0 && cur > 0) {
    let item = state.continueWatching.find(i => i.animeId === animeId && i.episodeNum === epNum);
    if (item) {
      item.currentTime = cur;
      item.duration = dur;
      item.timestamp = Date.now();
    } else {
      state.continueWatching.unshift({
        animeId,
        episodeNum: epNum,
        currentTime: cur,
        duration: dur,
        timestamp: Date.now()
      });
    }
    localStorage.setItem('anime_continue_watching', JSON.stringify(state.continueWatching));
  }
}

function resumeVideoPlay(targetSeconds) {
  const video = document.getElementById('html5-video');
  const banner = document.getElementById('resume-banner');
  if (video) {
    video.currentTime = targetSeconds;
    if (!state.isAdActive) {
      video.play().catch(() => {});
    }
    showToast(`Melanjutkan pemutaran dari detik ke-${targetSeconds}`);
  }
  if (banner) {
    banner.style.display = 'none';
  }
}

function formatMinutes(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function parseDurationToSeconds(durStr) {
  const min = parseInt(durStr, 10) || 24;
  return min * 60;
}

// Switch Server / Mirror
function switchServer(serverName, btnElement) {
  state.activeServer = serverName;
  document.querySelectorAll('.server-btn').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

  const videoEl = document.getElementById('html5-video');
  if (videoEl) {
    const currentTime = videoEl.currentTime;
    videoEl.load();
    videoEl.currentTime = currentTime;
    showToast(`Beralih ke jaringan ${serverName}. Video diperbarui.`);
  }
}

// Submit Komentar Baru
function handleCommentSubmit(event, animeId, episodeNum) {
  event.preventDefault();
  const input = document.getElementById('comment-input-field');
  const text = input.value.trim();
  if (!text) return;

  const newComment = {
    id: 'c_' + Date.now(),
    author: 'Anda (Pengguna)',
    avatar: 'ME',
    animeId: animeId,
    episode: episodeNum,
    timeAgo: 'Baru saja',
    text: text
  };

  state.comments.unshift(newComment);
  input.value = '';

  const commentList = document.getElementById('comments-display-list');
  const countEl = document.getElementById('comment-count');

  if (commentList) {
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item';
    commentItem.innerHTML = `
      <div class="user-avatar-badge">${newComment.avatar}</div>
      <div class="comment-content">
        <div class="comment-author-row">
          <span class="comment-author-name">${newComment.author}</span>
          <span class="comment-time">${newComment.timeAgo}</span>
        </div>
        <p class="comment-text">${newComment.text}</p>
      </div>
    `;
    commentList.prepend(commentItem);
  }

  if (countEl) {
    const currentCount = parseInt(countEl.textContent, 10) || 0;
    countEl.textContent = currentCount + 1;
  }

  showToast('Komentar berhasil dipublikasikan!');
}

// ==========================================================================
// 3. RENDER CATALOG & FILTER PAGE
// ==========================================================================
function renderCatalogPage() {
  const container = document.getElementById('main-content');

  const allGenres = ['Action', 'Romance', 'Isekai', 'Fantasy', 'Adventure', 'Supernatural', 'Comedy', 'Drama'];
  const allYears = ['2024', '2023', '2022'];

  container.innerHTML = `
    <div class="catalog-page">
      <div class="filter-bar-card">
        <div class="filter-bar-header">
          <h1 class="filter-heading">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Katalog & Pencarian Anime Berlisensi
          </h1>
          <button class="btn-reset-filter" onclick="resetFilters()">
            Reset Filter
          </button>
        </div>

        <div class="filter-grid">
          <!-- Filter Genre -->
          <div class="filter-group">
            <label class="filter-label" for="filter-genre">Genre</label>
            <select id="filter-genre" class="filter-select" onchange="applyFilters()">
              <option value="all">Semua Genre</option>
              ${allGenres.map(g => `<option value="${g}" ${state.filters.genre.toLowerCase() === g.toLowerCase() ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
          </div>

          <!-- Filter Tahun -->
          <div class="filter-group">
            <label class="filter-label" for="filter-year">Tahun Rilis</label>
            <select id="filter-year" class="filter-select" onchange="applyFilters()">
              <option value="all">Semua Tahun</option>
              ${allYears.map(y => `<option value="${y}" ${state.filters.year === y ? 'selected' : ''}>${y}</option>`).join('')}
            </select>
          </div>

          <!-- Filter Tipe -->
          <div class="filter-group">
            <label class="filter-label" for="filter-type">Format</label>
            <select id="filter-type" class="filter-select" onchange="applyFilters()">
              <option value="all">Semua Format</option>
              <option value="TV" ${state.filters.type === 'TV' ? 'selected' : ''}>Serial TV</option>
              <option value="Movie" ${state.filters.type === 'Movie' ? 'selected' : ''}>Film Layar Lebar</option>
            </select>
          </div>

          <!-- Filter Status -->
          <div class="filter-group">
            <label class="filter-label" for="filter-status">Status</label>
            <select id="filter-status" class="filter-select" onchange="applyFilters()">
              <option value="all">Semua Status</option>
              <option value="Ongoing" ${state.filters.status === 'Ongoing' ? 'selected' : ''}>Ongoing</option>
              <option value="Tamat" ${state.filters.status === 'Tamat' ? 'selected' : ''}>Tamat</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Hasil Grid Katalog -->
      <div class="catalog-grid" id="catalog-results-grid">
        <!-- Dirender oleh renderFilteredCatalog() -->
      </div>
    </div>
  `;

  renderFilteredCatalog();
}

function applyFilters() {
  const genreSelect = document.getElementById('filter-genre');
  const yearSelect = document.getElementById('filter-year');
  const typeSelect = document.getElementById('filter-type');
  const statusSelect = document.getElementById('filter-status');

  if (genreSelect) state.filters.genre = genreSelect.value;
  if (yearSelect) state.filters.year = yearSelect.value;
  if (typeSelect) state.filters.type = typeSelect.value;
  if (statusSelect) state.filters.status = statusSelect.value;

  renderFilteredCatalog();
}

function renderFilteredCatalog() {
  const grid = document.getElementById('catalog-results-grid');
  if (!grid) return;

  const filtered = ANIME_DATABASE.filter(anime => {
    if (state.filters.genre !== 'all' && !anime.genres.map(g => g.toLowerCase()).includes(state.filters.genre.toLowerCase())) {
      return false;
    }
    if (state.filters.year !== 'all' && anime.year.toString() !== state.filters.year) {
      return false;
    }
    if (state.filters.type !== 'all' && anime.type !== state.filters.type) {
      return false;
    }
    if (state.filters.status !== 'all' && anime.status !== state.filters.status) {
      return false;
    }
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      const matchTitle = anime.title.toLowerCase().includes(q);
      const matchJap = anime.japaneseTitle.toLowerCase().includes(q);
      const matchGenre = anime.genres.some(g => g.toLowerCase().includes(q));
      if (!matchTitle && !matchJap && !matchGenre) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 1rem; color: var(--text-subtle);">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3 style="color: var(--text-main); font-size: 1.2rem; margin-bottom: 0.5rem;">Tidak Ada Anime Ditemukan</h3>
        <p style="font-size: 0.9rem;">Coba sesuaikan kombinasi filter atau gunakan kata kunci pencarian lain.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(anime => `
    <div class="catalog-card" tabindex="0">
      <div class="catalog-card-image-box">
        <img src="${anime.poster}" alt="${anime.title}" class="catalog-card-img" loading="lazy" />
        <div class="catalog-card-badge">${anime.type}</div>
        <div class="catalog-card-rating">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          ${anime.rating}
        </div>
      </div>

      <div class="catalog-card-content">
        <h3 class="catalog-card-title" title="${anime.title}">${anime.title}</h3>
        <p class="catalog-card-meta">${anime.year} • ${anime.genres[0]} • <span style="color: var(--success);">Resmi</span></p>
      </div>

      <!-- Hover Popover Details -->
      <div class="catalog-hover-popover">
        <h4 class="popover-title">${anime.title}</h4>
        <div class="popover-meta">
          <span style="color: var(--star-rating); font-weight: 700;">★ ${anime.rating}</span>
          <span>${anime.season}</span>
          <span>${anime.status}</span>
        </div>
        <div class="popover-genres">
          ${anime.genres.map(g => `<span class="genre-tag">${g}</span>`).join('')}
        </div>
        <p class="popover-synopsis">${anime.synopsis}</p>
        <div style="margin-top: 0.85rem;">
          <a href="#watch?id=${anime.id}&ep=1" class="btn btn-primary" style="min-height: 36px; padding: 0.4rem 0.85rem; font-size: 0.825rem; width: 100%;">
            Tonton Sekarang
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

function resetFilters() {
  state.filters = {
    genre: 'all',
    year: 'all',
    type: 'all',
    status: 'all',
    search: ''
  };

  const genreSelect = document.getElementById('filter-genre');
  const yearSelect = document.getElementById('filter-year');
  const typeSelect = document.getElementById('filter-type');
  const statusSelect = document.getElementById('filter-status');
  const searchInput = document.getElementById('navbar-search-input');

  if (genreSelect) genreSelect.value = 'all';
  if (yearSelect) yearSelect.value = 'all';
  if (typeSelect) typeSelect.value = 'all';
  if (statusSelect) statusSelect.value = 'all';
  if (searchInput) searchInput.value = '';

  applyFilters();
}

// ==========================================================================
// 4. BOOKMARK SYSTEM & TOAST NOTIFICATION
// ==========================================================================
function toggleBookmark(animeId, btnElement) {
  const index = state.bookmarks.indexOf(animeId);
  const anime = ANIME_DATABASE.find(a => a.id === animeId);
  const animeTitle = anime ? anime.title : 'Anime';

  if (index > -1) {
    state.bookmarks.splice(index, 1);
    showToast(`Dihapus dari bookmark: ${animeTitle}`);
  } else {
    state.bookmarks.push(animeId);
    showToast(`Ditambahkan ke bookmark: ${animeTitle}`);
  }

  localStorage.setItem('anime_bookmarks', JSON.stringify(state.bookmarks));
  updateBookmarkBadge();

  if (btnElement) {
    const isBookmarked = state.bookmarks.includes(animeId);
    const span = btnElement.querySelector('span');
    const svg = btnElement.querySelector('svg');
    if (span) span.textContent = isBookmarked ? 'Tersimpan' : 'Bookmark';
    if (svg) svg.setAttribute('fill', isBookmarked ? 'currentColor' : 'none');
  }
}

function updateBookmarkBadge() {
  const badge = document.getElementById('nav-bookmark-count');
  if (badge) {
    badge.textContent = state.bookmarks.length;
    badge.style.display = state.bookmarks.length > 0 ? 'flex' : 'none';
  }
}

function renderBookmarkDrawerList() {
  const drawerBody = document.getElementById('bookmarks-drawer-body');
  if (!drawerBody) return;

  const bookmarkedAnimeList = ANIME_DATABASE.filter(a => state.bookmarks.includes(a.id));

  if (bookmarkedAnimeList.length === 0) {
    drawerBody.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 0.75rem; color: var(--text-subtle);">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <p style="font-weight: 600; color: var(--text-main); margin-bottom: 0.25rem;">Belum ada anime tersimpan</p>
        <p style="font-size: 0.85rem;">Klik tombol bookmark di anime favorit Anda untuk mengaksesnya dengan cepat di sini.</p>
      </div>
    `;
    return;
  }

  drawerBody.innerHTML = bookmarkedAnimeList.map(anime => `
    <div style="display: flex; gap: 0.75rem; background-color: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.65rem; align-items: center; margin-bottom: 0.5rem;">
      <img src="${anime.poster}" alt="${anime.title}" style="width: 50px; height: 70px; object-fit: cover; border-radius: var(--radius-sm); flex-shrink: 0;" />
      <div style="flex: 1; overflow: hidden;">
        <h4 style="font-size: 0.9rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${anime.title}</h4>
        <div style="font-size: 0.75rem; color: var(--text-subtle); margin: 0.2rem 0;">
          ★ ${anime.rating} • ${anime.genres[0]} • <span style="color: var(--success);">Resmi</span>
        </div>
        <a href="#watch?id=${anime.id}&ep=1" onclick="document.getElementById('bookmarks-modal').classList.remove('open')" style="color: var(--accent-primary); font-size: 0.8rem; font-weight: 600;">
          Tonton Episode 1
        </a>
      </div>
      <button onclick="toggleBookmark('${anime.id}', null); renderBookmarkDrawerList();" title="Hapus" style="color: var(--text-subtle); background: none; border: none; cursor: pointer; padding: 0.5rem;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `).join('');
}

// Toast Notification
function showToast(message) {
  let container = document.getElementById('toast-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-root';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => toast.remove(), 200);
  }, 2800);
}
