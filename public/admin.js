// ==================== PWA INSTALL LOGIC FOR ADMIN ====================
let deferredAdminPrompt;
const installAdminBtn = document.getElementById('installAdminAppBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredAdminPrompt = e;
  if (installAdminBtn) installAdminBtn.style.display = 'inline-block';
});

if (installAdminBtn) {
  installAdminBtn.addEventListener('click', () => {
    if (deferredAdminPrompt) {
      deferredAdminPrompt.prompt();
      deferredAdminPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Admin accepted install');
        }
        deferredAdminPrompt = null;
      });
    } else {
      alert('Your browser does not support app installation. You can manually add this site to your home screen.');
    }
  });
}

// ==================== ADMIN LOGIC WITH AUTHENTICATION ====================
const API_BASE = '/api';
let adminToken = localStorage.getItem('adminToken');
let isAuthenticated = !!adminToken;

function getAuthHeaders() {
  return adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {};
}

async function fetchJSON(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers
  };
  try {
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      localStorage.removeItem('adminToken');
      adminToken = null;
      isAuthenticated = false;
      showLoginModal();
      return null;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

function showLoginModal() {
  if (document.querySelector('.login-modal')) return;
  const modal = document.createElement('div');
  modal.className = 'login-modal';
  modal.innerHTML = `
    <div class="login-card">
      <h2 style="color:#FF6B00;">Admin Login</h2>
      <input type="email" id="loginEmail" placeholder="Email" autocomplete="email">
      <input type="password" id="loginPassword" placeholder="Password" autocomplete="current-password">
      <button id="loginSubmitBtn">Login</button>
      <div id="loginError" class="error-msg"></div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('loginSubmitBtn').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        adminToken = data.token;
        isAuthenticated = true;
        localStorage.setItem('adminToken', adminToken);
        modal.remove();
        location.reload();
      } else {
        document.getElementById('loginError').innerText = data.error || 'Invalid credentials';
      }
    } catch (err) {
      document.getElementById('loginError').innerText = 'Login failed';
    }
  });
}

if (!isAuthenticated) {
  showLoginModal();
}

const DEFAULT_PROFILE = "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette_719432-3512.jpg?semt=ais_hybrid&w=740&q=80";
const DEFAULT_IMAGE = "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600";
const DEFAULT_GALLERY_IMAGES = [
  "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/260447/pexels-photo-260447.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/6457569/pexels-photo-6457569.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600"
];
const DEFAULT_REVIEWER_AVATARS = [
  DEFAULT_PROFILE,
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg"
];

function showToast(msg, isError = false) {
  const toast = document.getElementById('adminToast');
  toast.innerText = msg;
  toast.style.borderLeftColor = isError ? '#e74c3c' : '#FF6B00';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function confirmAction(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmModal');
    document.getElementById('confirmMessage').innerText = message;
    modal.style.display = 'flex';
    const yesBtn = document.getElementById('confirmYesBtn');
    const noBtn = document.getElementById('confirmNoBtn');
    const cleanup = () => {
      yesBtn.removeEventListener('click', yesHandler);
      noBtn.removeEventListener('click', noHandler);
      modal.style.display = 'none';
    };
    const yesHandler = () => { cleanup(); resolve(true); };
    const noHandler = () => { cleanup(); resolve(false); };
    yesBtn.addEventListener('click', yesHandler);
    noBtn.addEventListener('click', noHandler);
  });
}

const defaultPayloads = {
  trainer: { name: "New Trainer", position: "Fitness Coach", photoUrl: DEFAULT_PROFILE, bio: "Experienced trainer", whatsappNumber: "1234567890", instagramUrl: "https://instagram.com/newtrainer" },
  transformation: { beforeImage: DEFAULT_IMAGE, afterImage: DEFAULT_IMAGE },
  member: { name: "New Member", photoUrl: DEFAULT_PROFILE, age: 25, since: new Date().getFullYear().toString(), experience: "beginner", goal: "musclegain", featured: false, status: "active", feeStatus: "paid", position: "Member", feedback: "Great gym!" },
  dietPlan: { title: "New Diet Plan", imageUrl: DEFAULT_IMAGE, shortDescription: "Balanced nutrition", targets: ["Healthy Eating"] },
  workoutPlan: { title: "New Workout Plan", imageUrl: DEFAULT_IMAGE, shortDescription: "Full body workout", targets: ["Strength"] },
  membership: { planName: "New Plan", price: 1999, duration: "month", description: "Full access" },
  product: { name: "New Product", imageUrl: DEFAULT_IMAGE, price: 499, shortDescription: "High quality", category: "supplements", inStock: true },
  reel: { videoUrl: "https://videos.pexels.com/video-files/4349242/4349242-uhd_2560_1440_25fps.mp4", thumbnail: DEFAULT_IMAGE },
  review: { name: "New Review", photoUrl: DEFAULT_PROFILE, review: "Amazing experience!", rating: 5 }
};

const endpoints = {
  trainer: '/api/trainers',
  transformation: '/api/transformations',
  member: '/api/members',
  dietPlan: '/api/dietplans',
  workoutPlan: '/api/workoutplans',
  membership: '/api/memberships',
  product: '/api/products',
  reel: '/api/reels',
  review: '/api/reviews',
  gallery: '/api/gallery'
};

let siteSettings = {};
let stats = { membersCount: 1500, trainersCount: 20, transformationsCount: 500 };
let trainers = [], transformations = [], members = [], dietPlans = [], workoutPlans = [], memberships = [], products = [], galleryImages = [], reels = [], reviews = [], contactInfo = {};

let sectionHeadings = {
  trainersHeading: "Gym Trainers",
  transformationsHeading: "Transformations",
  membersHeading: "Gym Members",
  dietHeading: "Diet Plans",
  workoutHeading: "Workout Plan",
  membershipHeading: "Gym Membership",
  shopHeading: "Daily Doze Shop",
  galleryHeading: "Daily Doze Gallery",
  reelsHeading: "Daily Doze Reels",
  reviewsHeading: "Reviews"
};

async function loadAllData() {
  const [settings, statsRes, trainersRes, transRes, membersRes, dietRes, workoutRes, membershipRes, productsRes, galleryRes, reelsRes, reviewsRes, contactRes] = await Promise.all([
    fetchJSON(`${API_BASE}/sitesettings`),
    fetchJSON(`${API_BASE}/stats`),
    fetchJSON(`${API_BASE}/trainers`),
    fetchJSON(`${API_BASE}/transformations`),
    fetchJSON(`${API_BASE}/members`),
    fetchJSON(`${API_BASE}/dietplans`),
    fetchJSON(`${API_BASE}/workoutplans`),
    fetchJSON(`${API_BASE}/memberships`),
    fetchJSON(`${API_BASE}/products`),
    fetchJSON(`${API_BASE}/gallery`),
    fetchJSON(`${API_BASE}/reels`),
    fetchJSON(`${API_BASE}/reviews`),
    fetchJSON(`${API_BASE}/contactinfo`)
  ]);
  if (settings) siteSettings = settings;
  if (statsRes) stats = statsRes;
  if (trainersRes) trainers = trainersRes;
  if (transRes) transformations = transRes;
  if (membersRes) members = membersRes;
  if (dietRes) dietPlans = dietRes;
  if (workoutRes) workoutPlans = workoutRes;
  if (membershipRes) memberships = membershipRes;
  if (productsRes) products = productsRes;
  if (galleryRes && galleryRes.images && galleryRes.images.length) galleryImages = galleryRes.images;
  else galleryImages = [...DEFAULT_GALLERY_IMAGES];
  if (reelsRes) reels = reelsRes;
  if (reviewsRes) reviews = reviewsRes;
  if (contactRes) contactInfo = contactRes;
}

function renderHero() {
  document.getElementById('heroLogo').src = siteSettings.logoUrl || 'DailyDoze logo.png';
  document.getElementById('heroSubheading').innerText = siteSettings.heroSubheading || 'The Standard of Strength';
  document.getElementById('liveStatusText').innerText = siteSettings.liveStatusText || 'Open Now – Closing at 10 PM';
  document.getElementById('floatingCtaBtn').innerText = siteSettings.floatingButtonText || 'Book 3-Day Free Trial';
  const brandEl = document.getElementById('heroBrandText');
  if (brandEl && siteSettings.heroBrand) brandEl.innerText = siteSettings.heroBrand;
  else if (brandEl) brandEl.innerText = 'DAILY DOZE';
  const heroBg = document.querySelector('.hero .hero-video-wrapper');
  if (siteSettings.heroBackgroundImage && heroBg) {
    heroBg.style.backgroundImage = `url('${siteSettings.heroBackgroundImage}')`;
    heroBg.style.backgroundSize = 'cover';
    heroBg.style.backgroundPosition = 'center';
  }
}

function renderStats() {
  document.getElementById('statMembers').innerText = stats.membersCount || 1500;
  document.getElementById('statTrainers').innerText = stats.trainersCount || 20;
  document.getElementById('statTransformations').innerText = stats.transformationsCount || 500;
}

function renderTrainers() {
  const container = document.getElementById('trainersContainer');
  if (!container) return;
  container.innerHTML = trainers.map(t => `
    <div class="leader-card" data-id="${t._id}" data-type="trainer">
      <img src="${t.photoUrl}" class="trainer-img">
      <h3>${escapeHtml(t.name)}</h3>
      <p>${escapeHtml(t.position)}</p>
      <div class="trainer-socials">
        <a href="https://wa.me/${t.whatsappNumber}" target="_blank" class="social-icon whatsapp"><i class="fab fa-whatsapp"></i></a>
        <a href="${t.instagramUrl}" target="_blank" class="social-icon instagram"><i class="fab fa-instagram"></i></a>
      </div>
      <button class="btn-outline-gold view-profile-btn" data-id="${t._id}">View Profile</button>
      <button class="card-update-btn" data-type="trainer" data-id="${t._id}">✏️ Update</button>
    </div>
  `).join('');
  attachUpdateButtons();
  document.querySelectorAll('.view-profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      const trainer = trainers.find(t => t._id === id);
      if (trainer) showTrainerProfile(trainer);
    });
  });
}

function showTrainerProfile(trainer) {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="premium-modal-card">
      <div style="text-align:center;">
        <img src="${trainer.photoUrl}" style="width:120px;height:120px;border-radius:50%;border:2px solid #FF6B00;margin-bottom:1rem;">
        <h2 style="color:#FF6B00;">${escapeHtml(trainer.name)}</h2>
        <p style="color:#bbb;">${escapeHtml(trainer.position)}</p>
        <p style="line-height:1.5;margin-top:1rem;">${escapeHtml(trainer.bio || 'No bio available.')}</p>
      </div>
      <div class="modal-buttons">
        <button class="modal-btn-cancel" id="closeProfileBtn">Close</button>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
  document.getElementById('closeProfileBtn').onclick = () => modal.style.display = 'none';
}

function renderTransformations() {
  const container = document.getElementById('transformationsContainer');
  if (!container) return;
  container.innerHTML = transformations.map(t => `
    <div class="trans-card" data-id="${t._id}" data-type="transformation">
      <div class="luxury-comparison-slider" data-before="${t.afterImage}" data-after="${t.beforeImage}">
        <div class="comparison-images"><img class="before-image"><div class="after-image-container"><img class="after-image"></div></div>
        <div class="slider-handle" style="left:50%"><div class="vertical-line"></div><div class="handle-circle"><i class="fas fa-arrows-alt-h"></i></div></div>
        <div class="comparison-label before-label">BEFORE</div><div class="comparison-label after-label">AFTER</div>
      </div>
      <button class="btn-see-more">See more</button>
      <button class="card-update-btn" data-type="transformation" data-id="${t._id}">✏️ Update</button>
    </div>
  `).join('');
  document.querySelectorAll('.luxury-comparison-slider').forEach(slider => initLuxurySlider(slider));
  attachUpdateButtons();
  document.querySelectorAll('.btn-see-more').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'admin-members.html';
    });
  });
}

function renderMembersCarousel() {
  const container = document.getElementById('membersCarouselItems');
  if (!container) return;
  const items = members.slice(0, 5);
  container.innerHTML = items.map(m => `
    <div class="carousel-item">
      <div class="member-card" data-id="${m._id}" data-type="member">
        <img class="member-avatar" src="${m.photoUrl || DEFAULT_PROFILE}">
        <div class="member-name">${escapeHtml(m.name)}</div>
        <div class="member-role">${escapeHtml(m.position || 'Member')}</div>
        <div class="member-age">${m.age} years old</div>
        <div class="member-bio">“${escapeHtml(m.feedback || 'No feedback')}”</div>
        <button class="card-update-btn" data-type="member" data-id="${m._id}">✏️ Update</button>
      </div>
    </div>
  `).join('');
  attachUpdateButtons();
  setupCarouselWithAuto('membersCarouselItems', 'membersPrevBtn', 'membersNextBtn', 'membersDots', items.length, true);
}

function renderDietPlans() {
  const container = document.getElementById('dietGrid');
  if (!container) return;
  container.innerHTML = dietPlans.map(d => `
    <div class="diet-card" data-id="${d._id}" data-type="dietPlan">
      <div class="diet-card-image"><img src="${d.imageUrl}"></div>
      <div class="diet-card-content">
        <h3>${escapeHtml(d.title)}</h3>
        <p>${escapeHtml(d.shortDescription)}</p>
        <div class="diet-targets">${(d.targets || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
        <button class="btn-outline-gold full-plan-btn">Full Diet Plan</button>
        <button class="card-update-btn" data-type="dietPlan" data-id="${d._id}">✏️ Update</button>
      </div>
    </div>
  `).join('');
  attachUpdateButtons();
  document.querySelectorAll('.full-plan-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'admin-diet.html';
    });
  });
}

function renderWorkoutPlans() {
  const container = document.getElementById('workoutGrid');
  if (!container) return;
  container.innerHTML = workoutPlans.map(w => `
    <div class="workout-card" data-id="${w._id}" data-type="workoutPlan">
      <div class="workout-card-image"><img src="${w.imageUrl}"></div>
      <div class="workout-card-content">
        <h3>${escapeHtml(w.title)}</h3>
        <p>${escapeHtml(w.shortDescription)}</p>
        <div class="workout-targets">${(w.targets || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
        <button class="btn-outline-gold full-workout-btn">Full Workout Plan</button>
        <button class="card-update-btn" data-type="workoutPlan" data-id="${w._id}">✏️ Update</button>
      </div>
    </div>
  `).join('');
  attachUpdateButtons();
  document.querySelectorAll('.full-workout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'admin-workout.html';
    });
  });
}

function renderMemberships() {
  const container = document.getElementById('membershipGrid');
  if (!container) return;
  container.innerHTML = memberships.map(m => `
    <div class="membership-card" data-id="${m._id}" data-type="membership">
      <h3>${escapeHtml(m.planName)}</h3>
      <div class="price">₹${m.price}<span>/${m.duration}</span></div>
      <p>${escapeHtml(m.description)}</p>
      <button class="btn-primary join-now-btn">Join Now</button>
      <button class="card-update-btn" data-type="membership" data-id="${m._id}">✏️ Update</button>
    </div>
  `).join('');
  attachUpdateButtons();
}

function renderProducts() {
  const container = document.getElementById('productsGrid');
  if (!container) return;
  const firstFour = products.slice(0, 4);
  container.innerHTML = firstFour.map(p => `
    <div class="product-card" data-id="${p._id}" data-type="product">
      <img src="${p.imageUrl}">
      <h3>${escapeHtml(p.name)}</h3>
      <p class="price">₹${p.price}</p>
      <button class="btn-gold-whatsapp" data-product="${escapeHtml(p.name)}">Buy Now</button>
      <button class="card-update-btn" data-type="product" data-id="${p._id}">✏️ Update</button>
    </div>
  `).join('');
  attachUpdateButtons();
  document.querySelectorAll('.btn-gold-whatsapp').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const product = btn.getAttribute('data-product');
      window.open(`https://wa.me/?text=Hello%20Daily%20Doze%2C%20I%27m%20interested%20in%20${encodeURIComponent(product)}`, '_blank');
    });
  });
}

let galleryAutoInterval = null;
function renderGalleryCarousel() {
  const track = document.getElementById('galleryTrack');
  if (!track) return;
  track.innerHTML = galleryImages.map((img, idx) => `
    <div class="carousel-slide">
      <img src="${img}" alt="gallery">
      <button class="card-update-btn" data-type="gallery" data-idx="${idx}" style="margin-top:0.5rem;">✏️ Update</button>
    </div>
  `).join('');
  attachUpdateButtons();
  if (galleryAutoInterval) clearInterval(galleryAutoInterval);
  setupCarouselTrackWithAuto('galleryTrack', 'galleryPrevBtn', 'galleryNextBtn', 'galleryDots', galleryImages.length, true);
}

let reelsAutoTimer = null;
function renderReelsCarousel() {
  const track = document.getElementById('reelsTrack');
  if (!track) return;
  track.innerHTML = reels.map((r, idx) => `
    <div class="carousel-slide">
      <video src="${r.videoUrl}" muted playsinline></video>
      <button class="card-update-btn" data-type="reel" data-id="${r._id}" style="margin-top:0.5rem;">✏️ Update</button>
    </div>
  `).join('');
  attachUpdateButtons();
  if (reelsAutoTimer) clearTimeout(reelsAutoTimer);
  setupCarouselTrackWithAuto('reelsTrack', 'reelsPrevBtn', 'reelsNextBtn', 'reelsDots', reels.length, false, true);
}

function renderReviewsCarousel() {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;
  track.innerHTML = reviews.map((r, idx) => `
    <div class="carousel-slide">
      <div class="review-card" data-id="${r._id}" data-type="review">
        <img class="review-avatar" src="${r.photoUrl || DEFAULT_REVIEWER_AVATARS[idx % DEFAULT_REVIEWER_AVATARS.length]}">
        <div class="review-name">${escapeHtml(r.name)}</div>
        <div class="review-stars">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
        <div class="review-text">“${escapeHtml(r.review)}”</div>
        <button class="card-update-btn" data-type="review" data-id="${r._id}">✏️ Update</button>
      </div>
    </div>
  `).join('');
  attachUpdateButtons();
  setupCarouselTrackWithAuto('reviewsTrack', 'reviewsPrevBtn', 'reviewsNextBtn', 'reviewsDots', reviews.length, true);
}

function setupCarousel(itemsId, prevId, nextId, dotsId, total) {
  let current = 0;
  const container = document.getElementById(itemsId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);
  if (!container || !total) return;
  function update() {
    container.style.transform = `translateX(-${current * 100}%)`;
    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach((dot, i) => dot.classList.toggle('active', i === current));
    }
  }
  function goTo(i) { current = i; update(); }
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }
  if (prev) prev.onclick = () => goTo((current - 1 + total) % total);
  if (next) next.onclick = () => goTo((current + 1) % total);
  update();
}

function setupCarouselWithAuto(itemsId, prevId, nextId, dotsId, total, autoSlide = true) {
  let current = 0;
  const container = document.getElementById(itemsId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);
  if (!container || !total) return;
  let autoInterval = null;

  function update() {
    container.style.transform = `translateX(-${current * 100}%)`;
    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach((dot, i) => dot.classList.toggle('active', i === current));
    }
  }
  function goTo(i) {
    current = i;
    update();
    if (autoSlide) resetAuto();
  }
  function nextSlide() { goTo((current + 1) % total); }
  function prevSlide() { goTo((current - 1 + total) % total); }

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }
  if (prev) prev.onclick = prevSlide;
  if (next) next.onclick = nextSlide;

  if (autoSlide) {
    function startAuto() {
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setInterval(() => {
        nextSlide();
      }, 3000);
    }
    function resetAuto() {
      if (autoInterval) clearInterval(autoInterval);
      startAuto();
    }
    startAuto();
    const carouselMain = container.closest('.carousel-main');
    if (carouselMain) {
      carouselMain.addEventListener('mouseenter', () => {
        if (autoInterval) clearInterval(autoInterval);
      });
      carouselMain.addEventListener('mouseleave', startAuto);
    }
  }
  update();
}

function setupCarouselTrack(trackId, prevId, nextId, dotsId, total) {
  let current = 0;
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);
  if (!track || !total) return;
  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach((dot, i) => dot.classList.toggle('active', i === current));
    }
  }
  function goTo(i) { current = i; update(); }
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }
  if (prev) prev.onclick = () => goTo((current - 1 + total) % total);
  if (next) next.onclick = () => goTo((current + 1) % total);
  update();
}

function setupCarouselTrackWithAuto(trackId, prevId, nextId, dotsId, total, isImageAuto = false, isVideoAuto = false) {
  let current = 0;
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);
  const dotsContainer = document.getElementById(dotsId);
  if (!track || !total) return;
  let autoInterval = null;

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach((dot, i) => dot.classList.toggle('active', i === current));
    }
    if (isVideoAuto) {
      const slides = track.children;
      for (let i = 0; i < slides.length; i++) {
        const video = slides[i].querySelector('video');
        if (video) {
          if (i === current) {
            video.currentTime = 0;
            video.play().catch(e => console.log);
          } else {
            video.pause();
            video.currentTime = 0;
          }
        }
      }
    }
  }

  function goTo(i) {
    if (autoInterval) clearInterval(autoInterval);
    current = i;
    update();
    if (isImageAuto) startAuto();
  }

  function nextSlide() { goTo((current + 1) % total); }
  function prevSlide() { goTo((current - 1 + total) % total); }

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }
  if (prev) prev.onclick = prevSlide;
  if (next) next.onclick = nextSlide;

  if (isImageAuto) {
    function startAuto() {
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setInterval(() => {
        nextSlide();
      }, 3000);
    }
    startAuto();
    const container = track.parentElement.parentElement;
    container.addEventListener('mouseenter', () => { if (autoInterval) clearInterval(autoInterval); });
    container.addEventListener('mouseleave', startAuto);
  }

  if (isVideoAuto) {
    function onVideoEnd() {
      nextSlide();
    }
    function attachVideoEnd() {
      const slides = track.children;
      for (let i = 0; i < slides.length; i++) {
        const video = slides[i].querySelector('video');
        if (video) {
          video.removeEventListener('ended', onVideoEnd);
          if (i === current) {
            video.addEventListener('ended', onVideoEnd);
          }
        }
      }
    }
    const origUpdate = update;
    const newUpdate = () => {
      origUpdate();
      attachVideoEnd();
    };
    track.update = newUpdate;
    update = newUpdate;
    update();
  }
  update();
}

function renderContact() {
  document.getElementById('contactPhone').innerText = contactInfo.phone || '+1 (212) 555-7890';
  document.getElementById('contactWhatsapp').innerText = contactInfo.whatsappNumber || '+1 (212) 555-7891';
  document.getElementById('contactAddress').innerText = contactInfo.address || '123 Strength Avenue, Manhattan, NY 10001, USA';
  document.getElementById('contactFb').href = contactInfo.facebookUrl || '#';
  document.getElementById('contactIg').href = contactInfo.instagramUrl || '#';
}

function initLuxurySlider(slider) {
  const beforeUrl = slider.getAttribute('data-before');
  const afterUrl = slider.getAttribute('data-after');
  const beforeImg = slider.querySelector('.before-image');
  const afterImg = slider.querySelector('.after-image');
  const afterContainer = slider.querySelector('.after-image-container');
  const handle = slider.querySelector('.slider-handle');
  if (!beforeImg || !afterImg) return;
  beforeImg.src = beforeUrl;
  afterImg.src = afterUrl;
  let startX = 0, startPercent = 50, isDragging = false;
  function setPos(percent) {
    percent = Math.min(Math.max(percent, 0), 100);
    afterContainer.style.width = percent + '%';
    handle.style.left = percent + '%';
  }
  function onStart(e) {
    isDragging = true;
    e.preventDefault();
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const rect = slider.getBoundingClientRect();
    const relX = Math.min(Math.max(0, clientX - rect.left), rect.width);
    startPercent = (relX / rect.width) * 100;
    startX = clientX;
  }
  function onMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    let clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const rect = slider.getBoundingClientRect();
    let deltaX = clientX - startX;
    let newPercent = startPercent + (deltaX / rect.width) * 100;
    setPos(newPercent);
  }
  function onEnd() { isDragging = false; }
  handle.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  handle.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd);
  setPos(50);
}

async function addItem(type) {
  if (type === 'gallery') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData
        });
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          adminToken = null;
          isAuthenticated = false;
          showLoginModal();
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.url) {
          const newImages = [...galleryImages, data.url];
          const updateRes = await fetchJSON('/api/gallery', { method: 'PUT', body: JSON.stringify({ images: newImages }) });
          if (updateRes) {
            galleryImages = newImages;
            renderGalleryCarousel();
            showToast('Gallery image added');
          } else showToast('Failed', true);
        } else showToast('Upload failed', true);
      } catch (err) {
        console.error(err);
        showToast('Upload error: ' + err.message, true);
      }
    };
    input.click();
    return;
  }
  const payload = defaultPayloads[type];
  if (!payload) return;
  const confirmed = await confirmAction(`Add a new ${type} with default values?`);
  if (!confirmed) return;
  const res = await fetchJSON(endpoints[type], { method: 'POST', body: JSON.stringify(payload) });
  if (res) {
    showToast(`${type} added successfully`);
    if (type === 'trainer') { trainers = await fetchJSON('/api/trainers') || []; renderTrainers(); }
    else if (type === 'transformation') { transformations = await fetchJSON('/api/transformations') || []; renderTransformations(); }
    else if (type === 'member') { members = await fetchJSON('/api/members') || []; renderMembersCarousel(); }
    else if (type === 'dietPlan') { dietPlans = await fetchJSON('/api/dietplans') || []; renderDietPlans(); }
    else if (type === 'workoutPlan') { workoutPlans = await fetchJSON('/api/workoutplans') || []; renderWorkoutPlans(); }
    else if (type === 'membership') { memberships = await fetchJSON('/api/memberships') || []; renderMemberships(); }
    else if (type === 'product') { products = await fetchJSON('/api/products') || []; renderProducts(); }
    else if (type === 'reel') { reels = await fetchJSON('/api/reels') || []; renderReelsCarousel(); }
    else if (type === 'review') { reviews = await fetchJSON('/api/reviews') || []; renderReviewsCarousel(); }
  } else showToast(`Failed to add ${type}`, true);
}

let currentEditId = null, currentEditType = null;

async function openEditModal(type, id) {
  currentEditId = id;
  currentEditType = type;
  let item = null;
  if (type === 'trainer') item = trainers.find(t => t._id === id);
  else if (type === 'transformation') item = transformations.find(t => t._id === id);
  else if (type === 'member') item = members.find(m => m._id === id);
  else if (type === 'dietPlan') item = dietPlans.find(d => d._id === id);
  else if (type === 'workoutPlan') item = workoutPlans.find(w => w._id === id);
  else if (type === 'membership') item = memberships.find(m => m._id === id);
  else if (type === 'product') item = products.find(p => p._id === id);
  else if (type === 'reel') item = reels.find(r => r._id === id);
  else if (type === 'review') item = reviews.find(r => r._id === id);
  else if (type === 'gallery') {
    const idx = parseInt(id);
    const currentUrl = galleryImages[idx];
    const modal = document.getElementById('modalContainer');
    modal.innerHTML = `
      <div class="premium-modal-card">
        <div class="modal-image-container"><img src="${currentUrl}" class="modal-image"></div>
        <h3>Edit Gallery Image</h3>
        <div class="image-upload-area" id="galleryUploadArea">Upload New Image</div>
        <div class="modal-buttons">
          <button class="modal-delete-btn" id="deleteGalleryBtn">Delete Image</button>
          <button class="modal-btn-cancel" id="cancelBtn">Cancel</button>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
    document.getElementById('cancelBtn').onclick = () => modal.style.display = 'none';
    document.getElementById('deleteGalleryBtn').onclick = async () => {
      if (await confirmAction('Delete this image?')) {
        const newImages = [...galleryImages];
        newImages.splice(idx, 1);
        const res = await fetchJSON('/api/gallery', { method: 'PUT', body: JSON.stringify({ images: newImages }) });
        if (res) {
          galleryImages = newImages;
          renderGalleryCarousel();
          modal.style.display = 'none';
          showToast('Image deleted');
        } else showToast('Delete failed', true);
      }
    };
    document.getElementById('galleryUploadArea').onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
          });
          if (res.status === 401) {
            localStorage.removeItem('adminToken');
            adminToken = null;
            isAuthenticated = false;
            showLoginModal();
            return;
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (data.url) {
            const newImages = [...galleryImages];
            newImages[idx] = data.url;
            const updateRes = await fetchJSON('/api/gallery', { method: 'PUT', body: JSON.stringify({ images: newImages }) });
            if (updateRes) {
              galleryImages = newImages;
              renderGalleryCarousel();
              modal.style.display = 'none';
              showToast('Image updated');
            } else showToast('Update failed', true);
          } else showToast('Upload failed', true);
        } catch (err) {
          showToast('Upload error: ' + err.message, true);
        }
      };
      input.click();
    };
    return;
  }
  if (!item) return;

  let imageHtml = '';
  if (type === 'trainer') imageHtml = `<div class="modal-image-container"><img src="${item.photoUrl}" class="modal-image"></div>`;
  else if (type === 'member') imageHtml = `<div class="modal-image-container"><img src="${item.photoUrl || DEFAULT_PROFILE}" class="modal-image-circle"></div>`;
  else if (type === 'dietPlan' || type === 'workoutPlan' || type === 'product') imageHtml = `<div class="modal-image-container"><img src="${item.imageUrl}" class="modal-image"></div>`;
  else if (type === 'review') imageHtml = `<div class="modal-image-container"><img src="${item.photoUrl || DEFAULT_PROFILE}" class="modal-image-circle"></div>`;

  let fieldsHtml = '';
  if (type === 'trainer') {
    fieldsHtml = `
      <div class="field-group"><label>Name</label><input type="text" id="editName" value="${escapeHtml(item.name)}"></div>
      <div class="field-group"><label>Position</label><input type="text" id="editPosition" value="${escapeHtml(item.position)}"></div>
      <div class="field-group"><label>Bio</label><textarea id="editBio">${escapeHtml(item.bio)}</textarea></div>
      <div class="field-group"><label>WhatsApp</label><input type="text" id="editWhatsapp" value="${escapeHtml(item.whatsappNumber)}"></div>
      <div class="field-group"><label>Instagram URL</label><input type="text" id="editInstagram" value="${escapeHtml(item.instagramUrl)}"></div>
      <div class="image-upload-area" id="imageUpload">Update Photo</div>
    `;
  } else if (type === 'transformation') {
    fieldsHtml = `
      <div class="field-group"><label>Before Image</label><div class="modal-image-container"><img id="beforePreview" src="${item.beforeImage}" class="modal-image"></div><div class="image-upload-area" id="beforeUpload">Upload Before</div></div>
      <div class="field-group"><label>After Image</label><div class="modal-image-container"><img id="afterPreview" src="${item.afterImage}" class="modal-image"></div><div class="image-upload-area" id="afterUpload">Upload After</div></div>
    `;
  } else if (type === 'member') {
    fieldsHtml = `
      <div class="field-group"><label>Name</label><input type="text" id="editName" value="${escapeHtml(item.name)}"></div>
      <div class="field-group"><label>Age</label><input type="number" id="editAge" value="${item.age}"></div>
      <div class="field-group"><label>Position</label><input type="text" id="editPosition" value="${escapeHtml(item.position)}"></div>
      <div class="field-group"><label>Feedback</label><textarea id="editFeedback">${escapeHtml(item.feedback)}</textarea></div>
      <div class="image-upload-area" id="imageUpload">Update Photo</div>
    `;
  } else if (type === 'dietPlan') {
    fieldsHtml = `
      <div class="field-group"><label>Title</label><input type="text" id="editTitle" value="${escapeHtml(item.title)}"></div>
      <div class="field-group"><label>Short Description</label><input type="text" id="editDesc" value="${escapeHtml(item.shortDescription)}"></div>
      <div class="field-group"><label>Targets (comma)</label><input type="text" id="editTargets" value="${(item.targets || []).join(',')}"></div>
      <div class="image-upload-area" id="imageUpload">Update Image</div>
    `;
  } else if (type === 'workoutPlan') {
    fieldsHtml = `
      <div class="field-group"><label>Title</label><input type="text" id="editTitle" value="${escapeHtml(item.title)}"></div>
      <div class="field-group"><label>Short Description</label><input type="text" id="editDesc" value="${escapeHtml(item.shortDescription)}"></div>
      <div class="field-group"><label>Targets (comma)</label><input type="text" id="editTargets" value="${(item.targets || []).join(',')}"></div>
      <div class="image-upload-area" id="imageUpload">Update Image</div>
    `;
  } else if (type === 'membership') {
    fieldsHtml = `
      <div class="field-group"><label>Plan Name</label><input type="text" id="editName" value="${escapeHtml(item.planName)}"></div>
      <div class="field-group"><label>Price</label><input type="number" id="editPrice" value="${item.price}"></div>
      <div class="field-group"><label>Duration</label><input type="text" id="editDuration" value="${escapeHtml(item.duration)}"></div>
      <div class="field-group"><label>Description</label><textarea id="editDesc">${escapeHtml(item.description)}</textarea></div>
    `;
  } else if (type === 'product') {
    fieldsHtml = `
      <div class="field-group"><label>Name</label><input type="text" id="editName" value="${escapeHtml(item.name)}"></div>
      <div class="field-group"><label>Price</label><input type="number" id="editPrice" value="${item.price}"></div>
      <div class="image-upload-area" id="imageUpload">Update Image</div>
    `;
  } else if (type === 'reel') {
    fieldsHtml = `<div class="field-group"><label>Video URL</label><input type="text" id="editUrl" value="${escapeHtml(item.videoUrl)}"></div>`;
  } else if (type === 'review') {
    fieldsHtml = `
      <div class="field-group"><label>Name</label><input type="text" id="editName" value="${escapeHtml(item.name)}"></div>
      <div class="field-group"><label>Review</label><textarea id="editReview">${escapeHtml(item.review)}</textarea></div>
      <div class="field-group"><label>Rating (1-5)</label><input type="number" id="editRating" value="${item.rating}" min="1" max="5"></div>
      <div class="image-upload-area" id="imageUpload">Update Photo</div>
    `;
  }

  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="premium-modal-card">
      <h3>Edit ${type}</h3>
      ${imageHtml}
      ${fieldsHtml}
      <div class="modal-buttons">
        <button class="modal-delete-btn" id="deleteItemBtn">Delete Permanently</button>
        <button class="modal-btn-cancel" id="cancelBtn">Cancel</button>
        <button class="modal-btn-save" id="saveBtn">Save Changes</button>
      </div>
    </div>
  `;
  modal.style.display = 'flex';

  const uploadArea = document.getElementById('imageUpload');
  if (uploadArea) {
    uploadArea.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
          });
          if (res.status === 401) {
            localStorage.removeItem('adminToken');
            adminToken = null;
            isAuthenticated = false;
            showLoginModal();
            return;
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (data.url) {
            const img = modal.querySelector('.modal-image, .modal-image-circle');
            if (img) img.src = data.url;
            showToast('Image uploaded');
          } else showToast('Upload failed', true);
        } catch (err) {
          showToast('Upload error: ' + err.message, true);
        }
      };
      input.click();
    };
  }
  const beforeUpload = document.getElementById('beforeUpload');
  if (beforeUpload) {
    beforeUpload.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
          });
          if (res.status === 401) {
            localStorage.removeItem('adminToken');
            adminToken = null;
            isAuthenticated = false;
            showLoginModal();
            return;
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (data.url) document.getElementById('beforePreview').src = data.url;
          else showToast('Upload failed', true);
        } catch (err) {
          showToast('Upload error: ' + err.message, true);
        }
      };
      input.click();
    };
  }
  const afterUpload = document.getElementById('afterUpload');
  if (afterUpload) {
    afterUpload.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: formData
          });
          if (res.status === 401) {
            localStorage.removeItem('adminToken');
            adminToken = null;
            isAuthenticated = false;
            showLoginModal();
            return;
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (data.url) document.getElementById('afterPreview').src = data.url;
          else showToast('Upload failed', true);
        } catch (err) {
          showToast('Upload error: ' + err.message, true);
        }
      };
      input.click();
    };
  }

  document.getElementById('cancelBtn').onclick = () => modal.style.display = 'none';
  document.getElementById('deleteItemBtn').onclick = async () => {
    if (await confirmAction(`Delete this ${type} permanently?`)) {
      let url = '';
      if (type === 'trainer') url = `/api/trainers/${id}`;
      else if (type === 'transformation') url = `/api/transformations/${id}`;
      else if (type === 'member') url = `/api/members/${id}`;
      else if (type === 'dietPlan') url = `/api/dietplans/${id}`;
      else if (type === 'workoutPlan') url = `/api/workoutplans/${id}`;
      else if (type === 'membership') url = `/api/memberships/${id}`;
      else if (type === 'product') url = `/api/products/${id}`;
      else if (type === 'reel') url = `/api/reels/${id}`;
      else if (type === 'review') url = `/api/reviews/${id}`;
      const res = await fetchJSON(url, { method: 'DELETE' });
      if (res !== null) {
        modal.style.display = 'none';
        showToast('Deleted successfully');
        if (type === 'trainer') { trainers = await fetchJSON('/api/trainers') || []; renderTrainers(); }
        else if (type === 'transformation') { transformations = await fetchJSON('/api/transformations') || []; renderTransformations(); }
        else if (type === 'member') { members = await fetchJSON('/api/members') || []; renderMembersCarousel(); }
        else if (type === 'dietPlan') { dietPlans = await fetchJSON('/api/dietplans') || []; renderDietPlans(); }
        else if (type === 'workoutPlan') { workoutPlans = await fetchJSON('/api/workoutplans') || []; renderWorkoutPlans(); }
        else if (type === 'membership') { memberships = await fetchJSON('/api/memberships') || []; renderMemberships(); }
        else if (type === 'product') { products = await fetchJSON('/api/products') || []; renderProducts(); }
        else if (type === 'reel') { reels = await fetchJSON('/api/reels') || []; renderReelsCarousel(); }
        else if (type === 'review') { reviews = await fetchJSON('/api/reviews') || []; renderReviewsCarousel(); }
      } else showToast('Delete failed', true);
    }
  };
  document.getElementById('saveBtn').onclick = async () => {
    let updated = {};
    if (type === 'trainer') {
      const img = modal.querySelector('.modal-image');
      updated = {
        name: document.getElementById('editName').value,
        position: document.getElementById('editPosition').value,
        bio: document.getElementById('editBio').value,
        whatsappNumber: document.getElementById('editWhatsapp').value,
        instagramUrl: document.getElementById('editInstagram').value,
        photoUrl: img ? img.src : item.photoUrl
      };
    } else if (type === 'transformation') {
      updated = {
        beforeImage: document.getElementById('beforePreview').src,
        afterImage: document.getElementById('afterPreview').src
      };
    } else if (type === 'member') {
      const img = modal.querySelector('.modal-image-circle');
      updated = {
        name: document.getElementById('editName').value,
        age: parseInt(document.getElementById('editAge').value),
        position: document.getElementById('editPosition').value,
        feedback: document.getElementById('editFeedback').value,
        photoUrl: img ? img.src : item.photoUrl
      };
    } else if (type === 'dietPlan') {
      const img = modal.querySelector('.modal-image');
      updated = {
        title: document.getElementById('editTitle').value,
        shortDescription: document.getElementById('editDesc').value,
        targets: document.getElementById('editTargets').value.split(',').map(s => s.trim()),
        imageUrl: img ? img.src : item.imageUrl
      };
    } else if (type === 'workoutPlan') {
      const img = modal.querySelector('.modal-image');
      updated = {
        title: document.getElementById('editTitle').value,
        shortDescription: document.getElementById('editDesc').value,
        targets: document.getElementById('editTargets').value.split(',').map(s => s.trim()),
        imageUrl: img ? img.src : item.imageUrl
      };
    } else if (type === 'membership') {
      updated = {
        planName: document.getElementById('editName').value,
        price: parseInt(document.getElementById('editPrice').value),
        duration: document.getElementById('editDuration').value,
        description: document.getElementById('editDesc').value
      };
    } else if (type === 'product') {
      const img = modal.querySelector('.modal-image');
      updated = {
        name: document.getElementById('editName').value,
        price: parseInt(document.getElementById('editPrice').value),
        imageUrl: img ? img.src : item.imageUrl
      };
    } else if (type === 'reel') {
      updated = { videoUrl: document.getElementById('editUrl').value };
    } else if (type === 'review') {
      const img = modal.querySelector('.modal-image-circle');
      updated = {
        name: document.getElementById('editName').value,
        review: document.getElementById('editReview').value,
        rating: parseInt(document.getElementById('editRating').value),
        photoUrl: img ? img.src : item.photoUrl
      };
    }
    const res = await fetchJSON(`${endpoints[type]}/${id}`, { method: 'PUT', body: JSON.stringify(updated) });
    if (res) {
      modal.style.display = 'none';
      showToast('Updated successfully');
      if (type === 'trainer') { trainers = await fetchJSON('/api/trainers') || []; renderTrainers(); }
      else if (type === 'transformation') { transformations = await fetchJSON('/api/transformations') || []; renderTransformations(); }
      else if (type === 'member') { members = await fetchJSON('/api/members') || []; renderMembersCarousel(); }
      else if (type === 'dietPlan') { dietPlans = await fetchJSON('/api/dietplans') || []; renderDietPlans(); }
      else if (type === 'workoutPlan') { workoutPlans = await fetchJSON('/api/workoutplans') || []; renderWorkoutPlans(); }
      else if (type === 'membership') { memberships = await fetchJSON('/api/memberships') || []; renderMemberships(); }
      else if (type === 'product') { products = await fetchJSON('/api/products') || []; renderProducts(); }
      else if (type === 'reel') { reels = await fetchJSON('/api/reels') || []; renderReelsCarousel(); }
      else if (type === 'review') { reviews = await fetchJSON('/api/reviews') || []; renderReviewsCarousel(); }
    } else showToast('Update failed', true);
  };
}

function attachUpdateButtons() {
  document.querySelectorAll('.card-update-btn').forEach(btn => {
    btn.removeEventListener('click', handleUpdate);
    btn.addEventListener('click', handleUpdate);
  });
}
function handleUpdate(e) {
  const btn = e.currentTarget;
  const type = btn.getAttribute('data-type');
  const id = btn.getAttribute('data-id');
  const idx = btn.getAttribute('data-idx');
  if (type === 'gallery' && idx !== null) openEditModal('gallery', idx);
  else if (type && id) openEditModal(type, id);
}

// ========== FIXED EDIT HERO MODAL ==========
function openHeroModal() {
  const modal = document.getElementById('modalContainer');
  const currentImageUrl = siteSettings.heroBackgroundImage || '';

  modal.innerHTML = `
    <div class="premium-modal-card">
      <h3>Edit Hero Section</h3>
      <div class="field-group">
        <label>Current Hero Background Image</label>
        <div class="modal-image-container">
          <img id="heroBgPreview" class="modal-image" style="max-width:100%; max-height:200px; object-fit:contain; border:1px solid #FF6B00;" 
               src="${currentImageUrl}" 
               onerror="this.src='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22200%22%20height%3D%22100%22%3E%3Crect%20width%3D%22200%22%20height%3D%22100%22%20fill%3D%22%23333%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FF6B00%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E'">
        </div>
        <div class="image-upload-area" id="heroBgUpload">Upload New Background Image</div>
      </div>
      <div class="field-group">
        <label>Subheading</label>
        <input type="text" id="heroSubInput" value="${escapeHtml(siteSettings.heroSubheading || 'The Standard of Strength')}">
      </div>
      <div class="field-group">
        <label>Button Text</label>
        <input type="text" id="heroCtaInput" value="${escapeHtml(siteSettings.heroButtonText || 'Claim Your 3-Day VIP Pass')}">
      </div>
      <div class="modal-buttons">
        <button class="modal-btn-cancel" id="cancelBtn">Cancel</button>
        <button class="modal-btn-save" id="saveBtn">Save</button>
      </div>
    </div>
  `;
  modal.style.display = 'flex';

  let newImageUrl = currentImageUrl;
  const previewImg = document.getElementById('heroBgPreview');
  const uploadArea = document.getElementById('heroBgUpload');
  uploadArea.onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData
        });
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          adminToken = null;
          isAuthenticated = false;
          showLoginModal();
          return;
        }
        if (!res.ok) throw new Error(`Upload failed: HTTP ${res.status}`);
        const data = await res.json();
        if (data.url) {
          newImageUrl = data.url;
          previewImg.src = newImageUrl;
          showToast('Image uploaded. Click Save to apply.');
        } else {
          showToast('Upload failed: no URL returned', true);
        }
      } catch (err) {
        console.error(err);
        showToast('Upload error: ' + err.message, true);
      }
    };
    input.click();
  };
  document.getElementById('cancelBtn').onclick = () => modal.style.display = 'none';
  document.getElementById('saveBtn').onclick = async () => {
    const updatedSettings = {
      heroSubheading: document.getElementById('heroSubInput').value,
      heroButtonText: document.getElementById('heroCtaInput').value,
      heroBackgroundImage: newImageUrl
    };
    const res = await fetchJSON('/api/sitesettings', {
      method: 'PUT',
      body: JSON.stringify(updatedSettings)
    });
    if (res) {
      siteSettings = { ...siteSettings, ...updatedSettings };
      renderHero();
      modal.style.display = 'none';
      showToast('Hero section updated');
    } else {
      showToast('Update failed', true);
    }
  };
}

function openLogoModal() {
  const modal = document.getElementById('modalContainer');
  const currentLogo = siteSettings.logoUrl || 'DailyDoze logo.png';
  modal.innerHTML = `
    <div class="premium-modal-card">
      <h3>Edit Logo</h3>
      <div class="modal-image-container">
        <img id="currentLogoPreview" src="${currentLogo}" class="modal-image" style="max-width:150px;">
      </div>
      <div class="image-upload-area" id="logoUploadArea">Upload New Logo</div>
      <div class="modal-buttons">
        <button class="modal-btn-cancel" id="cancelBtn">Cancel</button>
        <button class="modal-btn-save" id="saveBtn">Save</button>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
  let newLogoUrl = currentLogo;
  document.getElementById('logoUploadArea').onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData
        });
        if (res.status === 401) {
          localStorage.removeItem('adminToken');
          adminToken = null;
          isAuthenticated = false;
          showLoginModal();
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.url) {
          newLogoUrl = data.url;
          document.getElementById('currentLogoPreview').src = newLogoUrl;
          showToast('Logo uploaded, click Save to apply');
        } else showToast('Upload failed', true);
      } catch (err) {
        showToast('Upload error: ' + err.message, true);
      }
    };
    input.click();
  };
  document.getElementById('cancelBtn').onclick = () => modal.style.display = 'none';
  document.getElementById('saveBtn').onclick = async () => {
    const res = await fetchJSON('/api/sitesettings', { method: 'PUT', body: JSON.stringify({ logoUrl: newLogoUrl }) });
    if (res) {
      siteSettings.logoUrl = newLogoUrl;
      renderHero();
      modal.style.display = 'none';
      showToast('Logo updated');
    } else showToast('Update failed', true);
  };
}

function openStatsModal() {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="premium-modal-card">
      <h3>Edit Statistics</h3>
      <div class="field-group"><label>Members Count</label><input type="number" id="statMembersInput" value="${stats.membersCount || 1500}"></div>
      <div class="field-group"><label>Trainers Count</label><input type="number" id="statTrainersInput" value="${stats.trainersCount || 20}"></div>
      <div class="field-group"><label>Transformations Count</label><input type="number" id="statTransformationsInput" value="${stats.transformationsCount || 500}"></div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelBtn">Cancel</button><button class="modal-btn-save" id="saveBtn">Save</button></div>
    </div>
  `;
  modal.style.display = 'flex';
  document.getElementById('cancelBtn').onclick = () => modal.style.display = 'none';
  document.getElementById('saveBtn').onclick = async () => {
    const updates = {
      membersCount: parseInt(document.getElementById('statMembersInput').value),
      trainersCount: parseInt(document.getElementById('statTrainersInput').value),
      transformationsCount: parseInt(document.getElementById('statTransformationsInput').value)
    };
    const res = await fetchJSON('/api/stats', { method: 'PUT', body: JSON.stringify(updates) });
    if (res) {
      stats = { ...stats, ...updates };
      renderStats();
      modal.style.display = 'none';
      showToast('Stats updated');
    } else showToast('Update failed', true);
  };
}

function openContactModal() {
  const modal = document.getElementById('modalContainer');
  modal.innerHTML = `
    <div class="premium-modal-card">
      <h3>Edit Contact Information</h3>
      <div class="field-group"><label>Phone</label><input type="text" id="editPhone" value="${escapeHtml(contactInfo.phone || '')}"></div>
      <div class="field-group"><label>WhatsApp</label><input type="text" id="editWhatsapp" value="${escapeHtml(contactInfo.whatsappNumber || '')}"></div>
      <div class="field-group"><label>Address</label><input type="text" id="editAddress" value="${escapeHtml(contactInfo.address || '')}"></div>
      <div class="field-group"><label>Facebook URL</label><input type="url" id="editFb" value="${escapeHtml(contactInfo.facebookUrl || '')}"></div>
      <div class="field-group"><label>Instagram URL</label><input type="url" id="editIg" value="${escapeHtml(contactInfo.instagramUrl || '')}"></div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelBtn">Cancel</button><button class="modal-btn-save" id="saveBtn">Save</button></div>
    </div>
  `;
  modal.style.display = 'flex';
  document.getElementById('cancelBtn').onclick = () => modal.style.display = 'none';
  document.getElementById('saveBtn').onclick = async () => {
    const updates = {
      phone: document.getElementById('editPhone').value,
      whatsappNumber: document.getElementById('editWhatsapp').value,
      address: document.getElementById('editAddress').value,
      facebookUrl: document.getElementById('editFb').value,
      instagramUrl: document.getElementById('editIg').value
    };
    const res = await fetchJSON('/api/contactinfo', { method: 'PUT', body: JSON.stringify(updates) });
    if (res) {
      contactInfo = { ...contactInfo, ...updates };
      renderContact();
      modal.style.display = 'none';
      showToast('Contact updated');
    } else showToast('Update failed', true);
  };
}

function editTrialButton() {
  const modal = document.getElementById('modalContainer');
  const currentText = document.getElementById('floatingCtaBtn').innerText;
  modal.innerHTML = `
    <div class="premium-modal-card">
      <h3>Edit Trial Button</h3>
      <div class="field-group"><label>Button Text</label><input type="text" id="trialText" value="${escapeHtml(currentText)}"></div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelBtn">Cancel</button><button class="modal-btn-save" id="saveBtn">Save</button></div>
    </div>
  `;
  modal.style.display = 'flex';
  document.getElementById('cancelBtn').onclick = () => modal.style.display = 'none';
  document.getElementById('saveBtn').onclick = async () => {
    const newText = document.getElementById('trialText').value;
    const res = await fetchJSON('/api/sitesettings', { method: 'PUT', body: JSON.stringify({ floatingButtonText: newText }) });
    if (res) {
      siteSettings.floatingButtonText = newText;
      renderHero();
      modal.style.display = 'none';
      showToast('Button text updated');
    } else showToast('Update failed', true);
  };
}

function editSectionHeading(sectionId) {
  const modal = document.getElementById('modalContainer');
  const currentText = document.getElementById(sectionId).innerText;
  modal.innerHTML = `
    <div class="premium-modal-card">
      <h3>Edit Section Heading</h3>
      <div class="field-group"><label>Heading Text</label><input type="text" id="headingText" value="${escapeHtml(currentText)}"></div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelBtn">Cancel</button><button class="modal-btn-save" id="saveBtn">Save</button></div>
    </div>
  `;
  modal.style.display = 'flex';
  document.getElementById('cancelBtn').onclick = () => modal.style.display = 'none';
  document.getElementById('saveBtn').onclick = async () => {
    const newText = document.getElementById('headingText').value;
    if (!newText) return;
    document.getElementById(sectionId).innerHTML = newText;
    sectionHeadings[sectionId] = newText;
    const fieldMap = {
      trainersHeading: 'trainersHeading',
      transformationsHeading: 'transformationsHeading',
      membersHeading: 'membersHeading',
      dietHeading: 'dietHeading',
      workoutHeading: 'workoutHeading',
      membershipHeading: 'membershipHeading',
      shopHeading: 'shopHeading',
      galleryHeading: 'galleryHeading',
      reelsHeading: 'reelsHeading',
      reviewsHeading: 'reviewsHeading'
    };
    const field = fieldMap[sectionId];
    if (field) {
      const update = { [field]: newText };
      const res = await fetchJSON('/api/sitesettings', { method: 'PUT', body: JSON.stringify(update) });
      if (res) showToast('Heading saved');
      else showToast('Failed to save heading', true);
    }
    modal.style.display = 'none';
  };
}

// AI Chat functionality (same as index.html)
const chatBubble = document.getElementById('chatBubble');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatCloseBtn');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSendBtn');

function toggleChatWindow(open) {
  if (open) chatWindow.classList.add('open');
  else chatWindow.classList.remove('open');
}

chatBubble.addEventListener('click', () => toggleChatWindow(true));
chatClose.addEventListener('click', () => toggleChatWindow(false));

async function sendChatMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'message user-message';
  userMsgDiv.textContent = message;
  chatMessages.appendChild(userMsgDiv);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const typingDiv = document.createElement('div');
  typingDiv.classList.add('typing-indicator');
  typingDiv.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch(`${API_BASE}/chat-groq`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();

    chatMessages.removeChild(typingDiv);

    if (response.ok && data.reply) {
      const botMsgDiv = document.createElement('div');
      botMsgDiv.className = 'message bot-message';
      botMsgDiv.textContent = data.reply;
      chatMessages.appendChild(botMsgDiv);
    } else {
      throw new Error(data.error || 'No response');
    }
  } catch (err) {
    console.error('Chat error:', err);
    chatMessages.removeChild(typingDiv);
    const errorMsgDiv = document.createElement('div');
    errorMsgDiv.className = 'message bot-message';
    errorMsgDiv.textContent = '🏋️ Sorry, I’m having trouble connecting. Please try again later.';
    chatMessages.appendChild(errorMsgDiv);
  }
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatSend.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendChatMessage();
});

// Trial modal openers (floating button only)
function openTrialModal() {
  const modal = document.getElementById('modalOverlay');
  if (modal) {
    document.getElementById('trialForm').reset();
    const msgDiv = document.getElementById('trialMessage');
    msgDiv.style.display = 'none';
    msgDiv.innerHTML = '';
    modal.style.display = 'flex';
  }
}

async function init() {
  if (!isAuthenticated) return;
  await loadAllData();
  renderHero();
  renderStats();
  renderTrainers();
  renderTransformations();
  renderMembersCarousel();
  renderDietPlans();
  renderWorkoutPlans();
  renderMemberships();
  renderProducts();
  renderGalleryCarousel();
  renderReelsCarousel();
  renderReviewsCarousel();
  renderContact();

  if (siteSettings.trainersHeading) document.getElementById('trainersHeading').innerHTML = siteSettings.trainersHeading;
  if (siteSettings.transformationsHeading) document.getElementById('transformationsHeading').innerHTML = siteSettings.transformationsHeading;
  if (siteSettings.membersHeading) document.getElementById('membersHeading').innerHTML = siteSettings.membersHeading;
  if (siteSettings.dietHeading) document.getElementById('dietHeading').innerHTML = siteSettings.dietHeading;
  if (siteSettings.workoutHeading) document.getElementById('workoutHeading').innerHTML = siteSettings.workoutHeading;
  if (siteSettings.membershipHeading) document.getElementById('membershipHeading').innerHTML = siteSettings.membershipHeading;
  if (siteSettings.shopHeading) document.getElementById('shopHeading').innerHTML = siteSettings.shopHeading;
  if (siteSettings.galleryHeading) document.getElementById('galleryHeading').innerHTML = siteSettings.galleryHeading;
  if (siteSettings.reelsHeading) document.getElementById('reelsHeading').innerHTML = siteSettings.reelsHeading;
  if (siteSettings.reviewsHeading) document.getElementById('reviewsHeading').innerHTML = siteSettings.reviewsHeading;

  document.getElementById('addTrainerBtn').onclick = () => addItem('trainer');
  document.getElementById('addTransformationBtn').onclick = () => addItem('transformation');
  document.getElementById('addMemberBtn').onclick = () => addItem('member');
  document.getElementById('addDietBtn').onclick = () => addItem('dietPlan');
  document.getElementById('addWorkoutBtn').onclick = () => addItem('workoutPlan');
  document.getElementById('addMembershipBtn').onclick = () => addItem('membership');
  document.getElementById('addProductBtn').onclick = () => addItem('product');
  document.getElementById('addGalleryBtn').onclick = () => addItem('gallery');
  document.getElementById('addReelBtn').onclick = () => addItem('reel');
  document.getElementById('addReviewBtn').onclick = () => addItem('review');

  document.getElementById('openHeroModalBtn').onclick = openHeroModal;
  document.getElementById('editStatsBtn').onclick = openStatsModal;
  document.getElementById('editContactBtn').onclick = openContactModal;
  document.getElementById('editHeroLogoBtn').onclick = openLogoModal;
  document.getElementById('editTrialBtn').onclick = editTrialButton;

  // Trial modal triggers: floating button only
  document.getElementById('floatingCtaBtn')?.addEventListener('click', openTrialModal);

  document.querySelectorAll('.edit-section-heading').forEach(btn => {
    const sectionId = btn.getAttribute('data-section');
    btn.onclick = () => editSectionHeading(sectionId);
  });

  const modalOverlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('closeModalBtn');
  if (closeBtn) closeBtn.onclick = () => modalOverlay.style.display = 'none';
  if (modalOverlay) modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) modalOverlay.style.display = 'none';
  };

  document.getElementById('submitTrialBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const name = document.getElementById('trialName').value.trim();
    const phone = document.getElementById('trialPhone').value.trim();
    const email = document.getElementById('trialEmail').value.trim();
    if (!name || !phone || !email) {
      const msgDiv = document.getElementById('trialMessage');
      msgDiv.innerText = 'Please fill in all fields.';
      msgDiv.className = 'trial-message error';
      msgDiv.style.display = 'block';
      setTimeout(() => msgDiv.style.display = 'none', 3000);
      return;
    }
    const submitBtn = document.getElementById('submitTrialBtn');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;
    try {
      const response = await fetch(`${API_BASE}/book-trial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email })
      });
      const data = await response.json();
      const msgDiv = document.getElementById('trialMessage');
      if (response.ok && data.success) {
        msgDiv.innerText = data.message || '✅ Trial booked! Check your email.';
        msgDiv.className = 'trial-message success';
        msgDiv.style.display = 'block';
        setTimeout(() => {
          modalOverlay.style.display = 'none';
          document.getElementById('trialForm').reset();
        }, 3000);
      } else {
        msgDiv.innerText = data.message || 'Something went wrong. Please try again.';
        msgDiv.className = 'trial-message error';
        msgDiv.style.display = 'block';
      }
    } catch (err) {
      const msgDiv = document.getElementById('trialMessage');
      msgDiv.innerText = 'Network error. Please try again.';
      msgDiv.className = 'trial-message error';
      msgDiv.style.display = 'block';
    } finally {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger) hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, (m) => {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

init();