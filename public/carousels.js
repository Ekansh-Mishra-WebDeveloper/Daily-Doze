// carousels.js – Carousel initialization for members, gallery, reels, reviews
// All carousels support auto-slide (3 sec), pause on manual interaction (6 sec), arrows, and dots.

// Helper: escape HTML to prevent injection
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ========== MEMBERS CAROUSEL (first 5 members) ==========
export function initMembersCarousel(members) {
  const container = document.getElementById('membersCarouselItems');
  if (!container) return;
  const firstFive = members.slice(0, 5);
  if (!firstFive.length) {
    container.innerHTML = '<div class="carousel-item">No members yet.</div>';
    return;
  }
  container.innerHTML = firstFive.map(m => `
    <div class="carousel-item">
      <div class="member-card">
        <img class="member-avatar" src="${m.photoUrl}" alt="${m.name}">
        <div class="member-name">${escapeHtml(m.name)}</div>
        <div class="member-role">${escapeHtml(m.position || 'Member')}</div>
        <div class="member-age">${m.age} years old</div>
        <div class="member-bio">“${escapeHtml(m.feedback || 'No feedback yet.')}”</div>
      </div>
    </div>
  `).join('');
  setupCarousel('membersCarouselItems', 'membersPrevBtn', 'membersNextBtn', 'membersDots', firstFive.length);
}

// ========== GALLERY CAROUSEL ==========
export function initGalleryCarousel(images) {
  const track = document.getElementById('galleryTrack');
  if (!track) return;
  if (!images.length) {
    track.innerHTML = '<div class="carousel-slide">No images</div>';
    return;
  }
  track.innerHTML = images.map(img => `
    <div class="carousel-slide">
      <img src="${img}" alt="gallery">
    </div>
  `).join('');
  setupCarouselTrack('galleryTrack', 'galleryPrevBtn', 'galleryNextBtn', 'galleryDots', images.length);
}

// ========== REELS CAROUSEL ==========
export function initReelsCarousel(reels) {
  const track = document.getElementById('reelsTrack');
  if (!track) return;
  if (!reels.length) {
    track.innerHTML = '<div class="carousel-slide">No reels</div>';
    return;
  }
  track.innerHTML = reels.map(r => `
    <div class="carousel-slide">
      <video src="${r.videoUrl}" controls muted></video>
    </div>
  `).join('');
  setupCarouselTrack('reelsTrack', 'reelsPrevBtn', 'reelsNextBtn', 'reelsDots', reels.length);
}

// ========== REVIEWS CAROUSEL ==========
export function initReviewsCarousel(reviews) {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;
  if (!reviews.length) {
    track.innerHTML = '<div class="carousel-slide">No reviews</div>';
    return;
  }
  track.innerHTML = reviews.map(r => `
    <div class="carousel-slide">
      <div class="review-card">
        <img class="review-avatar" src="${r.photoUrl}">
        <div class="review-name">${escapeHtml(r.name)}</div>
        <div class="review-stars">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
        <div class="review-text">“${escapeHtml(r.review)}”</div>
      </div>
    </div>
  `).join('');
  setupCarouselTrack('reviewsTrack', 'reviewsPrevBtn', 'reviewsNextBtn', 'reviewsDots', reviews.length);
}

// ========== GENERIC CAROUSEL SETUP (for items container) ==========
function setupCarousel(itemsId, prevId, nextId, dotsId, total) {
  let current = 0;
  let transitioning = false;
  let autoTimer = null;
  let pauseTimer = null;
  const itemsContainer = document.getElementById(itemsId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);

  function update(instant = false) {
    if (instant) itemsContainer.style.transition = 'none';
    else itemsContainer.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
    itemsContainer.style.transform = `translateX(-${current * 100}%)`;
    if (instant) itemsContainer.offsetHeight;
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === current) dot.classList.add('active');
      dot.addEventListener('click', () => {
        if (!transitioning) {
          goTo(i);
          resetAutoSlide();
        }
      });
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    if (transitioning) return;
    transitioning = true;
    current = index;
    update(false);
    setTimeout(() => transitioning = false, 500);
  }

  function next() {
    goTo((current + 1) % total);
  }

  function prev() {
    goTo((current - 1 + total) % total);
  }

  function startAutoSlide() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!transitioning) next();
    }, 3000);
  }

  function resetAutoSlide() {
    if (pauseTimer) clearTimeout(pauseTimer);
    if (autoTimer) clearInterval(autoTimer);
    pauseTimer = setTimeout(() => startAutoSlide(), 6000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoSlide(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoSlide(); });

  startAutoSlide();
  update(true);
}

// ========== GENERIC CAROUSEL SETUP (for track‑based carousels) ==========
function setupCarouselTrack(trackId, prevId, nextId, dotsId, total) {
  let current = 0;
  let transitioning = false;
  let autoTimer = null;
  let pauseTimer = null;
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);

  function update(instant = false) {
    if (instant) track.style.transition = 'none';
    else track.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
    track.style.transform = `translateX(-${current * 100}%)`;
    if (instant) track.offsetHeight;
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === current) dot.classList.add('active');
      dot.addEventListener('click', () => {
        if (!transitioning) {
          goTo(i);
          resetAutoSlide();
        }
      });
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    if (transitioning) return;
    transitioning = true;
    current = index;
    update(false);
    setTimeout(() => transitioning = false, 500);
  }

  function next() {
    goTo((current + 1) % total);
  }

  function prev() {
    goTo((current - 1 + total) % total);
  }

  function startAutoSlide() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!transitioning) next();
    }, 3000);
  }

  function resetAutoSlide() {
    if (pauseTimer) clearTimeout(pauseTimer);
    if (autoTimer) clearInterval(autoTimer);
    pauseTimer = setTimeout(() => startAutoSlide(), 6000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoSlide(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoSlide(); });

  startAutoSlide();
  update(true);
}