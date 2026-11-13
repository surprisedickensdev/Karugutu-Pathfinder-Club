/**
 * KARUGUTU SDA PATHFINDER CLUB - INTERACTIVE PORTAL APP.JS
 * Complete interactive behavior: Navigation, Lightbox, Audio Player,
 * Registration System, Live Search & Filters, Modals, and Toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBackToTop();
  initLightbox();
  initAudioPlayer();
  initRegistrationForm();
  initResourceCenter();
  initAboutExplorer();
  initContactDonations();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const toggleBtn = document.querySelector('.menu-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');
  const overlay = document.querySelector('.mobile-overlay');

  if (!toggleBtn || !navMenu) return;

  function toggleDrawer() {
    const isOpen = navMenu.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen 
      ? '<i class="fa fa-times" aria-hidden="true"></i>' 
      : '<i class="fa fa-bars" aria-hidden="true"></i>';
  }

  toggleBtn.addEventListener('click', toggleDrawer);

  if (overlay) {
    overlay.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) toggleDrawer();
    });
  }

  // Close drawer on link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) toggleDrawer();
    });
  });

  // Sticky header shadow enhancement
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
      } else {
        header.style.boxShadow = 'var(--shadow-md)';
      }
    });
  }
}

/* ==========================================================================
   2. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   3. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'info', duration = 3200) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
  toast.innerHTML = `<i class="fa ${icon}" aria-hidden="true"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInToast 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ==========================================================================
   4. MODAL UTILITY
   ========================================================================== */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtns = modal.querySelectorAll('[data-close-modal]');
  closeBtns.forEach(btn => {
    btn.onclick = () => closeModal(modalId);
  });

  modal.onclick = (e) => {
    if (e.target === modal) closeModal(modalId);
  };
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.custom-modal.active, .lightbox-modal.active').forEach(m => {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

/* ==========================================================================
   5. INTERACTIVE LIGHTBOX & GALLERY FILTERS (MEDIA.html)
   ========================================================================== */
function initLightbox() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-card'));
  const lightbox = document.getElementById('lightboxModal');
  if (!lightbox || galleryItems.length === 0) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const captionBox = lightbox.querySelector('.lightbox-caption-box');
  const counterBox = lightbox.querySelector('.lightbox-counter');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');
  const zoomBtn = lightbox.querySelector('.lightbox-zoom-btn');
  const downloadBtn = lightbox.querySelector('.lightbox-download-btn');

  let currentIndex = 0;
  let isZoomed = false;

  function getVisibleItems() {
    return galleryItems.filter(item => item.style.display !== 'none');
  }

  function showImage(index) {
    const visible = getVisibleItems();
    if (visible.length === 0) return;
    if (index < 0) index = visible.length - 1;
    if (index >= visible.length) index = 0;
    currentIndex = index;

    const item = visible[currentIndex];
    const imgEl = item.querySelector('img');
    const titleEl = item.querySelector('.gallery-caption') || item.querySelector('p') || item;
    const captionText = item.getAttribute('data-caption') || (titleEl ? titleEl.textContent.trim() : 'Karugutu Pathfinder Gallery');
    const src = imgEl ? imgEl.src : '';

    lightboxImg.src = src;
    lightboxImg.alt = captionText;
    captionBox.textContent = captionText;
    counterBox.textContent = `${currentIndex + 1} / ${visible.length}`;

    if (downloadBtn) {
      downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = src;
        a.download = captionText.replace(/[^a-zA-Z0-9_-]/g, '_') + '.jpg';
        a.click();
      };
    }

    // Reset zoom
    isZoomed = false;
    lightboxImg.style.transform = 'scale(1)';
    if (zoomBtn) zoomBtn.innerHTML = '<i class="fa fa-search-plus" aria-hidden="true"></i>';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const visible = getVisibleItems();
      const idx = visible.indexOf(item);
      if (idx !== -1) {
        showImage(idx);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
  if (closeBtn) closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });

  if (zoomBtn) {
    zoomBtn.addEventListener('click', () => {
      isZoomed = !isZoomed;
      lightboxImg.style.transform = isZoomed ? 'scale(1.6)' : 'scale(1)';
      lightboxImg.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
      zoomBtn.innerHTML = isZoomed 
        ? '<i class="fa fa-search-minus" aria-hidden="true"></i>' 
        : '<i class="fa fa-search-plus" aria-hidden="true"></i>';
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Gallery Filters
  const filterPills = document.querySelectorAll('.gallery-filter-pill');
  const searchInput = document.getElementById('gallerySearchInput');

  function filterGallery() {
    const activePill = document.querySelector('.gallery-filter-pill.active');
    const selectedCategory = activePill ? activePill.getAttribute('data-filter') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    galleryItems.forEach(item => {
      const cat = item.getAttribute('data-category') || '';
      const text = item.textContent.toLowerCase();
      const matchesCategory = selectedCategory === 'all' || cat === selectedCategory;
      const matchesQuery = !query || text.includes(query);

      if (matchesCategory && matchesQuery) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });

    const visibleCount = getVisibleItems().length;
    const countEl = document.getElementById('galleryCountDisplay');
    if (countEl) countEl.textContent = `Showing ${visibleCount} photos`;
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterGallery();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterGallery);
  }
}

/* ==========================================================================
   6. CUSTOM AUDIO PLAYER DASHBOARD (MEDIA.html)
   ========================================================================== */
function initAudioPlayer() {
  const playerContainer = document.querySelector('.audio-dashboard');
  if (!playerContainer) return;

  const audio = new Audio();
  audio.preload = 'metadata';

  const hymnsPlaylist = [
    { title: 'Enzighu Audio', artist: 'Karugutu SDA Pathfinder Club', src: 'ENZIGHU_audio_by_KARUGUTU_SDA_CHURCH_PATHFINDER_CLUB.mp3' },
    { title: 'Ekigho', artist: 'Karugutu Youth Choir', src: 'Ekigho.mp3' },
    { title: 'I Will Go - Camporee Song', artist: 'MTR Children & Pathfinders', src: "I_WILL_GO__MTR CHILDREN'S PROGRAM_PATHFINDER_CAMPOREE_2025(256k).mp3" },
    { title: 'Wedding Day Celebration', artist: 'Namboole High School Choir', src: 'WEDDING_DAY_BY_NAMBOOLE_HIGH_SCH(128k).mp3' },
    { title: 'Ntucikintege', artist: 'J.A. Choir', src: 'ntucikintege j a choir.mp3' },
    { title: 'I Will Follow', artist: 'Chris Tomlin', src: 'Chris Tomlin - I Will Follow.mp3' }
  ];

  const beatsPlaylist = [
    { title: 'Karugutu March Pass Instrumental', artist: 'Karugutu Brass & Drums', src: 'instrumental karugutu pathfinders march pass.mp3' },
    { title: 'Pathfinder Beats Instrumental 2021', artist: 'Parade Marching Band', src: 'PATHFINDER_BEATS_INSTRUMENTAL____NEW_2021(256k).mp3' },
    { title: 'Stand Up For Jesus Instrumental', artist: 'East-Central Africa Division Parade', src: 'Stand_up_for_Jesus_Instrumental__Amazing_Pathfinder_Parade___Marching_East-Central_Africa_Division(256k).mp3' },
    { title: 'Slow Match Drill', artist: 'Honor Drill Cadence', src: 'Slow match 1_014307.mp3' },
    { title: 'Pathfinder Classic Cadence Beat', artist: 'Pathfinder Drumline', src: 'MUSIC/Pathfinder_beat(256k).mp3' }
  ];

  let currentCategory = 'hymns';
  let currentPlaylist = hymnsPlaylist;
  let currentTrackIdx = 0;

  const playPauseBtn = document.getElementById('audioPlayPauseBtn');
  const prevTrackBtn = document.getElementById('audioPrevBtn');
  const nextTrackBtn = document.getElementById('audioNextBtn');
  const titleDisplay = document.getElementById('audioTrackTitle');
  const artistDisplay = document.getElementById('audioTrackArtist');
  const discEl = document.getElementById('audioDiscVisual');
  const progressBar = document.getElementById('audioProgressFill');
  const progressWrapper = document.getElementById('audioProgressBarWrapper');
  const currentTimeEl = document.getElementById('audioCurrentTime');
  const durationTimeEl = document.getElementById('audioDurationTime');
  const volumeSlider = document.getElementById('audioVolumeSlider');
  const muteBtn = document.getElementById('audioMuteBtn');
  const playlistContainer = document.getElementById('audioPlaylistItems');
  const tabHymns = document.getElementById('tabHymnsBtn');
  const tabBeats = document.getElementById('tabBeatsBtn');

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function renderPlaylist() {
    if (!playlistContainer) return;
    playlistContainer.innerHTML = '';
    currentPlaylist.forEach((track, idx) => {
      const item = document.createElement('div');
      item.className = `playlist-item ${idx === currentTrackIdx ? 'active' : ''}`;
      item.innerHTML = `
        <div class="playlist-item-left">
          <span class="track-index">${idx + 1}</span>
          <div>
            <div class="track-name">${track.title}</div>
            <div style="font-size:0.75rem; color:#94a3b8;">${track.artist}</div>
          </div>
        </div>
        <div class="track-status-icon">
          ${idx === currentTrackIdx && !audio.paused ? '<i class="fa fa-volume-up" aria-hidden="true"></i>' : '<i class="fa fa-play-circle" aria-hidden="true"></i>'}
        </div>
      `;
      item.addEventListener('click', () => {
        loadTrack(idx, true);
      });
      playlistContainer.appendChild(item);
    });
  }

  function loadTrack(idx, autoPlay = false) {
    if (idx < 0) idx = currentPlaylist.length - 1;
    if (idx >= currentPlaylist.length) idx = 0;
    currentTrackIdx = idx;
    const track = currentPlaylist[currentTrackIdx];

    audio.src = track.src;
    if (titleDisplay) titleDisplay.textContent = track.title;
    if (artistDisplay) artistDisplay.textContent = track.artist;
    if (progressBar) progressBar.style.width = '0%';
    if (currentTimeEl) currentTimeEl.textContent = '00:00';

    renderPlaylist();

    if (autoPlay) {
      audio.play().then(() => {
        updatePlayState(true);
      }).catch(err => console.log('Audio autoplay prevented:', err));
    } else {
      updatePlayState(false);
    }
  }

  function updatePlayState(isPlaying) {
    if (playPauseBtn) {
      playPauseBtn.innerHTML = isPlaying 
        ? '<i class="fa fa-pause" aria-hidden="true"></i>' 
        : '<i class="fa fa-play" aria-hidden="true"></i>';
    }
    if (discEl) {
      if (isPlaying) discEl.classList.add('playing');
      else discEl.classList.remove('playing');
    }
    renderPlaylist();
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => updatePlayState(true)).catch(console.error);
      } else {
        audio.pause();
        updatePlayState(false);
      }
    });
  }

  if (prevTrackBtn) {
    prevTrackBtn.addEventListener('click', () => loadTrack(currentTrackIdx - 1, true));
  }

  if (nextTrackBtn) {
    nextTrackBtn.addEventListener('click', () => loadTrack(currentTrackIdx + 1, true));
  }

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    if (durationTimeEl) durationTimeEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', () => {
    loadTrack(currentTrackIdx + 1, true);
  });

  if (progressWrapper) {
    progressWrapper.addEventListener('click', (e) => {
      const rect = progressWrapper.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      if (audio.duration) {
        audio.currentTime = (clickX / width) * audio.duration;
      }
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      audio.volume = e.target.value;
      if (muteBtn) {
        muteBtn.innerHTML = audio.volume == 0 
          ? '<i class="fa fa-volume-off" aria-hidden="true"></i>' 
          : '<i class="fa fa-volume-up" aria-hidden="true"></i>';
      }
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      muteBtn.innerHTML = audio.muted 
        ? '<i class="fa fa-volume-off" aria-hidden="true"></i>' 
        : '<i class="fa fa-volume-up" aria-hidden="true"></i>';
    });
  }

  if (tabHymns && tabBeats) {
    tabHymns.addEventListener('click', () => {
      tabHymns.classList.add('active');
      tabBeats.classList.remove('active');
      currentCategory = 'hymns';
      currentPlaylist = hymnsPlaylist;
      loadTrack(0, false);
    });

    tabBeats.addEventListener('click', () => {
      tabBeats.classList.add('active');
      tabHymns.classList.remove('active');
      currentCategory = 'beats';
      currentPlaylist = beatsPlaylist;
      loadTrack(0, false);
    });
  }

  // Initial load
  loadTrack(0, false);
}

/* ==========================================================================
   7. SMART REGISTRATION APPLICATION (JOIN US.html)
   ========================================================================== */
function initRegistrationForm() {
  const form = document.getElementById('pathfinderRegistrationForm');
  if (!form) return;

  const ageInput = document.getElementById('regAge');
  const dobInput = document.getElementById('regDOB');
  const classRecommendationText = document.getElementById('recommendedClassText');
  const classSelect = document.getElementById('regClass');

  function recommendClass(age) {
    let recommendation = '';
    let classVal = '';

    if (age < 10) {
      recommendation = 'Adventurer Club (Ages 4-9: Little Lamb to Helping Hand)';
      classVal = 'Adventurer';
    } else if (age === 10) {
      recommendation = 'Friend Class (10 Years Old)';
      classVal = 'Friend';
    } else if (age === 11) {
      recommendation = 'Companion Class (11 Years Old)';
      classVal = 'Companion';
    } else if (age === 12) {
      recommendation = 'Explorer Class (12 Years Old)';
      classVal = 'Explorer';
    } else if (age === 13) {
      recommendation = 'Ranger Class (13 Years Old)';
      classVal = 'Ranger';
    } else if (age === 14) {
      recommendation = 'Voyager Class (14 Years Old)';
      classVal = 'Voyager';
    } else if (age === 15) {
      recommendation = 'Guide Class (15 Years Old)';
      classVal = 'Guide';
    } else {
      recommendation = 'Senior Youth / Master Guide Trainee (16+ Years)';
      classVal = 'Master Guide Trainee';
    }

    if (classRecommendationText) {
      classRecommendationText.innerHTML = `<strong>Suggested Unit:</strong> <span style="color:var(--primary); font-weight:700;">${recommendation}</span>`;
    }
    if (classSelect && classVal) {
      for (let i = 0; i < classSelect.options.length; i++) {
        if (classSelect.options[i].value === classVal) {
          classSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  if (ageInput) {
    ageInput.addEventListener('input', () => {
      const age = parseInt(ageInput.value, 10);
      if (!isNaN(age) && age > 0) {
        recommendClass(age);
      }
    });
  }

  if (dobInput) {
    dobInput.addEventListener('change', () => {
      const birthDate = new Date(dobInput.value);
      if (!isNaN(birthDate)) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        if (ageInput) ageInput.value = age;
        recommendClass(age);
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = form.querySelector('[name="fullname"]').value.trim();
    const age = ageInput ? ageInput.value : '';
    const gender = form.querySelector('[name="gender"]:checked')?.value || 'Not specified';
    const phone = form.querySelector('[name="phone"]').value.trim();
    const guardian = form.querySelector('[name="guardian"]').value.trim();
    const chosenClass = classSelect ? classSelect.value : 'Friend';
    const interests = Array.from(form.querySelectorAll('[name="interests"]:checked')).map(cb => cb.value);

    if (!fullName) {
      showToast('Please enter your full name', 'info');
      return;
    }

    const regId = 'KPC-' + Math.floor(1000 + Math.random() * 9000);

    // Populate confirmation modal
    const modal = document.getElementById('regSuccessModal');
    if (modal) {
      document.getElementById('slipRegId').textContent = regId;
      document.getElementById('slipFullName').textContent = fullName;
      document.getElementById('slipAge').textContent = `${age} years (${gender})`;
      document.getElementById('slipClass').textContent = chosenClass;
      document.getElementById('slipPhone').textContent = phone || 'N/A';
      document.getElementById('slipGuardian').textContent = guardian || 'N/A';
      document.getElementById('slipInterests').textContent = interests.join(', ') || 'General Club Activities';
      document.getElementById('slipDate').textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

      // WhatsApp direct sharing link
      const shareBtn = document.getElementById('slipWhatsAppBtn');
      if (shareBtn) {
        const text = encodeURIComponent(
          `Hello Director Kalsmart Joel,\nI have registered for Karugutu SDA Pathfinder Club!\n\nReg ID: ${regId}\nName: ${fullName}\nAssigned Unit: ${chosenClass}\nPhone: ${phone}\nGuardian: ${guardian}\nInterests: ${interests.join(', ')}`
        );
        shareBtn.href = `https://wa.me/256788445652?text=${text}`;
      }

      openModal('regSuccessModal');
      showToast('Registration submitted successfully!', 'success');
      form.reset();
    }
  });
}

/* ==========================================================================
   8. RESOURCE CENTER SEARCH & PREVIEW (RESOURCES.html)
   ========================================================================== */
function initResourceCenter() {
  const resourceItems = Array.from(document.querySelectorAll('.resource-card'));
  const searchInput = document.getElementById('resourceSearchInput');
  const filterPills = document.querySelectorAll('.resource-filter-pill');

  if (resourceItems.length === 0) return;

  function filterResources() {
    const activePill = document.querySelector('.resource-filter-pill.active');
    const category = activePill ? activePill.getAttribute('data-filter') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let visibleCount = 0;
    resourceItems.forEach(item => {
      const itemCat = item.getAttribute('data-category') || '';
      const text = item.textContent.toLowerCase();
      const matchesCat = category === 'all' || itemCat === category;
      const matchesQuery = !query || text.includes(query);

      if (matchesCat && matchesQuery) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    const countDisplay = document.getElementById('resourceCountDisplay');
    if (countDisplay) {
      countDisplay.textContent = `Showing ${visibleCount} of ${resourceItems.length} resources`;
    }
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterResources();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterResources);
  }

  // Interactive PDF Preview Modal
  const previewBtns = document.querySelectorAll('[data-preview-pdf]');
  previewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pdfUrl = btn.getAttribute('data-preview-pdf');
      const title = btn.getAttribute('data-title') || 'Document Preview';

      const modal = document.getElementById('pdfPreviewModal');
      const iframe = document.getElementById('pdfPreviewIframe');
      const titleEl = document.getElementById('pdfPreviewTitle');
      const directDownload = document.getElementById('pdfModalDownloadBtn');

      if (modal && iframe) {
        iframe.src = pdfUrl;
        if (titleEl) titleEl.textContent = title;
        if (directDownload) directDownload.href = pdfUrl;
        openModal('pdfPreviewModal');
      } else {
        window.open(pdfUrl, '_blank');
      }
    });
  });
}

/* ==========================================================================
   9. INTERACTIVE ABOUT EXPLORER & ANTHEM (ABOUT US.html)
   ========================================================================== */
function initAboutExplorer() {
  // Interactive 8 Laws Flip/Expand Cards
  const lawCards = document.querySelectorAll('.law-card');
  lawCards.forEach(card => {
    card.addEventListener('click', () => {
      const isExpanded = card.classList.toggle('expanded');
      const details = card.querySelector('.law-details');
      if (details) {
        details.style.display = isExpanded ? 'block' : 'none';
      }
    });
  });

  // Interactive Anthem Sing-along Audio
  const playAnthemBtn = document.getElementById('playAnthemBtn');
  if (playAnthemBtn) {
    let anthemAudio = null;
    playAnthemBtn.addEventListener('click', () => {
      if (!anthemAudio) {
        anthemAudio = new Audio('Stand_up_for_Jesus_Instrumental__Amazing_Pathfinder_Parade___Marching_East-Central_Africa_Division(256k).mp3');
        anthemAudio.addEventListener('ended', () => {
          playAnthemBtn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i> Play Anthem Instrumental';
        });
      }

      if (anthemAudio.paused) {
        anthemAudio.play();
        playAnthemBtn.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i> Pause Anthem Instrumental';
        showToast('Playing Pathfinder Anthem Instrumental', 'info');
      } else {
        anthemAudio.pause();
        playAnthemBtn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i> Play Anthem Instrumental';
      }
    });
  }
}

/* ==========================================================================
   10. STAFF DIRECTORY & COPY DONATION NUMBER (STAFF & CONTACT.html)
   ========================================================================== */
function initContactDonations() {
  const copyButtons = document.querySelectorAll('[data-copy-number]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const number = btn.getAttribute('data-copy-number');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(number).then(() => {
          showToast(`Copied ${number} to clipboard!`, 'success');
        }).catch(() => fallbackCopy(number));
      } else {
        fallbackCopy(number);
      }
    });
  });

  function fallbackCopy(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    showToast(`Copied ${text} to clipboard!`, 'success');
  }

  // Contact Form submit
  const contactForm = document.getElementById('staffContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value.trim();
      const message = contactForm.querySelector('[name="message"]').value.trim();
      const phone = contactForm.querySelector('[name="phone"]').value.trim();

      if (!name || !message) {
        showToast('Please fill in your name and message.', 'info');
        return;
      }

      const whatsappText = encodeURIComponent(`Hello Karugutu SDA Pathfinder Leadership,\nMy name is ${name} (${phone || 'No phone'}).\nMessage: ${message}`);
      window.open(`https://wa.me/256788445652?text=${whatsappText}`, '_blank');
      showToast('Thank you! Redirecting to WhatsApp...', 'success');
      contactForm.reset();
    });
  }
}
