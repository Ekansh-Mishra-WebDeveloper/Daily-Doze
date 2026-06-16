// modals.js – All modal templates for UltraFit Admin Panel
// Every modal follows: Title → Current Data Preview → Editable Fields → Upload Options → Cancel/Save

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

// ========== 1. HERO MODAL (existing, kept for reference) ==========
export function heroEditModal(currentHero) {
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-pencil-alt"></i> Edit Name & Image</h3>
      <img class="hero-bg-preview" src="${currentHero.bgImage || ''}" style="width:100%; border-radius:20px; margin-bottom:1rem;">
      <div class="field-group"><label>Main Heading</label><input type="text" id="editHeroHeading" value="${escapeHtml(currentHero.heading)}"></div>
      <div class="field-group"><label>Button Text</label><input type="text" id="editHeroCta" value="${escapeHtml(currentHero.cta)}"></div>
      <div class="field-group"><label>Upload Background Image</label><div class="image-upload-area" id="heroBgUploadArea"><i class="fas fa-cloud-upload-alt"></i> Click or drag to replace<input type="file" id="heroBgFile" accept="image/*" style="display: none;"></div></div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelHeroBtn">Cancel</button><button class="modal-btn-save" id="saveHeroBtn">Save</button></div>
    </div>
  `;
}

// ========== 2. STATS MODAL ==========
export function statsEditModal(stats) {
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-chart-line"></i> Edit Details</h3>
      <div class="stats-edit-row"><label>Members number</label><input type="number" id="editStatMembers" value="${stats.membersCount}"><input type="text" id="editStatMembersLabel" value="${escapeHtml(stats.membersLabel)}"></div>
      <div class="stats-edit-row"><label>Trainers number</label><input type="number" id="editStatTrainers" value="${stats.trainersCount}"><input type="text" id="editStatTrainersLabel" value="${escapeHtml(stats.trainersLabel)}"></div>
      <div class="stats-edit-row"><label>Transformations number</label><input type="number" id="editStatTransformations" value="${stats.transformationsCount}"><input type="text" id="editStatTransformationsLabel" value="${escapeHtml(stats.transformationsLabel)}"></div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelStatsBtn">Cancel</button><button class="modal-btn-save" id="saveStatsBtn">Save</button></div>
    </div>
  `;
}

// ========== 3. TRAINER MODAL ==========
export function trainerEditModal(trainer) {
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-user"></i> Edit Trainer</h3>
      <img id="trainerPreview" class="image-preview-large" src="${trainer.photoUrl || ''}" style="width:100%; border-radius:20px; margin-bottom:1rem;">
      <div class="field-group"><label>Name</label><input type="text" id="trainerName" value="${escapeHtml(trainer.name)}"></div>
      <div class="field-group"><label>Position</label><input type="text" id="trainerPosition" value="${escapeHtml(trainer.position)}"></div>
      <div class="field-group"><label>Short Bio</label><textarea id="trainerBio">${escapeHtml(trainer.bio || '')}</textarea></div>
      <div class="field-group"><label>WhatsApp Link</label><input type="text" id="trainerWhatsapp" value="${escapeHtml(trainer.whatsappNumber || '')}"></div>
      <div class="field-group"><label>Instagram Link</label><input type="text" id="trainerInstagram" value="${escapeHtml(trainer.instagramUrl || '')}"></div>
      <div class="image-upload-area" id="trainerUploadArea"><i class="fas fa-cloud-upload-alt"></i> Upload new image<input type="file" id="trainerFile" accept="image/*" style="display: none;"></div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelTrainerBtn">Cancel</button><button class="modal-btn-save" id="saveTrainerBtn">Save</button></div>
    </div>
  `;
}

// ========== 4. TRANSFORMATION MODAL ==========
export function transformationEditModal(trans) {
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-exchange-alt"></i> Edit Before vs After</h3>
      <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
        <div style="flex:1"><label>Before Image</label><img id="transBeforePreview" class="image-preview-large" src="${trans.beforeImage || ''}" style="height:150px; object-fit:cover;"><div class="image-upload-area" id="transBeforeUpload"><i class="fas fa-cloud-upload-alt"></i> Upload Before</div></div>
        <div style="flex:1"><label>After Image</label><img id="transAfterPreview" class="image-preview-large" src="${trans.afterImage || ''}" style="height:150px; object-fit:cover;"><div class="image-upload-area" id="transAfterUpload"><i class="fas fa-cloud-upload-alt"></i> Upload After</div></div>
      </div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelTransBtn">Cancel</button><button class="modal-btn-save" id="saveTransBtn">Save</button></div>
    </div>
  `;
}

// ========== 5. LOGO MODAL ==========
export function logoEditModal(currentLogoUrl) {
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-image"></i> Update Logo</h3>
      <img id="logoPreview" class="image-preview-large" src="${currentLogoUrl || ''}" style="width:100%; border-radius:20px; margin-bottom:1rem;">
      <div class="image-upload-area" id="logoUploadArea"><i class="fas fa-cloud-upload-alt"></i> Drag & drop or click to upload new logo<input type="file" id="logoFile" accept="image/*" style="display: none;"></div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelLogoBtn">Cancel</button><button class="modal-btn-save" id="saveLogoBtn">Save</button></div>
    </div>
  `;
}

// ========== 6. DIET MODAL ==========
export function dietEditModal(diet) {
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-leaf"></i> Edit Diet</h3>
      <img class="image-preview-large" src="${diet.imageUrl || ''}" style="width:100%; border-radius:20px; margin-bottom:1rem;">
      <div class="field-group"><label>Name</label><input type="text" id="dietName" value="${escapeHtml(diet.title)}"></div>
      <div class="field-group"><label>Short Description</label><input type="text" id="dietDesc" value="${escapeHtml(diet.shortDescription)}"></div>
      <div class="field-group"><label>Tag 1</label><input type="text" id="dietTag1" value="${escapeHtml(diet.targets?.[0] || '')}"></div>
      <div class="field-group"><label>Tag 2</label><input type="text" id="dietTag2" value="${escapeHtml(diet.targets?.[1] || '')}"></div>
      <div class="image-upload-area" id="dietUploadArea"><i class="fas fa-cloud-upload-alt"></i> Upload new image<input type="file" id="dietFile" accept="image/*" style="display: none;"></div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelDietBtn">Cancel</button><button class="modal-btn-save" id="saveDietBtn">Save</button></div>
    </div>
  `;
}

// ========== 7. WORKOUT MODAL ==========
export function workoutEditModal(workout) {
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-dumbbell"></i> Edit Workout</h3>
      <img class="image-preview-large" src="${workout.imageUrl || ''}" style="width:100%; border-radius:20px; margin-bottom:1rem;">
      <div class="field-group"><label>Name</label><input type="text" id="workoutName" value="${escapeHtml(workout.title)}"></div>
      <div class="field-group"><label>Short Description</label><input type="text" id="workoutDesc" value="${escapeHtml(workout.shortDescription)}"></div>
      <div class="field-group"><label>Tag 1</label><input type="text" id="workoutTag1" value="${escapeHtml(workout.targets?.[0] || '')}"></div>
      <div class="field-group"><label>Tag 2</label><input type="text" id="workoutTag2" value="${escapeHtml(workout.targets?.[1] || '')}"></div>
      <div class="image-upload-area" id="workoutUploadArea"><i class="fas fa-cloud-upload-alt"></i> Upload new image<input type="file" id="workoutFile" accept="image/*" style="display: none;"></div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelWorkoutBtn">Cancel</button><button class="modal-btn-save" id="saveWorkoutBtn">Save</button></div>
    </div>
  `;
}

// ========== 8. MEMBERSHIP MODAL ==========
export function membershipEditModal(plan) {
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-id-card"></i> Edit Price</h3>
      <div class="field-group"><label>Plan Name</label><input type="text" id="membershipName" value="${escapeHtml(plan.planName)}"></div>
      <div class="field-group"><label>Price</label><input type="number" id="membershipPrice" value="${plan.price}"></div>
      <div class="field-group"><label>Duration (e.g., /month or /3 months)</label><input type="text" id="membershipDuration" value="${escapeHtml(plan.duration)}"></div>
      <div class="field-group"><label>Short Description</label><textarea id="membershipDesc">${escapeHtml(plan.description)}</textarea></div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelMembershipBtn">Cancel</button><button class="modal-btn-save" id="saveMembershipBtn">Save</button></div>
    </div>
  `;
}

// ========== 9. SHOP (PRODUCT) MODAL ==========
export function productEditModal(product) {
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-store"></i> Edit Product</h3>
      <img class="image-preview-large" src="${product.imageUrl || ''}" style="width:100%; border-radius:20px; margin-bottom:1rem;">
      <div class="field-group"><label>Name</label><input type="text" id="productName" value="${escapeHtml(product.name)}"></div>
      <div class="field-group"><label>Price</label><input type="number" id="productPrice" value="${product.price}"></div>
      <div class="image-upload-area" id="productUploadArea"><i class="fas fa-cloud-upload-alt"></i> Replace image<input type="file" id="productFile" accept="image/*" style="display: none;"></div>
      <div class="modal-buttons"><button class="modal-btn-cancel" id="cancelProductBtn">Cancel</button><button class="modal-btn-save" id="saveProductBtn">Save</button></div>
    </div>
  `;
}

// ========== 10. GALLERY MODAL (grid of images) ==========
export function galleryEditModal(images) {
  const imagesHtml = (images || []).map((img, idx) => `
    <div class="gallery-edit-item" style="margin-bottom:1rem; border:1px solid #333; border-radius:16px; padding:0.5rem;">
      <img src="${img}" style="width:100%; border-radius:12px; margin-bottom:0.5rem;">
      <div class="image-upload-area" data-gallery-idx="${idx}"><i class="fas fa-cloud-upload-alt"></i> Replace image<input type="file" class="gallery-file" data-idx="${idx}" accept="image/*" style="display: none;"></div>
    </div>
  `).join('');
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-images"></i> Edit Gallery</h3>
      <div id="galleryImagesContainer">${imagesHtml}</div>
      <div class="modal-buttons">
        <button class="modal-btn-cancel" id="cancelGalleryBtn">Cancel</button>
        <button class="modal-btn-save" id="saveGalleryBtn">Save</button>
      </div>
    </div>
  `;
}

// ========== 11. REELS MODAL ==========
export function reelsEditModal(reels) {
  const reelsHtml = (reels || []).map((reel, idx) => `
    <div class="reel-edit-item" style="margin-bottom:1rem; border:1px solid #333; border-radius:16px; padding:0.5rem;">
      <video src="${reel.videoUrl}" controls style="width:100%; border-radius:12px; margin-bottom:0.5rem;"></video>
      <div class="field-group"><label>Video URL</label><input type="text" class="reel-url" data-idx="${idx}" value="${escapeHtml(reel.videoUrl)}" style="width:100%;"></div>
      <div class="field-group"><label>Thumbnail URL</label><input type="text" class="reel-thumb" data-idx="${idx}" value="${escapeHtml(reel.thumbnail || '')}" style="width:100%;"></div>
    </div>
  `).join('');
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-video"></i> Edit Reels</h3>
      <div id="reelsContainer">${reelsHtml}</div>
      <div class="modal-buttons">
        <button class="modal-btn-cancel" id="cancelReelsBtn">Cancel</button>
        <button class="modal-btn-save" id="saveReelsBtn">Save</button>
      </div>
    </div>
  `;
}

// ========== 12. REVIEWS MODAL ==========
export function reviewsEditModal(reviews) {
  const reviewsHtml = (reviews || []).map((rev, idx) => `
    <div class="review-edit-item" style="margin-bottom:1rem; border:1px solid #333; border-radius:16px; padding:0.5rem;">
      <img class="image-preview-large" src="${rev.photoUrl || ''}" style="width:80px; height:80px; border-radius:50%; object-fit:cover; margin-bottom:0.5rem;">
      <div class="field-group"><label>Name</label><input type="text" class="review-name" data-idx="${idx}" value="${escapeHtml(rev.name)}"></div>
      <div class="field-group"><label>Review Text</label><textarea class="review-text" data-idx="${idx}">${escapeHtml(rev.review)}</textarea></div>
      <div class="field-group"><label>Rating (1-5)</label><input type="number" class="review-rating" data-idx="${idx}" min="1" max="5" value="${rev.rating || 5}"></div>
      <div class="image-upload-area" data-review-idx="${idx}"><i class="fas fa-cloud-upload-alt"></i> Upload profile image<input type="file" class="review-file" data-idx="${idx}" accept="image/*" style="display: none;"></div>
    </div>
  `).join('');
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-star"></i> Edit Reviews</h3>
      <div id="reviewsContainer">${reviewsHtml}</div>
      <div class="modal-buttons">
        <button class="modal-btn-cancel" id="cancelReviewsBtn">Cancel</button>
        <button class="modal-btn-save" id="saveReviewsBtn">Save</button>
      </div>
    </div>
  `;
}

// ========== 13. MEMBERS MODAL ==========
export function membersEditModal(members) {
  const membersHtml = (members || []).map((mem, idx) => `
    <div class="member-edit-item" style="margin-bottom:1rem; border:1px solid #333; border-radius:16px; padding:0.5rem;">
      <img class="image-preview-large" src="${mem.photoUrl || ''}" style="width:80px; height:80px; border-radius:50%; object-fit:cover; margin-bottom:0.5rem;">
      <div class="field-group"><label>Name</label><input type="text" class="member-name" data-idx="${idx}" value="${escapeHtml(mem.name)}"></div>
      <div class="field-group"><label>Age</label><input type="number" class="member-age" data-idx="${idx}" value="${mem.age}"></div>
      <div class="field-group"><label>Feedback</label><textarea class="member-feedback" data-idx="${idx}">${escapeHtml(mem.feedback || '')}</textarea></div>
      <div class="image-upload-area" data-member-idx="${idx}"><i class="fas fa-cloud-upload-alt"></i> Upload profile image<input type="file" class="member-file" data-idx="${idx}" accept="image/*" style="display: none;"></div>
    </div>
  `).join('');
  return `
    <div class="premium-modal-card">
      <h3><i class="fas fa-users"></i> Edit Members</h3>
      <div id="membersContainer">${membersHtml}</div>
      <div class="modal-buttons">
        <button class="modal-btn-cancel" id="cancelMembersBtn">Cancel</button>
        <button class="modal-btn-save" id="saveMembersBtn">Save</button>
      </div>
    </div>
  `;
}

// ========== CONFIRM & SUCCESS MODALS ==========
export function confirmModal(message) {
  return `
    <div class="confirm-card">
      <p>${escapeHtml(message)}</p>
      <button class="confirm-yes" id="confirmYesBtn">Yes</button>
      <button class="confirm-no" id="confirmNoBtn">No</button>
    </div>
  `;
}

export function successModal(message) {
  return `
    <div class="success-card">
      <p>${escapeHtml(message)}</p>
      <button id="successOkBtn">OK</button>
    </div>
  `;
}